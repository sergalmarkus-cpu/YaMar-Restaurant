"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  BarChart3,
  Check,
  CircleAlert,
  CircleCheck,
  CreditCard,
  Mail,
  MessageSquareText,
  RefreshCw,
  Settings2,
  ShieldCheck,
  X,
} from "lucide-react";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

interface BaseIntegrationStatus {
  configured: boolean;
  enabled: boolean;
  ready: boolean;
}

interface StripeIntegrationStatus
  extends BaseIntegrationStatus {
  provider: "stripe";
  publishableKeyConfigured: boolean;
  secretKeyConfigured: boolean;
  webhookConfigured: boolean;
}

interface EmailIntegrationStatus
  extends BaseIntegrationStatus {
  provider: "resend";
  apiKeyConfigured: boolean;
  senderConfigured: boolean;
}

interface SmsIntegrationStatus
  extends BaseIntegrationStatus {
  provider: "twilio";
  accountConfigured: boolean;
  tokenConfigured: boolean;
  phoneConfigured: boolean;
}

interface AnalyticsIntegrationStatus
  extends BaseIntegrationStatus {
  provider: "google-analytics";
  measurementIdConfigured: boolean;
}

interface IntegrationsStatus {
  establishmentId: number;
  stripe: StripeIntegrationStatus;
  email: EmailIntegrationStatus;
  sms: SmsIntegrationStatus;
  analytics: AnalyticsIntegrationStatus;
}

interface IntegrationsApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: IntegrationsStatus;
}

interface Requirement {
  label: string;
  configured: boolean;
}

interface IntegrationCardProps {
  title: string;
  provider: string;
  description: string;
  icon: React.ReactNode;
  status: BaseIntegrationStatus;
  requirements: Requirement[];
  enabledDescription?: string;
}

