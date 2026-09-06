import {
  z,
} from "zod";

const optionalEnvironmentValue =
  z
    .string()
    .optional();

const EnvSchema =
  z.object({
    DATABASE_URL:
      z.string(),

    JWT_SECRET:
      z
        .string()
        .min(32),

    JWT_REFRESH_SECRET:
      z
        .string()
        .min(32),

    JWT_EXPIRES_IN:
      z.string(),

    JWT_REFRESH_EXPIRES_IN:
      z.string(),

    NEXT_PUBLIC_APP_URL:
      z
        .string()
        .url(),

    /*
     * ==========================================================
     * STRIPE
     * ==========================================================
     *
     * Son opcionales para permitir arrancar YaMar
     * aunque Stripe todavía no esté configurado.
     *
     * La disponibilidad real se calcula en
     * IntegrationService.
     */
    STRIPE_SECRET_KEY:
      optionalEnvironmentValue,

    STRIPE_WEBHOOK_SECRET:
      optionalEnvironmentValue,

    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      optionalEnvironmentValue,

    /*
     * ==========================================================
     * EMAIL / RESEND
     * ==========================================================
     */
    RESEND_API_KEY:
      optionalEnvironmentValue,

    EMAIL_FROM:
      optionalEnvironmentValue,

    /*
     * ==========================================================
     * SMS / TWILIO
     * ==========================================================
     */
    TWILIO_ACCOUNT_SID:
      optionalEnvironmentValue,

    TWILIO_AUTH_TOKEN:
      optionalEnvironmentValue,

    TWILIO_PHONE_NUMBER:
      optionalEnvironmentValue,

    /*
     * ==========================================================
     * ANALYTICS
     * ==========================================================
     */
    NEXT_PUBLIC_GOOGLE_ANALYTICS:
      optionalEnvironmentValue,

    /*
     * ==========================================================
     * FLAGS DE ENTORNO LEGACY
     * ==========================================================
     *
     * Se conservan porque ya existen en .env.
     *
     * La configuración multi-tenant real debe seguir
     * viniendo de establishments.features.
     */
    ENABLE_GEOLOCATION:
      optionalEnvironmentValue,

    ENABLE_LOYALTY:
      optionalEnvironmentValue,

    ENABLE_ONLINE_PAYMENT:
      optionalEnvironmentValue,

    ENABLE_RATINGS:
      optionalEnvironmentValue,

    ENABLE_RESERVATIONS:
      optionalEnvironmentValue,

    ENABLE_SPLIT_BILL:
      optionalEnvironmentValue,
  });

export const env =
  EnvSchema.parse(
    process.env
  );