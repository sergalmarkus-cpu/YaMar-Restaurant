"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Building2,
  CheckCircle2,
  CreditCard,
  Globe2,
  MapPin,
  Palette,
  Save,
  Settings,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

import {
  useAdminAuthStore,
} from "@/auth/admin-auth.store";

interface EstablishmentFeatures {
  geolocation: boolean;
  onlinePayment: boolean;
  splitBill: boolean;
  ratings: boolean;
  loyalty: boolean;
  reservations: boolean;
  callWaiter: boolean;
}

interface EstablishmentRecord {
  id: number;
  name: string;
  slug: string;

  description:
    string | null;

  address:
    string | null;

  phone:
    string | null;

  email:
    string | null;

  latitude:
    string | null;

  longitude:
    string | null;

  maxDeliveryDistance:
    number | null;

  geoFenceEnabled:
    boolean | null;

  logo:
    string | null;

  primaryColor:
    string | null;

  secondaryColor:
    string | null;

  currency:
    string | null;

  timezone:
    string | null;

  features:
    Partial<EstablishmentFeatures> | null;

  active:
    boolean | null;
}

interface FormState {
  name: string;
  slug: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  latitude: string;
  longitude: string;
  maxDeliveryDistance: string;
  geoFenceEnabled: boolean;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  currency: string;
  timezone: string;
  features: EstablishmentFeatures;
}

const DEFAULT_FEATURES: EstablishmentFeatures = {
  geolocation: true,
  onlinePayment: true,
  splitBill: true,
  ratings: true,
  loyalty: false,
  reservations: false,
  callWaiter: true,
};

const EMPTY_FORM: FormState = {
  name: "",
  slug: "",
  description: "",
  address: "",
  phone: "",
  email: "",
  latitude: "",
  longitude: "",
  maxDeliveryDistance:
    "100",
  geoFenceEnabled:
    false,
  logo: "",
  primaryColor:
    "#000000",
  secondaryColor:
    "#ffffff",
  currency:
    "EUR",
  timezone:
    "Europe/Madrid",
  features: {
    ...DEFAULT_FEATURES,
  },
};

function normalizeFeatures(
  value:
    Partial<EstablishmentFeatures> |
    null
): EstablishmentFeatures {
  return {
    geolocation:
      value?.geolocation ??
      DEFAULT_FEATURES.geolocation,

    onlinePayment:
      value?.onlinePayment ??
      DEFAULT_FEATURES.onlinePayment,

    splitBill:
      value?.splitBill ??
      DEFAULT_FEATURES.splitBill,

    ratings:
      value?.ratings ??
      DEFAULT_FEATURES.ratings,

    loyalty:
      value?.loyalty ??
      DEFAULT_FEATURES.loyalty,

    reservations:
      value?.reservations ??
      DEFAULT_FEATURES.reservations,

    callWaiter:
      value?.callWaiter ??
      DEFAULT_FEATURES.callWaiter,
  };
}

function toForm(
  establishment:
    EstablishmentRecord
): FormState {
  return {
    name:
      establishment.name ??
      "",

    slug:
      establishment.slug ??
      "",

    description:
      establishment.description ??
      "",

    address:
      establishment.address ??
      "",

    phone:
      establishment.phone ??
      "",

    email:
      establishment.email ??
      "",

    latitude:
      establishment.latitude ??
      "",

    longitude:
      establishment.longitude ??
      "",

    maxDeliveryDistance:
      String(
        establishment
          .maxDeliveryDistance ??
          100
      ),

    geoFenceEnabled:
      establishment
        .geoFenceEnabled ??
      false,

    logo:
      establishment.logo ??
      "",

    primaryColor:
      establishment
        .primaryColor ??
      "#000000",

    secondaryColor:
      establishment
        .secondaryColor ??
      "#ffffff",

    currency:
      establishment.currency ??
      "EUR",

    timezone:
      establishment.timezone ??
      "Europe/Madrid",

    features:
      normalizeFeatures(
        establishment.features
      ),
  };
}

