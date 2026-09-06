import twilio from "twilio";

import {
  env,
} from "@/config/env";

import {
  Logger,
} from "./logger.service";

export type SendSmsInput = {
  to: string;
  body: string;
};

export class SmsService {
  private static client:
    ReturnType<
      typeof twilio
    > | null =
      null;

  private static getClient() {
    const accountSid =
      env.TWILIO_ACCOUNT_SID
        ?.trim();

    const authToken =
      env.TWILIO_AUTH_TOKEN
        ?.trim();

    if (
      !accountSid ||
      !authToken
    ) {
      throw new Error(
        "TWILIO_NOT_CONFIGURED"
      );
    }

    if (!this.client) {
      this.client =
        twilio(
          accountSid,
          authToken
        );
    }

    return this.client;
  }

  private static getFromPhone() {
    const from =
      env.TWILIO_PHONE_NUMBER
        ?.trim();

    if (!from) {
      throw new Error(
        "TWILIO_PHONE_NOT_CONFIGURED"
      );
    }

    return from;
  }

  static isConfigured() {
    return Boolean(
      env.TWILIO_ACCOUNT_SID
        ?.trim() &&
      env.TWILIO_AUTH_TOKEN
        ?.trim() &&
      env.TWILIO_PHONE_NUMBER
        ?.trim()
    );
  }

  static async send(
    input: SendSmsInput
  ) {
    const client =
      this.getClient();

    const from =
      this.getFromPhone();

    const to =
      input.to
        ?.trim();

    const body =
      input.body
        ?.trim();

    if (!to) {
      throw new Error(
        "SMS_RECIPIENT_REQUIRED"
      );
    }

    if (
      !to.startsWith(
        "+"
      )
    ) {
      throw new Error(
        "SMS_RECIPIENT_INVALID"
      );
    }

    if (!body) {
      throw new Error(
        "SMS_BODY_REQUIRED"
      );
    }

    Logger.info(
      "Enviando SMS con Twilio",
      {
        to:
          this.maskPhone(
            to
          ),

        length:
          body.length,
      }
    );

    try {
      const message =
        await client
          .messages
          .create({
            from,
            to,
            body,
          });

      Logger.info(
        "SMS enviado con Twilio",
        {
          sid:
            message.sid,

          status:
            message.status,
        }
      );

      return {
        id:
          message.sid,

        status:
          message.status,

        provider:
          "twilio" as const,
      };
    } catch (
      error
    ) {
      Logger.error(
        "Error enviando SMS con Twilio",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Error desconocido";

      throw new Error(
        `TWILIO_SEND_FAILED: ${message}`
      );
    }
  }

  private static maskPhone(
    phone: string
  ) {
    if (
      phone.length <=
      4
    ) {
      return "****";
    }

    return `${"*".repeat(
      Math.max(
        0,
        phone.length - 4
      )
    )}${phone.slice(
      -4
    )}`;
  }
}