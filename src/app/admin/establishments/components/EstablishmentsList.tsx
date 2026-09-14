"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Building2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

import {
  ADMIN_ESTABLISHMENTS_MESSAGES,
} from "@/config/admin-establishments-i18n";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

import {
  useAdminLanguageStore,
} from "@/store/admin-language.store";

interface Establishment {
  id: number;
  name: string;
  slug: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  active: boolean;
}

export default function EstablishmentsList() {
  const language =
    useAdminLanguageStore(
      (state) =>
        state.language
    );

  const messages =
    ADMIN_ESTABLISHMENTS_MESSAGES[
      language
    ];

  const [
    establishments,
    setEstablishments,
  ] =
    useState<Establishment[]>(
      []
    );

  const [
    loading,
    setLoading,
  ] =
    useState(
      true
    );

  const [
    error,
    setError,
  ] =
    useState(
      ""
    );

  function currentMessages() {
    return ADMIN_ESTABLISHMENTS_MESSAGES[
      useAdminLanguageStore
        .getState()
        .language
    ];
  }

  useEffect(
    () => {
      void loadEstablishments();
    },
    []
  );

  async function loadEstablishments() {
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
          currentMessages()
            .loadError
        );

        return;
      }

      setEstablishments(
        json.data
      );
    } catch (
      error
    ) {
      console.error(
        "Error loading establishment:",
        error
      );

      setError(
        currentMessages()
          .loadError
      );
    } finally {
      setLoading(
        false
      );
    }
  }

  async function toggleActive(
    id: number,
    current: boolean
  ) {
    setError(
      ""
    );

    const activeMessages =
      currentMessages();

    try {
      const response =
        await adminFetch(
          `/api/establishments/${id}`,
          {
            method:
              "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                active:
                  !current,
              }),
          }
        );

      const json =
        await response.json();

      if (
        !response.ok ||
        !json.success
      ) {
        setError(
          activeMessages.updateError
        );

        return;
      }

      await loadEstablishments();
    } catch (
      error
    ) {
      console.error(
        "Error updating establishment:",
        error
      );

      setError(
        activeMessages.updateError
      );
    }
  }

  if (
    loading
  ) {
    return (
      <div className="p-8">
        {
          messages.loading
        }
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">
          {
            messages.title
          }
        </h2>

        <p className="text-gray-500">
          {
            messages.subtitle
          }
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {
            error
          }
        </div>
      )}

      {establishments.length ===
        0 && (
        <div className="rounded-xl border bg-white p-8 text-center text-gray-500">
          {
            messages.empty
          }
        </div>
      )}

      <div className="grid gap-5">
        {establishments.map(
          (
            establishment
          ) => {
            const actionLabel =
              establishment.active
                ? messages.deactivate
                : messages.activate;

            return (
              <div
                key={
                  establishment.id
                }
                className="rounded-xl border bg-white p-6 shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <Building2
                      size={28}
                      className="text-indigo-600"
                    />

                    <div>
                      <h3 className="text-lg font-semibold">
                        {
                          establishment.name
                        }
                      </h3>

                      <p className="text-sm text-gray-500">
                        /
                        {
                          establishment.slug
                        }
                      </p>

                      <div className="mt-3 space-y-1 text-sm text-gray-600">
                        {establishment.address && (
                          <p>
                            {
                              establishment.address
                            }
                          </p>
                        )}

                        {establishment.phone && (
                          <p>
                            {
                              establishment.phone
                            }
                          </p>
                        )}

                        {establishment.email && (
                          <p>
                            {
                              establishment.email
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      void toggleActive(
                        establishment.id,
                        establishment.active
                      )
                    }
                    title={
                      actionLabel
                    }
                    aria-label={
                      actionLabel
                    }
                  >
                    {establishment.active ? (
                      <ToggleRight
                        size={32}
                        className="text-green-600"
                      />
                    ) : (
                      <ToggleLeft
                        size={32}
                        className="text-gray-400"
                      />
                    )}
                  </button>
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}