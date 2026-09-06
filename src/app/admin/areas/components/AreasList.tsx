"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Map,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

interface Area {
  id: number;
  establishmentId: number;
  name: string;
  description?: string | null;
  active: boolean;
}

export default function AreasList() {
  const [
    areas,
    setAreas,
  ] =
    useState<Area[]>([]);

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
    void loadAreas();
  }, []);

  async function loadAreas() {
    setError("");

    try {
      const res =
        await adminFetch(
          "/api/areas"
        );

      const json =
        await res.json();

      if (
        !res.ok ||
        !json.success
      ) {
        setError(
          json.error ||
            "No se pudieron cargar las áreas."
        );

        return;
      }

      setAreas(
        json.data
      );
    } catch (error) {
      console.error(
        "Error loading areas:",
        error
      );

      setError(
        "No se pudieron cargar las áreas."
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
          `/api/areas/${id}`,
          {
            method:
              "PATCH",

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
          json.error ||
            "No se pudo actualizar el área."
        );

        return;
      }

      await loadAreas();
    } catch (error) {
      console.error(
        "Error updating area:",
        error
      );

      setError(
        "No se pudo actualizar el área."
      );
    }
  }

  async function deleteArea(
    id: number
  ) {
    if (
      !window.confirm(
        "¿Desactivar esta área?"
      )
    ) {
      return;
    }

    setError("");

    try {
      const res =
        await adminFetch(
          `/api/areas/${id}`,
          {
            method:
              "DELETE",
          }
        );

      const json =
        await res.json();

      if (
        !res.ok ||
        !json.success
      ) {
        setError(
          json.error ||
            "No se pudo desactivar el área."
        );

        return;
      }

      await loadAreas();
    } catch (error) {
      console.error(
        "Error deleting area:",
        error
      );

      setError(
        "No se pudo desactivar el área."
      );
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        Cargando áreas...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">
          Áreas
        </h2>

        <p className="text-gray-500">
          Gestión de zonas del establecimiento
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {areas.map(
          (area) => (
            <div
              key={
                area.id
              }
              className="bg-white rounded-xl shadow border p-6"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Map
                    size={
                      24
                    }
                  />

                  <div>
                    <h3 className="font-semibold">
                      {
                        area.name
                      }
                    </h3>

                    <p className="text-sm text-gray-500">
                      {area.description ||
                        "Sin descripción"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      void toggleActive(
                        area.id,
                        area.active
                      )
                    }
                    aria-label={
                      area.active
                        ? "Desactivar área"
                        : "Activar área"
                    }
                  >
                    {area.active ? (
                      <ToggleRight
                        size={
                          28
                        }
                        className="text-green-600"
                      />
                    ) : (
                      <ToggleLeft
                        size={
                          28
                        }
                        className="text-gray-400"
                      />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      void deleteArea(
                        area.id
                      )
                    }
                    aria-label="Desactivar área"
                  >
                    <Trash2
                      size={
                        20
                      }
                      className="text-red-500"
                    />
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {areas.length ===
        0 && (
        <div className="rounded-xl border bg-white p-6 text-gray-500">
          No hay áreas configuradas.
        </div>
      )}
    </div>
  );
}