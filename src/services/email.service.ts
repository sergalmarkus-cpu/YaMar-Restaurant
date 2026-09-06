import {
  Resend,
} from "resend";

import {
  env,
} from "@/config/env";

import {
  Logger,
} from "./logger.service";

export type SendEmailInput = {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
  idempotencyKey?: string;
};

export class EmailService {
  private static client:
    Resend | null =
      null;

  private static getClient() {
    const apiKey =
      env.RESEND_API_KEY
        ?.trim();

    if (!apiKey) {
      throw new Error(
        "RESEND_NOT_CONFIGURED"
      );
    }

    if (!this.client) {
      this.client =
        new Resend(
          apiKey
        );
    }

    return this.client;
  }

  private static getFromAddress() {
    const from =
      env.EMAIL_FROM
        ?.trim();

    if (!from) {
      throw new Error(
        "EMAIL_FROM_NOT_CONFIGURED"
      );
    }

    return from;
  }

  static isConfigured() {
    return Boolean(
      env.RESEND_API_KEY
        ?.trim() &&
      env.EMAIL_FROM
        ?.trim()
    );
  }

  static async send(
    input: SendEmailInput
  ) {
    const client =
      this.getClient();

    const from =
      this.getFromAddress();

    const recipients =
      Array.isArray(
        input.to
      )
        ? input.to
            .map(
              (
                value
              ) =>
                value.trim()
            )
            .filter(
              Boolean
            )
        : [
            input.to.trim(),
          ].filter(
            Boolean
          );

    if (
      recipients.length ===
      0
    ) {
      throw new Error(
        "EMAIL_RECIPIENT_REQUIRED"
      );
    }

    const subject =
      input.subject
        ?.trim();

    if (!subject) {
      throw new Error(
        "EMAIL_SUBJECT_REQUIRED"
      );
    }

    const html =
      input.html
        ?.trim();

    const text =
      input.text
        ?.trim();

    if (
      !html &&
      !text
    ) {
      throw new Error(
        "EMAIL_CONTENT_REQUIRED"
      );
    }

    const replyTo =
      input.replyTo
        ?.trim();

    const idempotencyKey =
      input.idempotencyKey
        ?.trim();

    Logger.info(
      "Enviando email con Resend",
      {
        to:
          recipients,

        subject,

        idempotencyKey:
          idempotencyKey ??
          null,
      }
    );

    const options =
      idempotencyKey
        ? {
            idempotencyKey,
          }
        : undefined;

    const response =
      html
        ? await client.emails.send(
            {
              from,

              to:
                recipients,

              subject,

              html,

              ...(replyTo
                ? {
                    replyTo,
                  }
                : {}),
            },

            options
          )
        : await client.emails.send(
            {
              from,

              to:
                recipients,

              subject,

              text:
                text!,

              ...(replyTo
                ? {
                    replyTo,
                  }
                : {}),
            },

            options
          );

    if (
      response.error
    ) {
      Logger.error(
        "Error enviando email con Resend",
        response.error
      );

      throw new Error(
        `RESEND_SEND_FAILED: ${
          response.error.message ??
          "Error desconocido"
        }`
      );
    }

    Logger.info(
      "Email enviado con Resend",
      {
        id:
          response.data
            ?.id ??
          null,
      }
    );

    return {
      id:
        response.data
          ?.id ??
        null,

      provider:
        "resend" as const,
    };
  }
}