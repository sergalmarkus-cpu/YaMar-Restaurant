"use client";

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  loadStripe,
} from "@stripe/stripe-js";

import type {
  Stripe,
  StripeElements,
  StripePaymentElement,
} from "@stripe/stripe-js";

import {
  Button,
} from "@/components/ui/button";

interface StripePaymentElementProps {
  clientSecret: string;
  publishableKey: string;
  amountLabel: string;
  onSuccess: () => void | Promise<void>;
  onCancel: () => void;
}

export function StripePaymentElementForm({
  clientSecret,
  publishableKey,
  amountLabel,
  onSuccess,
  onCancel,
}: StripePaymentElementProps) {
  const containerRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const stripeRef =
    useRef<Stripe | null>(
      null
    );

  const elementsRef =
    useRef<StripeElements | null>(
      null
    );

  const paymentElementRef =
    useRef<StripePaymentElement | null>(
      null
    );

  const [
    ready,
    setReady,
  ] =
    useState(
      false
    );

  const [
    processing,
    setProcessing,
  ] =
    useState(
      false
    );

  const [
    error,
    setError,
  ] =
    useState(
      ""
    );

  useEffect(
    () => {
      let cancelled =
        false;

      async function mountStripe() {
        try {
          setReady(
            false
          );

          setError(
            ""
          );

          const stripe =
            await loadStripe(
              publishableKey
            );

          if (
            cancelled
          ) {
            return;
          }

          if (
            !stripe
          ) {
            throw new Error(
              "No se pudo inicializar Stripe."
            );
          }

          if (
            !containerRef.current
          ) {
            throw new Error(
              "No se pudo preparar el formulario de pago."
            );
          }

          const elements =
            stripe.elements({
              clientSecret,
              appearance: {
                theme:
                  "stripe",
              },
            });

          const paymentElement =
            elements.create(
              "payment",
              {
                layout:
                  "tabs",
              }
            );

          paymentElement.mount(
            containerRef.current
          );

          paymentElement.on(
            "ready",
            () => {
              if (
                !cancelled
              ) {
                setReady(
                  true
                );
              }
            }
          );

          paymentElement.on(
            "loaderror",
            (event) => {
              if (
                cancelled
              ) {
                return;
              }

              setError(
                event.error?.message ||
                  "No se pudo cargar el formulario de pago."
              );
            }
          );

          stripeRef.current =
            stripe;

          elementsRef.current =
            elements;

          paymentElementRef.current =
            paymentElement;
        } catch (
          mountError
        ) {
          console.error(
            "Error initializing Stripe Payment Element:",
            mountError
          );

          if (
            cancelled
          ) {
            return;
          }

          setError(
            mountError instanceof
              Error
              ? mountError.message
              : "No se pudo inicializar Stripe."
          );
        }
      }

      void mountStripe();

      return () => {
        cancelled =
          true;

        paymentElementRef.current?.destroy();

        paymentElementRef.current =
          null;

        elementsRef.current =
          null;

        stripeRef.current =
          null;
      };
    },
    [
      clientSecret,
      publishableKey,
    ]
  );

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      processing
    ) {
      return;
    }

    const stripe =
      stripeRef.current;

    const elements =
      elementsRef.current;

    if (
      !stripe ||
      !elements
    ) {
      setError(
        "El formulario de pago todavía no está preparado."
      );

      return;
    }

    try {
      setProcessing(
        true
      );

      setError(
        ""
      );

      const submitResult =
        await elements.submit();

      if (
        submitResult.error
      ) {
        throw new Error(
          submitResult.error.message ||
            "Revisa los datos de pago."
        );
      }

      const result =
        await stripe.confirmPayment({
          elements,
          redirect:
            "if_required",
        });

      if (
        result.error
      ) {
        throw new Error(
          result.error.message ||
            "Stripe no pudo completar el pago."
        );
      }

      const paymentIntent =
        result.paymentIntent;

      if (
        !paymentIntent
      ) {
        throw new Error(
          "Stripe no devolvió el estado del pago."
        );
      }

      if (
        paymentIntent.status ===
        "succeeded"
      ) {
        await onSuccess();

        return;
      }

      if (
        paymentIntent.status ===
          "processing" ||
        paymentIntent.status ===
          "requires_capture"
      ) {
        await onSuccess();

        return;
      }

      throw new Error(
        `El pago no se ha completado. Estado: ${paymentIntent.status}.`
      );
    } catch (
      paymentError
    ) {
      console.error(
        "Stripe payment error:",
        paymentError
      );

      setError(
        paymentError instanceof
          Error
          ? paymentError.message
          : "No se pudo completar el pago."
      );
    } finally {
      setProcessing(
        false
      );
    }
  }

  return (
    <form
      onSubmit={
        handleSubmit
      }
      className="space-y-4"
    >
      <div>
        <h3 className="text-lg font-semibold">
          Pago seguro
        </h3>

        <p className="mt-1 text-sm text-gray-600">
          Importe a pagar:{" "}
          <span className="font-semibold text-gray-900">
            {
              amountLabel
            }
          </span>
        </p>
      </div>

      <div
        ref={
          containerRef
        }
        className="min-h-[120px] rounded-lg border bg-white p-4"
      />

      {
        !ready &&
        !error && (
          <p className="text-sm text-gray-500">
            Preparando el pago seguro...
          </p>
        )
      }

      {
        error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {
              error
            }
          </div>
        )
      }

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          type="submit"
          className="flex-1"
          disabled={
            !ready ||
            processing
          }
        >
          {
            processing
              ? "Procesando pago..."
              : `Pagar ${amountLabel}`
          }
        </Button>

        <Button
          type="button"
          variant="outline"
          disabled={
            processing
          }
          onClick={
            onCancel
          }
        >
          Cancelar
        </Button>
      </div>

      <p className="text-xs text-gray-500">
        Los datos de tu tarjeta se envían directamente a Stripe.
        YaMar no almacena el número de tarjeta, la fecha de caducidad
        ni el CVC.
      </p>
    </form>
  );
}