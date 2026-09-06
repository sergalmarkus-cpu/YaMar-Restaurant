import { Logger } from "@/services/logger.service";
import { PaymentService } from "@/services/payment.service";
import { StripeService } from "@/services/stripe.service";

/*
 * ============================================================
 * STRIPE WEBHOOK
 * ============================================================
 *
 * Seguridad:
 *
 * - NO hacemos request.json().
 * - Stripe necesita el body RAW para validar la firma.
 * - Se verifica stripe-signature con STRIPE_WEBHOOK_SECRET.
 * - Solo después de verificar la firma procesamos el evento.
 *
 * Flujo payment_intent.succeeded:
 *
 * Stripe
 *   → firma válida
 *   → PaymentIntent conocido
 *   → metadata válida
 *   → importe válido
 *   → payment pending → paid
 *   → settlement
 *   → cierre de sesión
 *   → liberación de mesa
 *   → recibo
 *
 * Los reintentos de Stripe son seguros porque
 * updateStatusForEstablishment() ya es idempotente.
 */

export async function POST(
  request: Request
) {
  try {
    /*
     * ========================================================
     * 1. FIRMA STRIPE
     * ========================================================
     */

    const signature =
      request.headers.get(
        "stripe-signature"
      );

    if (
      !signature
    ) {
      Logger.error(
        "Webhook Stripe sin firma."
      );

      return Response.json(
        {
          success: false,
          error:
            "STRIPE_SIGNATURE_MISSING",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * MUY IMPORTANTE:
     *
     * Stripe verifica la firma utilizando exactamente
     * los bytes/texto recibidos.
     *
     * No cambiar por request.json().
     */

    const rawBody =
      await request.text();

    let event;

    try {
      event =
        StripeService
          .constructWebhookEvent(
            rawBody,
            signature
          );
    } catch (
      error: unknown
    ) {
      Logger.error(
        "Firma de webhook Stripe inválida.",
        error
      );

      return Response.json(
        {
          success: false,
          error:
            "STRIPE_WEBHOOK_SIGNATURE_INVALID",
        },
        {
          status: 400,
        }
      );
    }

    Logger.info(
      "Webhook Stripe recibido",
      {
        eventId:
          event.id,

        eventType:
          event.type,
      }
    );

    /*
     * ========================================================
     * 2. PAYMENT INTENT SUCCEEDED
     * ========================================================
     */

    if (
      event.type ===
      "payment_intent.succeeded"
    ) {
      const paymentIntent =
        event.data.object;

      const payment =
        await PaymentService
          .getByStripePaymentIntentId(
            paymentIntent.id
          );

      /*
       * No aceptamos PaymentIntents que Stripe conozca pero
       * YaMar no tenga vinculados a un payment propio.
       *
       * Devolvemos error para que Stripe pueda reintentar
       * mientras investigamos/recuperamos el estado.
       */
      if (
        !payment
      ) {
        Logger.error(
          "PaymentIntent Stripe sin pago YaMar asociado.",
          {
            eventId:
              event.id,

            paymentIntentId:
              paymentIntent.id,
          }
        );

        return Response.json(
          {
            success: false,
            error:
              "STRIPE_PAYMENT_NOT_FOUND",
          },
          {
            status: 500,
          }
        );
      }

      /*
       * Solo los pagos de tarjeta deben llegar por este flujo.
       */
      if (
        payment.method !==
        "card"
      ) {
        Logger.error(
          "PaymentIntent vinculado a un método de pago no compatible.",
          {
            paymentId:
              payment.id,

            method:
              payment.method,

            paymentIntentId:
              paymentIntent.id,
          }
        );

        return Response.json(
          {
            success: false,
            error:
              "STRIPE_PAYMENT_METHOD_MISMATCH",
          },
          {
            status: 500,
          }
        );
      }

      /*
       * ======================================================
       * 3. VALIDAR METADATA SERVIDOR ↔ STRIPE
       * ======================================================
       *
       * Esta metadata fue creada por nuestro StripeService.
       *
       * Aunque el webhook ya está criptográficamente firmado,
       * también comprobamos que el PaymentIntent corresponde
       * exactamente al payment que estamos a punto de marcar
       * como pagado.
       */

      const metadataPaymentId =
        paymentIntent
          .metadata
          .yamarPaymentId;

      const metadataSessionId =
        paymentIntent
          .metadata
          .sessionId;

      const metadataEstablishmentId =
        paymentIntent
          .metadata
          .establishmentId;

      if (
        metadataPaymentId !==
        String(
          payment.id
        )
      ) {
        Logger.error(
          "Stripe metadata paymentId no coincide.",
          {
            paymentId:
              payment.id,

            metadataPaymentId,

            paymentIntentId:
              paymentIntent.id,
          }
        );

        return Response.json(
          {
            success: false,
            error:
              "STRIPE_PAYMENT_ID_MISMATCH",
          },
          {
            status: 500,
          }
        );
      }

      if (
        metadataSessionId !==
        payment.sessionId
      ) {
        Logger.error(
          "Stripe metadata sessionId no coincide.",
          {
            paymentId:
              payment.id,

            paymentSessionId:
              payment.sessionId,

            metadataSessionId,

            paymentIntentId:
              paymentIntent.id,
          }
        );

        return Response.json(
          {
            success: false,
            error:
              "STRIPE_SESSION_ID_MISMATCH",
          },
          {
            status: 500,
          }
        );
      }

      if (
        metadataEstablishmentId !==
        String(
          payment.establishmentId
        )
      ) {
        Logger.error(
          "Stripe metadata establishmentId no coincide.",
          {
            paymentId:
              payment.id,

            establishmentId:
              payment.establishmentId,

            metadataEstablishmentId,

            paymentIntentId:
              paymentIntent.id,
          }
        );

        return Response.json(
          {
            success: false,
            error:
              "STRIPE_ESTABLISHMENT_ID_MISMATCH",
          },
          {
            status: 500,
          }
        );
      }

      /*
       * ======================================================
       * 4. VALIDAR IMPORTE
       * ======================================================
       *
       * payments.amount está almacenado con dos decimales.
       * Stripe trabaja en la unidad monetaria mínima.
       *
       * Para EUR:
       *
       * 12.50 € → 1250
       */

      const expectedAmount =
        Math.round(
          Number(
            payment.amount
          ) *
            100
        );

      if (
        !Number.isSafeInteger(
          expectedAmount
        ) ||
        expectedAmount <= 0
      ) {
        Logger.error(
          "Importe YaMar inválido durante webhook Stripe.",
          {
            paymentId:
              payment.id,

            amount:
              payment.amount,
          }
        );

        return Response.json(
          {
            success: false,
            error:
              "INVALID_PAYMENT_AMOUNT",
          },
          {
            status: 500,
          }
        );
      }

      if (
        paymentIntent.amount !==
        expectedAmount
      ) {
        Logger.error(
          "Importe del PaymentIntent no coincide con el pago YaMar.",
          {
            paymentId:
              payment.id,

            expectedAmount,

            stripeAmount:
              paymentIntent.amount,

            paymentIntentId:
              paymentIntent.id,
          }
        );

        return Response.json(
          {
            success: false,
            error:
              "STRIPE_AMOUNT_MISMATCH",
          },
          {
            status: 500,
          }
        );
      }

      /*
       * Un payment_intent.succeeded debería tener cubierto
       * el importe del PaymentIntent.
       */
      if (
        paymentIntent.amount_received <
        expectedAmount
      ) {
        Logger.error(
          "Stripe informa succeeded pero el importe recibido es insuficiente.",
          {
            paymentId:
              payment.id,

            expectedAmount,

            amountReceived:
              paymentIntent
                .amount_received,

            paymentIntentId:
              paymentIntent.id,
          }
        );

        return Response.json(
          {
            success: false,
            error:
              "STRIPE_AMOUNT_RECEIVED_MISMATCH",
          },
          {
            status: 500,
          }
        );
      }

      /*
       * ======================================================
       * 5. CONFIRMACIÓN AUTORITATIVA
       * ======================================================
       *
       * Esta función ya protege:
       *
       * - transición de estados;
       * - idempotencia;
       * - concurrencia;
       * - sobrepago;
       * - settlement.
       */

      const result =
        await PaymentService
          .updateStatusForEstablishment(
            payment.id,
            payment.establishmentId,
            "paid"
          );

      if (
        !result
      ) {
        Logger.error(
          "No fue posible confirmar el pago Stripe.",
          {
            paymentId:
              payment.id,

            paymentIntentId:
              paymentIntent.id,
          }
        );

        return Response.json(
          {
            success: false,
            error:
              "STRIPE_PAYMENT_CONFIRMATION_FAILED",
          },
          {
            status: 500,
          }
        );
      }

      Logger.info(
        "Pago Stripe confirmado correctamente.",
        {
          eventId:
            event.id,

          paymentId:
            result
              .payment
              .id,

          paymentIntentId:
            paymentIntent.id,

          status:
            result
              .payment
              .status,

          fullyPaid:
            result
              .settlement
              ?.fullyPaid ??
            false,

          sessionClosed:
            result
              .settlement
              ?.sessionClosed ??
            false,
        }
      );

      return Response.json(
        {
          received: true,
        },
        {
          status: 200,
        }
      );
    }

    /*
     * ========================================================
     * 6. PAYMENT FAILED
     * ========================================================
     *
     * El enum actual de YaMar no tiene estado "failed".
     *
     * Por tanto NO inventamos una transición nueva.
     * Conservamos el payment como pending y registramos
     * el evento.
     */

    if (
      event.type ===
      "payment_intent.payment_failed"
    ) {
      const paymentIntent =
        event.data.object;

      Logger.error(
        "PaymentIntent Stripe fallido.",
        {
          eventId:
            event.id,

          paymentIntentId:
            paymentIntent.id,

          failureMessage:
            paymentIntent
              .last_payment_error
              ?.message ??
            null,
        }
      );

      return Response.json(
        {
          received: true,
        },
        {
          status: 200,
        }
      );
    }

    /*
     * ========================================================
     * 7. EVENTOS NO UTILIZADOS
     * ========================================================
     *
     * Stripe envía muchos tipos de eventos.
     *
     * Un evento firmado pero irrelevante para este endpoint
     * debe devolver 200 para que Stripe no lo reintente
     * innecesariamente.
     */

    Logger.info(
      "Evento Stripe ignorado.",
      {
        eventId:
          event.id,

        eventType:
          event.type,
      }
    );

    return Response.json(
      {
        received: true,
      },
      {
        status: 200,
      }
    );
  } catch (
    error: unknown
  ) {
    /*
     * Los errores internos reciben 500.
     *
     * Esto es intencionado:
     * Stripe podrá volver a entregar el evento.
     */

    Logger.error(
      "Error procesando webhook Stripe.",
      error
    );

    return Response.json(
      {
        success: false,
        error:
          "STRIPE_WEBHOOK_PROCESSING_ERROR",
      },
      {
        status: 500,
      }
    );
  }
}