function FieldLabel({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <label className="mb-2 block text-sm font-medium text-slate-700">
      {children}
    </label>
  );
}

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon:
    React.ReactNode;
  title:
    string;
  description:
    string;
}) {
  return (
    <div className="mb-6 flex items-start gap-3">
      <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
        {icon}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          {title}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function FeatureToggle({
  title,
  description,
  checked,
  disabled,
  onChange,
}: {
  title:
    string;
  description:
    string;
  checked:
    boolean;
  disabled:
    boolean;
  onChange: (
    checked: boolean
  ) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-6 rounded-xl border border-slate-200 p-4">
      <div>
        <p className="font-medium text-slate-900">
          {title}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
      </div>

      <input
        type="checkbox"
        checked={
          checked
        }
        disabled={
          disabled
        }
        onChange={(
          event
        ) =>
          onChange(
            event.target
              .checked
          )
        }
        className="h-5 w-5 accent-indigo-600"
      />
    </label>
  );
}

export default function SettingsPage() {
  const user =
    useAdminAuthStore(
      (state) =>
        state.user
    );

  const [
    establishment,
    setEstablishment,
  ] =
    useState<
      EstablishmentRecord |
      null
    >(null);

  const [
    form,
    setForm,
  ] =
    useState<FormState>({
      ...EMPTY_FORM,
      features: {
        ...EMPTY_FORM.features,
      },
    });

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    success,
    setSuccess,
  ] =
    useState("");

  const canEdit =
    user?.role ===
    "admin";

  useEffect(() => {
    void loadSettings();
  }, []);

  async function loadSettings() {
    setLoading(
      true
    );

    setError(
      ""
    );

    try {
      const response =
        await adminFetch(
          "/api/establishments"
        );

      const json =
        await response.json();

      if (
        !response.ok ||
        !json.success
      ) {
        setError(
          json.error ||
            "No se pudo cargar la configuración."
        );

        return;
      }

      const current =
        Array.isArray(
          json.data
        )
          ? json.data[0]
          : null;

      if (!current) {
        setError(
          "No se encontró el establecimiento asociado a tu cuenta."
        );

        return;
      }

      const record =
        current as EstablishmentRecord;

      setEstablishment(
        record
      );

      setForm(
        toForm(
          record
        )
      );
    } catch (
      error
    ) {
      console.error(
        "Error loading settings:",
        error
      );

      setError(
        "No se pudo cargar la configuración."
      );
    } finally {
      setLoading(
        false
      );
    }
  }

  function updateField<
    K extends keyof FormState
  >(
    key: K,
    value: FormState[K]
  ) {
    setForm(
      (
        current
      ) => ({
        ...current,
        [key]:
          value,
      })
    );
  }

  function updateFeature(
    key:
      keyof EstablishmentFeatures,
    value:
      boolean
  ) {
    setForm(
      (
        current
      ) => ({
        ...current,

        features: {
          ...current.features,

          [key]:
            value,
        },
      })
    );
  }

  async function saveSettings(
    event:
      React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      !establishment ||
      !canEdit
    ) {
      return;
    }

    setSaving(
      true
    );

    setError(
      ""
    );

    setSuccess(
      ""
    );

    try {
      const latitude =
        form.latitude.trim();

      const longitude =
        form.longitude.trim();

      const maxDeliveryDistance =
        Number(
          form.maxDeliveryDistance
        );

      if (
        !Number.isInteger(
          maxDeliveryDistance
        ) ||
        maxDeliveryDistance <=
          0
      ) {
        setError(
          "La distancia máxima debe ser un número entero mayor que cero."
        );

        return;
      }

      const payload = {
        name:
          form.name.trim(),

        slug:
          form.slug
            .trim()
            .toLowerCase(),

        description:
          form.description.trim() ||
          null,

        address:
          form.address.trim() ||
          null,

        phone:
          form.phone.trim() ||
          null,

        email:
          form.email.trim() ||
          null,

        latitude:
          latitude
            ? Number(
                latitude
              )
            : null,

        longitude:
          longitude
            ? Number(
                longitude
              )
            : null,

        maxDeliveryDistance,

        geoFenceEnabled:
          form.geoFenceEnabled,

        logo:
          form.logo.trim() ||
          null,

        primaryColor:
          form.primaryColor,

        secondaryColor:
          form.secondaryColor,

        currency:
          form.currency
            .trim()
            .toUpperCase(),

        timezone:
          form.timezone.trim(),

        features: {
          ...form.features,
        },
      };

      const response =
        await adminFetch(
          `/api/establishments/${establishment.id}`,
          {
            method:
              "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                payload
              ),
          }
        );

      const json =
        await response.json();

      if (
        !response.ok ||
        !json.success
      ) {
        setError(
          json.error ||
            "No se pudo guardar la configuración."
        );

        return;
      }

      const updated =
        json.data as EstablishmentRecord;

      setEstablishment(
        updated
      );

      setForm(
        toForm(
          updated
        )
      );

      setSuccess(
        "Configuración guardada correctamente."
      );
    } catch (
      error
    ) {
      console.error(
        "Error saving settings:",
        error
      );

      setError(
        "No se pudo guardar la configuración."
      );
    } finally {
      setSaving(
        false
      );
    }
  }

  if (
    loading
  ) {
    return (
      <div className="p-6 text-slate-500">
        Cargando configuración...
      </div>
    );
  }

  if (
    !establishment
  ) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Configuración
          </h1>

          <p className="mt-1 text-slate-500">
            Configuración general del establecimiento.
          </p>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error ||
            "No se pudo cargar el establecimiento."}
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={
        saveSettings
      }
      className="space-y-6"
    >
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Settings
              size={
                28
              }
              className="text-indigo-600"
            />

            <h1 className="text-2xl font-bold text-slate-900">
              Configuración
            </h1>
          </div>

          <p className="mt-2 text-slate-500">
            Configuración general de{" "}
            <span className="font-medium text-slate-700">
              {
                establishment.name
              }
            </span>
            .
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              establishment.active
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {establishment.active
              ? "Establecimiento activo"
              : "Establecimiento inactivo"}
          </span>

          <button
            type="submit"
            disabled={
              !canEdit ||
              saving
            }
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save
              size={
                17
              }
            />

            {saving
              ? "Guardando..."
              : "Guardar cambios"}
          </button>
        </div>
      </div>

      {!canEdit && (
        <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <ShieldCheck
            size={
              20
            }
            className="mt-0.5 shrink-0"
          />

          <div>
            Puedes consultar la configuración, pero solo un administrador puede modificarla.
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          <CheckCircle2
            size={
              18
            }
          />

          {success}
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionHeader
          icon={
            <Building2
              size={
                20
              }
            />
          }
          title="Información general"
          description="Datos públicos e identificativos del establecimiento."
        />

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <FieldLabel>
              Nombre
            </FieldLabel>

            <input
              value={
                form.name
              }
              disabled={
                !canEdit
              }
              onChange={(
                event
              ) =>
                updateField(
                  "name",
                  event.target
                    .value
                )
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 disabled:bg-slate-50"
            />
          </div>

          <div>
            <FieldLabel>
              Slug
            </FieldLabel>

            <input
              value={
                form.slug
              }
              disabled={
                !canEdit
              }
              onChange={(
                event
              ) =>
                updateField(
                  "slug",
                  event.target
                    .value
                )
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 disabled:bg-slate-50"
            />
          </div>

          <div className="md:col-span-2">
            <FieldLabel>
              Descripción
            </FieldLabel>

            <textarea
              value={
                form.description
              }
              disabled={
                !canEdit
              }
              rows={
                3
              }
              onChange={(
                event
              ) =>
                updateField(
                  "description",
                  event.target
                    .value
                )
              }
              className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 disabled:bg-slate-50"
            />
          </div>

          <div>
            <FieldLabel>
              Teléfono
            </FieldLabel>

            <input
              value={
                form.phone
              }
              disabled={
                !canEdit
              }
              onChange={(
                event
              ) =>
                updateField(
                  "phone",
                  event.target
                    .value
                )
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 disabled:bg-slate-50"
            />
          </div>

          <div>
            <FieldLabel>
              Email
            </FieldLabel>

            <input
              type="email"
              value={
                form.email
              }
              disabled={
                !canEdit
              }
              onChange={(
                event
              ) =>
                updateField(
                  "email",
                  event.target
                    .value
                )
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 disabled:bg-slate-50"
            />
          </div>

          <div className="md:col-span-2">
            <FieldLabel>
              Dirección
            </FieldLabel>

            <input
              value={
                form.address
              }
              disabled={
                !canEdit
              }
              onChange={(
                event
              ) =>
                updateField(
                  "address",
                  event.target
                    .value
                )
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 disabled:bg-slate-50"
            />
          </div>

          <div className="md:col-span-2">
            <FieldLabel>
              URL del logotipo
            </FieldLabel>

            <input
              value={
                form.logo
              }
              disabled={
                !canEdit
              }
              placeholder="https://..."
              onChange={(
                event
              ) =>
                updateField(
                  "logo",
                  event.target
                    .value
                )
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 disabled:bg-slate-50"
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionHeader
          icon={
            <MapPin
              size={
                20
              }
            />
          }
          title="Ubicación y geovalla"
          description="Coordenadas y distancia máxima permitida alrededor del establecimiento."
        />

        <div className="grid gap-5 md:grid-cols-3">
          <div>
            <FieldLabel>
              Latitud
            </FieldLabel>

            <input
              type="number"
              step="0.0000001"
              value={
                form.latitude
              }
              disabled={
                !canEdit
              }
              onChange={(
                event
              ) =>
                updateField(
                  "latitude",
                  event.target
                    .value
                )
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 disabled:bg-slate-50"
            />
          </div>

          <div>
            <FieldLabel>
              Longitud
            </FieldLabel>

            <input
              type="number"
              step="0.0000001"
              value={
                form.longitude
              }
              disabled={
                !canEdit
              }
              onChange={(
                event
              ) =>
                updateField(
                  "longitude",
                  event.target
                    .value
                )
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 disabled:bg-slate-50"
            />
          </div>

          <div>
            <FieldLabel>
              Distancia máxima (m)
            </FieldLabel>

            <input
              type="number"
              min={
                1
              }
              max={
                100000
              }
              value={
                form.maxDeliveryDistance
              }
              disabled={
                !canEdit
              }
              onChange={(
                event
              ) =>
                updateField(
                  "maxDeliveryDistance",
                  event.target
                    .value
                )
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 disabled:bg-slate-50"
            />
          </div>
        </div>

        <label className="mt-5 flex items-center justify-between gap-6 rounded-xl border border-slate-200 p-4">
          <div>
            <p className="font-medium text-slate-900">
              Activar geovalla
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Limita determinadas operaciones a clientes situados dentro del radio configurado.
            </p>
          </div>

          <input
            type="checkbox"
            checked={
              form.geoFenceEnabled
            }
            disabled={
              !canEdit
            }
            onChange={(
              event
            ) =>
              updateField(
                "geoFenceEnabled",
                event.target
                  .checked
              )
            }
            className="h-5 w-5 accent-indigo-600"
          />
        </label>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionHeader
          icon={
            <Globe2
              size={
                20
              }
            />
          }
          title="Localización"
          description="Moneda y zona horaria utilizadas por el establecimiento."
        />

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <FieldLabel>
              Moneda
            </FieldLabel>

            <input
              value={
                form.currency
              }
              maxLength={
                3
              }
              disabled={
                !canEdit
              }
              onChange={(
                event
              ) =>
                updateField(
                  "currency",
                  event.target
                    .value
                    .toUpperCase()
                )
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 uppercase disabled:bg-slate-50"
            />
          </div>

          <div>
            <FieldLabel>
              Zona horaria
            </FieldLabel>

            <input
              value={
                form.timezone
              }
              disabled={
                !canEdit
              }
              placeholder="Europe/Madrid"
              onChange={(
                event
              ) =>
                updateField(
                  "timezone",
                  event.target
                    .value
                )
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 disabled:bg-slate-50"
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionHeader
          icon={
            <Palette
              size={
                20
              }
            />
          }
          title="Identidad visual"
          description="Colores principales utilizados por la experiencia del cliente."
        />

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <FieldLabel>
              Color primario
            </FieldLabel>

            <div className="flex gap-3">
              <input
                type="color"
                value={
                  form.primaryColor
                }
                disabled={
                  !canEdit
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    "primaryColor",
                    event.target
                      .value
                  )
                }
                className="h-11 w-14 rounded-lg border border-slate-300 bg-white p-1"
              />

              <input
                value={
                  form.primaryColor
                }
                disabled={
                  !canEdit
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    "primaryColor",
                    event.target
                      .value
                  )
                }
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2.5 disabled:bg-slate-50"
              />
            </div>
          </div>

          <div>
            <FieldLabel>
              Color secundario
            </FieldLabel>

            <div className="flex gap-3">
              <input
                type="color"
                value={
                  form.secondaryColor
                }
                disabled={
                  !canEdit
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    "secondaryColor",
                    event.target
                      .value
                  )
                }
                className="h-11 w-14 rounded-lg border border-slate-300 bg-white p-1"
              />

              <input
                value={
                  form.secondaryColor
                }
                disabled={
                  !canEdit
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    "secondaryColor",
                    event.target
                      .value
                  )
                }
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2.5 disabled:bg-slate-50"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionHeader
          icon={
            <ShieldCheck
              size={
                20
              }
            />
          }
          title="Funciones del establecimiento"
          description="Activa o desactiva módulos disponibles para clientes y personal."
        />

        <div className="grid gap-4 lg:grid-cols-2">
          <FeatureToggle
            title="Geolocalización"
            description="Permite usar la posición del cliente."
            checked={
              form.features
                .geolocation
            }
            disabled={
              !canEdit
            }
            onChange={(
              value
            ) =>
              updateFeature(
                "geolocation",
                value
              )
            }
          />

          <FeatureToggle
            title="Pago online"
            description="Permite pagos digitales desde la aplicación."
            checked={
              form.features
                .onlinePayment
            }
            disabled={
              !canEdit
            }
            onChange={(
              value
            ) =>
              updateFeature(
                "onlinePayment",
                value
              )
            }
          />

          <FeatureToggle
            title="División de cuenta"
            description="Permite dividir una cuenta entre varios clientes."
            checked={
              form.features
                .splitBill
            }
            disabled={
              !canEdit
            }
            onChange={(
              value
            ) =>
              updateFeature(
                "splitBill",
                value
              )
            }
          />

          <FeatureToggle
            title="Valoraciones"
            description="Permite registrar puntuaciones y comentarios."
            checked={
              form.features
                .ratings
            }
            disabled={
              !canEdit
            }
            onChange={(
              value
            ) =>
              updateFeature(
                "ratings",
                value
              )
            }
          />

          <FeatureToggle
            title="Fidelización"
            description="Activa el sistema de puntos para clientes."
            checked={
              form.features
                .loyalty
            }
            disabled={
              !canEdit
            }
            onChange={(
              value
            ) =>
              updateFeature(
                "loyalty",
                value
              )
            }
          />

          <FeatureToggle
            title="Reservas"
            description="Habilita funciones relacionadas con reservas."
            checked={
              form.features
                .reservations
            }
            disabled={
              !canEdit
            }
            onChange={(
              value
            ) =>
              updateFeature(
                "reservations",
                value
              )
            }
          />

          <FeatureToggle
            title="Llamar al camarero"
            description="Permite solicitar asistencia desde la mesa."
            checked={
              form.features
                .callWaiter
            }
            disabled={
              !canEdit
            }
            onChange={(
              value
            ) =>
              updateFeature(
                "callWaiter",
                value
              )
            }
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <CreditCard
            size={
              22
            }
            className="text-indigo-600"
          />

          <p className="mt-3 text-sm text-slate-500">
            Moneda
          </p>

          <p className="mt-1 text-lg font-semibold text-slate-900">
            {
              form.currency
            }
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <Users
            size={
              22
            }
            className="text-indigo-600"
          />

          <p className="mt-3 text-sm text-slate-500">
            Tenant
          </p>

          <p className="mt-1 text-lg font-semibold text-slate-900">
            #{establishment.id}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <Star
            size={
              22
            }
            className="text-indigo-600"
          />

          <p className="mt-3 text-sm text-slate-500">
            Fidelización
          </p>

          <p className="mt-1 text-lg font-semibold text-slate-900">
            {form.features
              .loyalty
              ? "Activa"
              : "Desactivada"}
          </p>
        </div>
      </section>
    </form>
  );
}