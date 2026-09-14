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
  ADMIN_INTEGRATIONS_MESSAGES,
} from "@/config/admin-integrations-i18n";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

import {
  useAdminLanguageStore,
} from "@/store/admin-language.store";

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

  labels: {
    ready: string;
    requiresConfiguration: string;

    configuration: string;
    complete: string;
    incomplete: string;

    enabled: string;
    yes: string;
    no: string;

    status: string;
    operational: string;
    notOperational: string;

    requirements: string;
    configured: string;
    pending: string;
  };
}

function StatusBadge({
  ready,
  readyLabel,
  pendingLabel,
}: {
  ready: boolean;
  readyLabel: string;
  pendingLabel: string;
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
        ? readyLabel
        : pendingLabel}
    </span>
  );
}

function RequirementRow({
  label,
  configured,
  configuredLabel,
  pendingLabel,
}: Requirement & {
  configuredLabel: string;
  pendingLabel: string;
}) {
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

            {configuredLabel}
          </>
        ) : (
          <>
            <X
              size={16}
            />

            {pendingLabel}
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
  labels,
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
            readyLabel={
              labels.ready
            }
            pendingLabel={
              labels.requiresConfiguration
            }
          />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {
                labels.configuration
              }
            </p>

            <p
              className={`mt-2 font-semibold ${
                status.configured
                  ? "text-green-700"
                  : "text-amber-700"
              }`}
            >
              {status.configured
                ? labels.complete
                : labels.incomplete}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {
                labels.enabled
              }
            </p>

            <p
              className={`mt-2 font-semibold ${
                status.enabled
                  ? "text-green-700"
                  : "text-slate-600"
              }`}
            >
              {status.enabled
                ? labels.yes
                : labels.no}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {
                labels.status
              }
            </p>

            <p
              className={`mt-2 font-semibold ${
                status.ready
                  ? "text-green-700"
                  : "text-amber-700"
              }`}
            >
              {status.ready
                ? labels.operational
                : labels.notOperational}
            </p>
          </div>
        </div>

        {enabledDescription && (
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            {
              enabledDescription
            }
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 bg-slate-50/60 px-6 py-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          {
            labels.requirements
          }
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
                configuredLabel={
                  labels.configured
                }
                pendingLabel={
                  labels.pending
                }
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}

export default function IntegrationsSettings() {
  const language =
    useAdminLanguageStore(
      (
        state
      ) =>
        state.language
    );

  const messages =
    ADMIN_INTEGRATIONS_MESSAGES[
      language
    ];

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
              messages.loadError
            );

            return;
          }

          setIntegrations(
            json.data
          );
        } catch (
          loadError
        ) {
          console.error(
            "Error loading integrations:",
            loadError
          );

          setError(
            messages.loadError
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
      [
        messages.loadError,
      ]
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
            {
              messages.loading
            }
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
                {
                  messages.page
                    .title
                }
              </h1>

              <p className="text-sm text-slate-500">
                {
                  messages.page
                    .subtitle
                }
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
            ? messages.page
                .refreshing
            : messages.page
                .refresh}
        </button>
      </div>

      <div className="flex gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
        <ShieldCheck
          size={20}
          className="mt-0.5 shrink-0"
        />

        <div>
          {
            messages.page
              .securityNotice
          }
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
                {
                  messages.stats
                    .integrations
                }
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                4
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                {
                  messages.stats
                    .ready
                }
              </p>

              <p className="mt-2 text-2xl font-bold text-green-700">
                {
                  readyCount
                }
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                {
                  messages.stats
                    .pending
                }
              </p>

              <p className="mt-2 text-2xl font-bold text-amber-700">
                {4 -
                  readyCount}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                {
                  messages.stats
                    .tenant
                }
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
              title={
                messages.stripe
                  .title
              }
              provider="Stripe"
              description={
                messages.stripe
                  .description
              }
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
                  ? messages.stripe
                      .enabled
                  : messages.stripe
                      .disabled
              }
              requirements={[
                {
                  label:
                    messages.stripe
                      .requirements
                      .publishableKey,
                  configured:
                    integrations.stripe
                      .publishableKeyConfigured,
                },
                {
                  label:
                    messages.stripe
                      .requirements
                      .secretKey,
                  configured:
                    integrations.stripe
                      .secretKeyConfigured,
                },
                {
                  label:
                    messages.stripe
                      .requirements
                      .webhook,
                  configured:
                    integrations.stripe
                      .webhookConfigured,
                },
              ]}
              labels={
                messages.common
              }
            />

            <IntegrationCard
              title={
                messages.email
                  .title
              }
              provider="Resend"
              description={
                messages.email
                  .description
              }
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
                    messages.email
                      .requirements
                      .apiKey,
                  configured:
                    integrations.email
                      .apiKeyConfigured,
                },
                {
                  label:
                    messages.email
                      .requirements
                      .sender,
                  configured:
                    integrations.email
                      .senderConfigured,
                },
              ]}
              labels={
                messages.common
              }
            />

            <IntegrationCard
              title={
                messages.sms
                  .title
              }
              provider="Twilio"
              description={
                messages.sms
                  .description
              }
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
                    messages.sms
                      .requirements
                      .accountSid,
                  configured:
                    integrations.sms
                      .accountConfigured,
                },
                {
                  label:
                    messages.sms
                      .requirements
                      .authToken,
                  configured:
                    integrations.sms
                      .tokenConfigured,
                },
                {
                  label:
                    messages.sms
                      .requirements
                      .phoneNumber,
                  configured:
                    integrations.sms
                      .phoneConfigured,
                },
              ]}
              labels={
                messages.common
              }
            />

            <IntegrationCard
              title={
                messages.analytics
                  .title
              }
              provider="Google Analytics"
              description={
                messages.analytics
                  .description
              }
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
                    messages.analytics
                      .requirements
                      .measurementId,
                  configured:
                    integrations.analytics
                      .measurementIdConfigured,
                },
              ]}
              labels={
                messages.common
              }
            />
          </div>
        </>
      )}
    </div>
  );
}