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
  adminFetch,
} from "@/lib/api/admin-fetch";

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
  const [
    establishments,
    setEstablishments,
  ] =
    useState<Establishment[]>([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  useEffect(() => {
    void loadEstablishments();
  }, []);

  async function loadEstablishments() {
    setError("");

    try {
      const res =
        await adminFetch(
          "/api/establishments"
        );

      const json =
        await res.json();

      if (
        !res.ok ||
        !json.success
      ) {
        setError(
          json.error ??
            "No se pudo cargar el establecimiento."
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
        error
      );

      setError(
        "No se pudo cargar el establecimiento."
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
    setError("");

    try {
      const res =
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
        await res.json();

      if (
        !res.ok ||
        !json.success
      ) {
        setError(
          json.error ??
            "No se pudo actualizar el establecimiento."
        );

        return;
      }

      await loadEstablishments();
    } catch (
      error
    ) {
      console.error(
        error
      );

      setError(
        "Error al actualizar el establecimiento."
      );
    }
  }

  if (
    loading
  ) {
    return (
      <div className="p-8">
        Cargando establecimiento...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">
          Establecimiento
        </h2>

        <p className="text-gray-500">
          Gestión del establecimiento actual
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {establishments.length ===
        0 && (
        <div className="rounded-xl border bg-white p-8 text-center text-gray-500">
          No hay ningún establecimiento disponible.
        </div>
      )}

      <div className="grid gap-5">
        {establishments.map(
          (
            establishment
          ) => (
            <div
              key={
                establishment.id
              }
              className="rounded-xl border bg-white p-6 shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <Building2
                    size={
                      28
                    }
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
                    establishment.active
                      ? "Desactivar establecimiento"
                      : "Activar establecimiento"
                  }
                  aria-label={
                    establishment.active
                      ? "Desactivar establecimiento"
                      : "Activar establecimiento"
                  }
                >
                  {establishment.active ? (
                    <ToggleRight
                      size={
                        32
                      }
                      className="text-green-600"
                    />
                  ) : (
                    <ToggleLeft
                      size={
                        32
                      }
                      className="text-gray-400"
                    />
                  )}
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}