"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

import {
  useStore,
} from "@/store/useStore";

import {
  CustomerOnboarding,
} from "@/components/client/CustomerOnboarding";

import {
  MenuList,
} from "@/components/client/MenuList";

import {
  Cart,
} from "@/components/client/Cart";

import {
  OrderHistory,
} from "@/components/client/OrderHistory";

import {
  Header,
} from "@/components/client/Header";

import {
  BottomNav,
} from "@/components/client/BottomNav";

import {
  isSupportedLanguage,
} from "@/config/languages";

import type {
  Establishment,
  Language,
} from "@/types";

type ActiveTab =
  | "menu"
  | "orders"
  | "cart";

export default function ClientPage() {
  const params =
    useParams();

  const qrCode =
    typeof params?.qrCode ===
    "string"
      ? params.qrCode
      : "";

  const {
    session,
    establishment,
    setEstablishment,
    language,
    setLanguage,
  } =
    useStore();

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

  const [
    activeTab,
    setActiveTab,
  ] =
    useState<ActiveTab>(
      "menu"
    );

  useEffect(
    () => {
      if (
        !qrCode
      ) {
        setError(
          "Código QR no válido."
        );

        setLoading(
          false
        );

        return;
      }

      let cancelled =
        false;

      async function loadEstablishment() {
        try {
          setLoading(
            true
          );

          setError(
            ""
          );

          /*
           * Cargamos siempre el establecimiento antes
           * de mostrar el onboarding.
           *
           * Así conocemos:
           * - idioma predeterminado
           * - idiomas habilitados
           * - configuración del establecimiento
           */
          const response =
            await fetch(
              `/api/establishment/${encodeURIComponent(
                qrCode
              )}`,
              {
                cache:
                  "no-store",
              }
            );

          const data =
            await response.json();

          if (
            !response.ok
          ) {
            throw new Error(
              data?.error ||
                "No se pudo cargar el establecimiento."
            );
          }

          if (
            cancelled
          ) {
            return;
          }

          const loadedEstablishment =
            data as Establishment;

          setEstablishment(
            loadedEstablishment
          );

          /*
           * Determinamos los idiomas realmente válidos
           * para este establecimiento.
           */
          const enabledLanguages =
            Array.isArray(
              loadedEstablishment.enabledLanguages
            )
              ? loadedEstablishment.enabledLanguages.filter(
                  (
                    value
                  ): value is Language =>
                    isSupportedLanguage(
                      value
                    )
                )
              : [];

          const validDefaultLanguage =
            isSupportedLanguage(
              loadedEstablishment.defaultLanguage
            ) &&
            enabledLanguages.includes(
              loadedEstablishment.defaultLanguage
            )
              ? loadedEstablishment.defaultLanguage
              : enabledLanguages[0] ??
                "es";

          /*
           * Conservamos el idioma guardado por el cliente
           * solamente si sigue estando habilitado.
           */
          if (
            !enabledLanguages.includes(
              language
            )
          ) {
            setLanguage(
              validDefaultLanguage
            );
          }
        } catch (
          loadError
        ) {
          console.error(
            "Error loading establishment:",
            loadError
          );

          if (
            cancelled
          ) {
            return;
          }

          setEstablishment(
            null
          );

          setError(
            loadError instanceof
              Error
              ? loadError.message
              : "No se pudo cargar el establecimiento."
          );
        } finally {
          if (
            !cancelled
          ) {
            setLoading(
              false
            );
          }
        }
      }

      void loadEstablishment();

      return () => {
        cancelled =
          true;
      };
    },
    [
      language,
      qrCode,
      setEstablishment,
      setLanguage,
    ]
  );

  if (
    loading
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-black" />

          <p className="text-gray-600">
            Cargando...
          </p>
        </div>
      </div>
    );
  }

  if (
    error ||
    !establishment
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-red-600">
            No se pudo abrir el restaurante
          </h1>

          <p className="mt-3 text-sm text-gray-600">
            {error ||
              "El establecimiento no está disponible."}
          </p>
        </div>
      </div>
    );
  }

  if (
    !session ||
    !session.active
  ) {
    return (
      <CustomerOnboarding
        qrCode={
          qrCode
        }
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />

      <main className="container mx-auto px-4 py-6">
        {activeTab ===
          "menu" && (
          <MenuList />
        )}

        {activeTab ===
          "orders" && (
          <OrderHistory />
        )}

        {activeTab ===
          "cart" && (
          <Cart />
        )}
      </main>

      <BottomNav
        activeTab={
          activeTab
        }
        onTabChange={
          setActiveTab
        }
      />
    </div>
  );
}