function StatusBadge({
  ready,
}: {
  ready: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
        ready
          ? "bg-green-50 text-green-700"
          : "bg-amber-50 text-amber-700"
      }`}
    >
      {ready ? (
        <CircleCheck
          size={14}
        />
      ) : (
        <CircleAlert
          size={14}
        />
      )}

      {ready
        ? "Lista"
        : "Requiere configuración"}
    </span>
  );
}

function RequirementRow({
  label,
  configured,
}: Requirement) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <span className="text-sm text-slate-600">
        {label}
      </span>

      <span
        className={`inline-flex items-center gap-1.5 text-sm font-medium ${
          configured
            ? "text-green-700"
            : "text-slate-500"
        }`}
      >
        {configured ? (
          <>
            <Check
              size={16}
            />
            Configurado
          </>
        ) : (
          <>
            <X
              size={16}
            />
            Pendiente
          </>
        )}
      </span>
    </div>
  );
}

function IntegrationCard({
  title,
  provider,
  description,
  icon,
  status,
  requirements,
  enabledDescription,
}: IntegrationCardProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              {icon}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold text-slate-900">
                  {title}
                </h2>

                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {provider}
                </span>
              </div>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                {description}
              </p>
            </div>
          </div>

          <StatusBadge
            ready={
              status.ready
            }
          />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Configuración
            </p>

            <p
              className={`mt-2 font-semibold ${
                status.configured
                  ? "text-green-700"
                  : "text-amber-700"
              }`}
            >
              {status.configured
                ? "Completa"
                : "Incompleta"}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Habilitada
            </p>

            <p
              className={`mt-2 font-semibold ${
                status.enabled
                  ? "text-green-700"
                  : "text-slate-600"
              }`}
            >
              {status.enabled
                ? "Sí"
                : "No"}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Estado
            </p>

            <p
              className={`mt-2 font-semibold ${
                status.ready
                  ? "text-green-700"
                  : "text-amber-700"
              }`}
            >
              {status.ready
                ? "Operativa"
                : "No operativa"}
            </p>
          </div>
        </div>

        {enabledDescription && (
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            {enabledDescription}
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 bg-slate-50/60 px-6 py-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Requisitos
        </p>

        <div className="divide-y divide-slate-200">
          {requirements.map(
            (
              requirement
            ) => (
              <RequirementRow
                key={
                  requirement.label
                }
                {...requirement}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}

export default function IntegrationsSettings() {
  const [
    integrations,
    setIntegrations,
  ] =
    useState<IntegrationsStatus | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    refreshing,
    setRefreshing,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const loadIntegrations =
    useCallback(
      async (
        manualRefresh = false
      ) => {
        setError("");

        if (
          manualRefresh
        ) {
          setRefreshing(
            true
          );
        } else {
          setLoading(
            true
          );
        }

        try {
          const response =
            await adminFetch(
              "/api/integrations"
            );

          const json =
            (await response.json()) as IntegrationsApiResponse;

          if (
            !response.ok ||
            !json.success ||
            !json.data
          ) {
            setError(
              json.error ||
                "No se pudo cargar el estado de las integraciones."
            );

            return;
          }

          setIntegrations(
            json.data
          );
        } catch (
          error
        ) {
          console.error(
            "Error loading integrations:",
            error
          );

          setError(
            "No se pudo cargar el estado de las integraciones."
          );
        } finally {
          setLoading(
            false
          );

          setRefreshing(
            false
          );
        }
      },
      []
    );

  useEffect(() => {
    void loadIntegrations();
  }, [
    loadIntegrations,
  ]);

  const readyCount =
    useMemo(
      () => {
        if (
          !integrations
        ) {
          return 0;
        }

        return [
          integrations.stripe,
          integrations.email,
          integrations.sms,
          integrations.analytics,
        ].filter(
          (
            integration
          ) =>
            integration.ready
        ).length;
      },
      [
        integrations,
      ]
    );

  if (
    loading
  ) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600">
          <RefreshCw
            size={22}
            className="animate-spin"
          />

          <span>
            Cargando integraciones...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Settings2
              size={28}
              className="text-indigo-600"
            />

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Integraciones
              </h1>

              <p className="text-sm text-slate-500">
                Comprueba el estado de los servicios externos utilizados por YaMar.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            void loadIntegrations(
              true
            )
          }
          disabled={
            refreshing
          }
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

          {refreshing
            ? "Actualizando..."
            : "Actualizar estado"}
        </button>
      </div>

      <div className="flex gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
        <ShieldCheck
          size={20}
          className="mt-0.5 shrink-0"
        />

        <div>
          Las credenciales y secretos de las integraciones no se muestran en esta pantalla.
          El panel únicamente indica si cada requisito está configurado y si el servicio
          está listo para utilizarse.
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {integrations && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Integraciones
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                4
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Operativas
              </p>

              <p className="mt-2 text-2xl font-bold text-green-700">
                {readyCount}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Pendientes
              </p>

              <p className="mt-2 text-2xl font-bold text-amber-700">
                {4 -
                  readyCount}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Tenant
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                #
                {
                  integrations.establishmentId
                }
              </p>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <IntegrationCard
              title="Pagos online"
              provider="Stripe"
              description="Procesamiento seguro de pagos digitales realizados por los clientes desde YaMar."
              icon={
                <CreditCard
                  size={23}
                />
              }
              status={
                integrations.stripe
              }
              enabledDescription={
                integrations.stripe.enabled
                  ? "El pago online está habilitado para este establecimiento."
                  : "Stripe puede estar configurado globalmente, pero el pago online está deshabilitado para este establecimiento."
              }
              requirements={[
                {
                  label:
                    "Clave pública",
                  configured:
                    integrations.stripe
                      .publishableKeyConfigured,
                },
                {
                  label:
                    "Clave secreta",
                  configured:
                    integrations.stripe
                      .secretKeyConfigured,
                },
                {
                  label:
                    "Webhook",
                  configured:
                    integrations.stripe
                      .webhookConfigured,
                },
              ]}
            />

            <IntegrationCard
              title="Correo electrónico"
              provider="Resend"
              description="Envío de recibos electrónicos y comunicaciones por correo desde la plataforma."
              icon={
                <Mail
                  size={23}
                />
              }
              status={
                integrations.email
              }
              requirements={[
                {
                  label:
                    "API key",
                  configured:
                    integrations.email
                      .apiKeyConfigured,
                },
                {
                  label:
                    "Remitente",
                  configured:
                    integrations.email
                      .senderConfigured,
                },
              ]}
            />

            <IntegrationCard
              title="Mensajería SMS"
              provider="Twilio"
              description="Infraestructura preparada para comunicaciones y notificaciones mediante SMS."
              icon={
                <MessageSquareText
                  size={23}
                />
              }
              status={
                integrations.sms
              }
              requirements={[
                {
                  label:
                    "Account SID",
                  configured:
                    integrations.sms
                      .accountConfigured,
                },
                {
                  label:
                    "Auth token",
                  configured:
                    integrations.sms
                      .tokenConfigured,
                },
                {
                  label:
                    "Número de teléfono",
                  configured:
                    integrations.sms
                      .phoneConfigured,
                },
              ]}
            />

            <IntegrationCard
              title="Analítica"
              provider="Google Analytics"
              description="Medición del uso de la aplicación y análisis de la actividad digital del establecimiento."
              icon={
                <BarChart3
                  size={23}
                />
              }
              status={
                integrations.analytics
              }
              requirements={[
                {
                  label:
                    "Measurement ID",
                  configured:
                    integrations.analytics
                      .measurementIdConfigured,
                },
              ]}
            />
          </div>
        </>
      )}
    </div>
  );
}