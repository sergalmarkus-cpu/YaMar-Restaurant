"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

import OrderCard from "./OrderCard";

interface Order {
  id: number;
  orderNumber: string;
  tableId: number;
  tableName: string | null;
  status: string;
  total: number;
  createdAt: string;
}

const columns = [
  {
    id: "pending",
    title: "Pendientes",
  },
  {
    id: "accepted",
    title: "Aceptados",
  },
  {
    id: "preparing",
    title: "Preparando",
  },
  {
    id: "ready",
    title: "Listos",
  },
  {
    id: "delivered",
    title: "Entregados",
  },
];

export default function KitchenBoard() {
  const [
    orders,
    setOrders,
  ] =
    useState<Order[]>([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  async function fetchOrders() {
    try {
      const res =
        await adminFetch(
          "/api/kitchen",
          {
            cache:
              "no-store",
          }
        );

      const json =
        await res.json();

      if (
        !res.ok ||
        !json.success
      ) {
        console.error(
          "Error loading kitchen orders:",
          json.error ??
            json.message
        );

        return;
      }

      setOrders(
        json.data
      );
    } catch (
      error
    ) {
      console.error(
        "Error loading kitchen orders:",
        error
      );
    } finally {
      setLoading(
        false
      );
    }
  }

  useEffect(() => {
    void fetchOrders();

    const interval =
      window.setInterval(
        () => {
          void fetchOrders();
        },
        5000
      );

    return () => {
      window.clearInterval(
        interval
      );
    };
  }, []);

  async function updateStatus(
    id: number,
    status: string
  ) {
    try {
      const res =
        await adminFetch(
          `/api/orders/${id}`,
          {
            method:
              "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                status,
              }),
          }
        );

      const json =
        await res.json();

      if (
        !res.ok ||
        !json.success
      ) {
        console.error(
          "Error updating order status:",
          json.error ??
            json.message
        );

        return;
      }

      await fetchOrders();
    } catch (
      error
    ) {
      console.error(
        "Error updating order status:",
        error
      );
    }
  }

  if (
    loading
  ) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-orange-600" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {columns.map(
        (
          column
        ) => (
          <div
            key={
              column.id
            }
            className="rounded-xl bg-gray-100 p-4"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold">
                {
                  column.title
                }
              </h2>

              <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold">
                {
                  orders.filter(
                    (
                      order
                    ) =>
                      order.status ===
                      column.id
                  ).length
                }
              </span>
            </div>

            <div className="space-y-3">
              {orders
                .filter(
                  (
                    order
                  ) =>
                    order.status ===
                    column.id
                )
                .map(
                  (
                    order
                  ) => (
                    <OrderCard
                      key={
                        order.id
                      }
                      order={
                        order
                      }
                      onStatusChange={
                        updateStatus
                      }
                    />
                  )
                )}
            </div>
          </div>
        )
      )}
    </div>
  );
}