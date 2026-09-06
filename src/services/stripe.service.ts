import Stripe from "stripe";
import { env } from "@/config/env";

export class StripeService {
  private static client: Stripe | null = null;

  private static getSecretKey() {
    const secretKey =
      env.STRIPE_SECRET_KEY?.trim();

    if (!secretKey) {
      throw new Error(
        "STRIPE_NOT_CONFIGURED"
      );
    }

    return secretKey;
  }

  static getClient() {
    if (!this.client) {
      this.client =
        new Stripe(
          this.getSecretKey()
        );
    }

    return this.client;
  }

  static getPublishableKey() {
    const publishableKey =
      env
        .NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
        ?.trim();

    if (!publishableKey) {
      throw new Error(
        "STRIPE_PUBLISHABLE_KEY_NOT_CONFIGURED"
      );
    }

    return publishableKey;
  }

  static async createPaymentIntent(
    input: {
      paymentId: number;
      sessionId: string;
      establishmentId: number;
      amount: string;
      currency: string;
    }
  ) {
    const amount =
      Number(
        input.amount
      );

    if (
      !Number.isFinite(
        amount
      ) ||
      amount <= 0
    ) {
      throw new Error(
        "STRIPE_INVALID_AMOUNT"
      );
    }

    const amountInMinorUnits =
      Math.round(
        amount *
          100
      );

    const currency =
      input.currency
        .trim()
        .toLowerCase();

    if (
      !currency
    ) {
      throw new Error(
        "STRIPE_INVALID_CURRENCY"
      );
    }

    const stripe =
      this.getClient();

    return stripe.paymentIntents.create(
      {
        amount:
          amountInMinorUnits,

        currency,

        automatic_payment_methods: {
          enabled:
            true,

          allow_redirects:
            "never",
        },

        metadata: {
          yamarPaymentId:
            String(
              input.paymentId
            ),

          sessionId:
            input.sessionId,

          establishmentId:
            String(
              input.establishmentId
            ),
        },
      },
      {
        idempotencyKey:
          `yamar-payment-${input.paymentId}`,
      }
    );
  }

  static async createFullRefund(
    input: {
      paymentId: number;
      sessionId: string;
      establishmentId: number;
      paymentIntentId: string;
    }
  ) {
    const paymentIntentId =
      input.paymentIntentId.trim();

    if (
      !paymentIntentId
    ) {
      throw new Error(
        "STRIPE_PAYMENT_INTENT_REQUIRED"
      );
    }

    const stripe =
      this.getClient();

    return stripe.refunds.create(
      {
        payment_intent:
          paymentIntentId,

        metadata: {
          yamarPaymentId:
            String(
              input.paymentId
            ),

          sessionId:
            input.sessionId,

          establishmentId:
            String(
              input.establishmentId
            ),
        },
      },
      {
        /*
         * Impide devolver dos veces
         * el dinero aunque el cliente,
         * proxy o servidor repita
         * la misma solicitud.
         */
        idempotencyKey:
          `yamar-refund-${input.paymentId}`,
      }
    );
  }

  static constructWebhookEvent(
    payload:
      | string
      | Buffer,
    signature: string
  ) {
    const webhookSecret =
      env
        .STRIPE_WEBHOOK_SECRET
        ?.trim();

    if (
      !webhookSecret
    ) {
      throw new Error(
        "STRIPE_WEBHOOK_NOT_CONFIGURED"
      );
    }

    return this
      .getClient()
      .webhooks
      .constructEvent(
        payload,
        signature,
        webhookSecret
      );
  }
}