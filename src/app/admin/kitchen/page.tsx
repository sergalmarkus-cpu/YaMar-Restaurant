"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  ADMIN_KITCHEN_MESSAGES,
} from "@/config/admin-kitchen-i18n";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

import {
  useAdminLanguageStore,
} from "@/store/admin-language.store";

import KitchenHeader from "./components/KitchenHeader";
import KitchenStats from "./components/KitchenStats";
import KitchenBoard from "./components/KitchenBoard";

export interface KitchenOrder {
  id: number;
  orderNumber: string;
  tableId: number;
  tableName: string | null;
  status: string;
  total: number;
  createdAt: string;
}

interface ApiEstablishment {
  id: number;
  currency?: string | null;
}

export default function KitchenPage() {
  const language =
    useAdminLanguageStore(
      (state) =>
        state.language
    );

  const messages =
    ADMIN_KITCHEN_MESSAGES[
      language
    ];

  const [
    orders,
    setOrders,
  ] =
    useState<
      KitchenOrder[]
    >([]);

  const [
    currency,
    setCurrency,
  ] =
    useState("");

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const fetchKitchenData =
    useCallback(
      async () => {
        try {
          const [
            ordersRes,
            establishmentsRes,
          ] =
            await Promise.all([
              adminFetch(
                "/api/kitchen",
                {
                  cache:
                    "no-store",
                }
              ),

              adminFetch(
                "/api/establishments"
              ),
            ]);

          const [
            ordersJson,
            establishmentsJson,
          ] =
            await Promise.all([
              ordersRes.json(),
              establishmentsRes.json(),
            ]);

          if (
            !ordersRes.ok ||
            !ordersJson.success
          ) {
            console.error(
              messages.board
                .loadError,
              ordersJson.error ??
                ordersJson.message
            );

            return;
          }

          setOrders(
            Array.isArray(
              ordersJson.data
            )
              ? ordersJson.data
              : []
          );

          if (
            establishmentsRes.ok &&
            establishmentsJson.success &&
            Array.isArray(
              establishmentsJson.data
            )
          ) {
            const establishments:
              ApiEstablishment[] =
                establishmentsJson.data;

            setCurrency(
              establishments[0]
                ?.currency
                ?.trim()
                .toUpperCase() ??
                ""
            );
          }
        } catch (
          error
        ) {
          console.error(
            messages.board
              .loadError,
            error
          );
        } finally {
          setLoading(
            false
          );
        }
      },
      [
        messages.board
          .loadError,
      ]
    );

  useEffect(() => {
    void fetchKitchenData();

    const interval =
      window.setInterval(
        () => {
          void fetchKitchenData();
        },
        5000
      );

    return () => {
      window.clearInterval(
        interval
      );
    };
  }, [
    fetchKitchenData,
  ]);

  return (
    <div className="space-y-6">
      <KitchenHeader />

      <KitchenStats
        orders={
          orders
        }
      />

      <KitchenBoard
        orders={
          orders
        }
        currency={
          currency
        }
        loading={
          loading
        }
        onRefresh={
          fetchKitchenData
        }
      />
    </div>
  );
}