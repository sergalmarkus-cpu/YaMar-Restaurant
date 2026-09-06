"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useStore,
} from "@/store/useStore";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Input,
} from "@/components/ui/input";

import {
  Button,
} from "@/components/ui/button";

import {
  isValidEmail,
  sanitizeInput,
} from "@/lib/utils";

import {
  isSupportedLanguage,
  SUPPORTED_LANGUAGES,
} from "@/config/languages";

import type {
  Language,
  Session,
} from "@/types";

interface Props {
  qrCode: string;
}

export function CustomerOnboarding({
  qrCode,
}: Props) {
  const {
    setSession,
    establishment,
    language,
    setLanguage,
  } =
    useStore();

  const [
    formData,
    setFormData,
  ] =
    useState({
      customerName:
        "",
      customerEmail:
        "",
      customerPhone:
        "",
      roomNumber:
        "",
    });

  const [
    loading,
    setLoading,
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

  const [
    locationPermission,
    setLocationPermission,
  ] =
    useState(
      false
    );

  /*
   * ==========================================================
   * IDIOMAS HABILITADOS DEL ESTABLECIMIENTO
   * ==========================================================
   */

  const availableLanguages =
    useMemo(
      () => {
        if (
          !establishment ||
          !Array.isArray(
            establishment.enabledLanguages
          )
        ) {
          return [];
        }

        const enabled =
          new Set<Language>(
            establishment.enabledLanguages.filter(
              (
                value
              ): value is Language =>
                isSupportedLanguage(
                  value
                )
            )
          );

        return SUPPORTED_LANGUAGES.filter(
          (
            item
          ) =>
            enabled.has(
              item.code
            )
        );
      },
      [
        establishment,
      ]
    );

  /*
   * Si el idioma persistido del navegador ya no está
   * habilitado para el establecimiento actual,
   * usamos el idioma predeterminado.
   */
  useEffect(
    () => {
      if (
        !establishment ||
        availableLanguages.length ===
          0
      ) {
        return;
      }

      const availableCodes =
        availableLanguages.map(
          (
            item
          ) =>
            item.code
        );

      if (
        availableCodes.includes(
          language
        )
      ) {
        return;
      }

      const defaultLanguage =
        isSupportedLanguage(
          establishment.defaultLanguage
        ) &&
        availableCodes.includes(
          establishment.defaultLanguage
        )
          ? establishment.defaultLanguage
          : availableCodes[0];

      setLanguage(
        defaultLanguage
      );
    },
    [
      availableLanguages,
      establishment,
      language,
      setLanguage,
    ]
  );

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setError(
      ""
    );

    setLoading(
      true
    );

    try {
      if (
        !establishment
      ) {
        setError(
          "No se ha podido cargar la configuración del establecimiento."
        );

        return;
      }

      if (
        !formData.customerName.trim()
      ) {
        setError(
          "El nombre es obligatorio."
        );

        return;
      }

      if (
        formData.customerEmail &&
        !isValidEmail(
          formData.customerEmail
        )
      ) {
        setError(
          "La dirección de correo electrónico no es válida."
        );

        return;
      }

      const allowedLanguages =
        availableLanguages.map(
          (
            item
          ) =>
            item.code
        );

      if (
        !allowedLanguages.includes(
          language
        )
      ) {
        setError(
          "El idioma seleccionado no está disponible en este establecimiento."
        );

        return;
      }

      let latitude:
        number |
        undefined;

      let longitude:
        number |
        undefined;

      if (
        locationPermission
      ) {
        try {
          const position =
            await new Promise<GeolocationPosition>(
              (
                resolve,
                reject
              ) => {
                navigator.geolocation.getCurrentPosition(
                  resolve,
                  reject
                );
              }
            );

          latitude =
            position.coords.latitude;

          longitude =
            position.coords.longitude;
        } catch (
          locationError
        ) {
          console.error(
            "Location error:",
            locationError
          );
        }
      }

      const deviceId =
        localStorage.getItem(
          "deviceId"
        ) ||
        generateDeviceId();

      localStorage.setItem(
        "deviceId",
        deviceId
      );

      const response =
        await fetch(
          "/api/session/create",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                qrCode,

                customerName:
                  sanitizeInput(
                    formData.customerName
                  ),

                customerEmail:
                  formData.customerEmail
                    ? sanitizeInput(
                        formData.customerEmail
                      )
                    : undefined,

                customerPhone:
                  formData.customerPhone
                    ? sanitizeInput(
                        formData.customerPhone
                      )
                    : undefined,

                roomNumber:
                  formData.roomNumber
                    ? sanitizeInput(
                        formData.roomNumber
                      )
                    : undefined,

                latitude:
                  latitude?.toString(),

                longitude:
                  longitude?.toString(),

                deviceId,

                language,
              }),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok
      ) {
        setError(
          data.error ||
            "No se pudo iniciar la sesión."
        );

        return;
      }

      /*
       * /api/session/create devuelve directamente
       * la fila de sesión.
       */
      setSession(
        data as Session
      );
    } catch (
      submitError
    ) {
      console.error(
        "Error creating session:",
        submitError
      );

      setError(
        "Se produjo un error. Inténtalo de nuevo."
      );
    } finally {
      setLoading(
        false
      );
    }
  }

  function generateDeviceId() {
    return `device-${Date.now()}-${Math.random()
      .toString(36)
      .slice(
        2,
        11
      )}`;
  }

  function requestLocation() {
    if (
      !(
        "geolocation" in
        navigator
      )
    ) {
      setLocationPermission(
        false
      );

      return;
    }

    navigator.geolocation.getCurrentPosition(
      () =>
        setLocationPermission(
          true
        ),

      () =>
        setLocationPermission(
          false
        )
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">
            Bienvenido
          </CardTitle>

          <CardDescription>
            Introduce tus datos para empezar a pedir.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={
              handleSubmit
            }
            className="space-y-4"
          >
            <div>
              <label className="mb-2 block text-sm font-medium">
                Idioma
              </label>

              {availableLanguages.length >
              0 ? (
                <select
                  value={
                    language
                  }
                  onChange={(
                    event
                  ) => {
                    const value =
                      event.target.value;

                    if (
                      isSupportedLanguage(
                        value
                      )
                    ) {
                      setLanguage(
                        value
                      );
                    }
                  }}
                  className="h-10 w-full rounded-lg border border-gray-300 px-3"
                >
                  {availableLanguages.map(
                    (
                      item
                    ) => (
                      <option
                        key={
                          item.code
                        }
                        value={
                          item.code
                        }
                      >
                        {
                          item.nativeName
                        }
                      </option>
                    )
                  )}
                </select>
              ) : (
                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  Este establecimiento no tiene ningún idioma disponible.
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Nombre *
              </label>

              <Input
                type="text"
                value={
                  formData.customerName
                }
                onChange={(
                  event
                ) =>
                  setFormData(
                    (
                      current
                    ) => ({
                      ...current,

                      customerName:
                        event.target.value,
                    })
                  )
                }
                placeholder="Nombre y apellidos"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Email (opcional)
              </label>

              <Input
                type="email"
                value={
                  formData.customerEmail
                }
                onChange={(
                  event
                ) =>
                  setFormData(
                    (
                      current
                    ) => ({
                      ...current,

                      customerEmail:
                        event.target.value,
                    })
                  )
                }
                placeholder="cliente@example.com"
              />

              <p className="mt-1 text-xs text-gray-500">
                Puede utilizarse para recibir el recibo digital.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Teléfono (opcional)
              </label>

              <Input
                type="tel"
                value={
                  formData.customerPhone
                }
                onChange={(
                  event
                ) =>
                  setFormData(
                    (
                      current
                    ) => ({
                      ...current,

                      customerPhone:
                        event.target.value,
                    })
                  )
                }
                placeholder="+34 600 000 000"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Habitación (opcional)
              </label>

              <Input
                type="text"
                value={
                  formData.roomNumber
                }
                onChange={(
                  event
                ) =>
                  setFormData(
                    (
                      current
                    ) => ({
                      ...current,

                      roomNumber:
                        event.target.value,
                    })
                  )
                }
                placeholder="A12"
              />
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-3">
              <input
                type="checkbox"
                id="location"
                checked={
                  locationPermission
                }
                onChange={(
                  event
                ) => {
                  if (
                    event.target.checked
                  ) {
                    requestLocation();
                  } else {
                    setLocationPermission(
                      false
                    );
                  }
                }}
                className="h-4 w-4"
              />

              <label
                htmlFor="location"
                className="text-sm text-gray-700"
              >
                Permitir ubicación para comprobar que estás dentro del establecimiento.
              </label>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={
                loading ||
                availableLanguages.length ===
                  0
              }
            >
              {loading
                ? "Cargando..."
                : "Empezar pedido"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}