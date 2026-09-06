import {
  env,
} from "@/config/env";

import {
  EstablishmentService,
} from "@/services/establishment.service";

interface IntegrationStatus {
  configured: boolean;
  enabled: boolean;
  ready: boolean;
}

interface StripeIntegrationStatus
  extends IntegrationStatus {
  provider: "stripe";

  publishableKeyConfigured:
    boolean;

  secretKeyConfigured:
    boolean;

  webhookConfigured:
    boolean;
}

interface EmailIntegrationStatus
  extends IntegrationStatus {
  provider: "resend";

  apiKeyConfigured:
    boolean;

  senderConfigured:
    boolean;
}

interface SmsIntegrationStatus
  extends IntegrationStatus {
  provider: "twilio";

  accountConfigured:
    boolean;

  tokenConfigured:
    boolean;

  phoneConfigured:
    boolean;
}

interface AnalyticsIntegrationStatus
  extends IntegrationStatus {
  provider: "google-analytics";

  measurementIdConfigured:
    boolean;
}

export interface IntegrationsStatus {
  establishmentId: number;

  stripe:
    StripeIntegrationStatus;

  email:
    EmailIntegrationStatus;

  sms:
    SmsIntegrationStatus;

  analytics:
    AnalyticsIntegrationStatus;
}

function hasValue(
  value:
    string |
    undefined
) {
  return (
    typeof value ===
      "string" &&
    value.trim().length >
      0
  );
}

function getFeature(
  features: unknown,
  key: string,
  fallback: boolean
) {
  if (
    typeof features !==
      "object" ||
    features === null ||
    Array.isArray(
      features
    )
  ) {
    return fallback;
  }

  const record =
    features as Record<
      string,
      unknown
    >;

  return (
    typeof record[key] ===
      "boolean"
      ? record[key]
      : fallback
  );
}

export class IntegrationService {
  static async getStatusForEstablishment(
    establishmentId: number
  ): Promise<
    IntegrationsStatus |
    null
  > {
    const establishment =
      await EstablishmentService
        .getForAuthenticatedEstablishment(
          establishmentId
        );

    if (
      !establishment
    ) {
      return null;
    }

    /*
     * ==========================================================
     * STRIPE
     * ==========================================================
     */

    const stripePublishableKeyConfigured =
      hasValue(
        env
          .NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      );

    const stripeSecretKeyConfigured =
      hasValue(
        env
          .STRIPE_SECRET_KEY
      );

    const stripeWebhookConfigured =
      hasValue(
        env
          .STRIPE_WEBHOOK_SECRET
      );

    const stripeConfigured =
      stripePublishableKeyConfigured &&
      stripeSecretKeyConfigured &&
      stripeWebhookConfigured;

    /*
     * El permiso funcional pertenece al tenant.
     *
     * Una instalación puede tener credenciales Stripe
     * configuradas globalmente y, aun así, un
     * establecimiento concreto puede tener desactivado
     * el pago online.
     */
    const stripeEnabled =
      getFeature(
        establishment.features,
        "onlinePayment",
        true
      );

    /*
     * ==========================================================
     * EMAIL / RESEND
     * ==========================================================
     */

    const resendApiKeyConfigured =
      hasValue(
        env.RESEND_API_KEY
      );

    const emailSenderConfigured =
      hasValue(
        env.EMAIL_FROM
      );

    const emailConfigured =
      resendApiKeyConfigured &&
      emailSenderConfigured;

    /*
     * Por ahora no tenemos un feature multi-tenant
     * específico para recibos por email.
     *
     * Se considera habilitado cuando la infraestructura
     * está configurada.
     */
    const emailEnabled =
      emailConfigured;

    /*
     * ==========================================================
     * SMS / TWILIO
     * ==========================================================
     */

    const twilioAccountConfigured =
      hasValue(
        env.TWILIO_ACCOUNT_SID
      );

    const twilioTokenConfigured =
      hasValue(
        env.TWILIO_AUTH_TOKEN
      );

    const twilioPhoneConfigured =
      hasValue(
        env.TWILIO_PHONE_NUMBER
      );

    const smsConfigured =
      twilioAccountConfigured &&
      twilioTokenConfigured &&
      twilioPhoneConfigured;

    /*
     * Todavía no existe un feature multi-tenant
     * específico para SMS.
     */
    const smsEnabled =
      smsConfigured;

    /*
     * ==========================================================
     * GOOGLE ANALYTICS
     * ==========================================================
     */

    const analyticsConfigured =
      hasValue(
        env
          .NEXT_PUBLIC_GOOGLE_ANALYTICS
      );

    const analyticsEnabled =
      analyticsConfigured;

    return {
      establishmentId:
        establishment.id,

      stripe: {
        provider:
          "stripe",

        configured:
          stripeConfigured,

        enabled:
          stripeEnabled,

        ready:
          stripeConfigured &&
          stripeEnabled,

        publishableKeyConfigured:
          stripePublishableKeyConfigured,

        secretKeyConfigured:
          stripeSecretKeyConfigured,

        webhookConfigured:
          stripeWebhookConfigured,
      },

      email: {
        provider:
          "resend",

        configured:
          emailConfigured,

        enabled:
          emailEnabled,

        ready:
          emailConfigured &&
          emailEnabled,

        apiKeyConfigured:
          resendApiKeyConfigured,

        senderConfigured:
          emailSenderConfigured,
      },

      sms: {
        provider:
          "twilio",

        configured:
          smsConfigured,

        enabled:
          smsEnabled,

        ready:
          smsConfigured &&
          smsEnabled,

        accountConfigured:
          twilioAccountConfigured,

        tokenConfigured:
          twilioTokenConfigured,

        phoneConfigured:
          twilioPhoneConfigured,
      },

      analytics: {
        provider:
          "google-analytics",

        configured:
          analyticsConfigured,

        enabled:
          analyticsEnabled,

        ready:
          analyticsConfigured &&
          analyticsEnabled,

        measurementIdConfigured:
          analyticsConfigured,
      },
    };
  }
}