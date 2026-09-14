"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  ADMIN_ORDERS_MESSAGES,
} from "@/config/admin-orders-i18n";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

import {
  useAdminLanguageStore,
} from "@/store/admin-language.store";

import EditOrderModal from "./EditOrderModal";
import OrdersGrid from "./OrdersGrid";
import StatsCards from "./StatsCards";

interface Order {
  id: number;
  orderNumber: string;
  tableId: number;
  status: string;
  total: number;
  notes?: string;
  createdAt: string;
}

interface ApiEstablishment {
  id: number;
  currency?:
    | string
    | null;
}

export default function OrdersList() {
  const language =
    useAdminLanguageStore(
      (state) =>
        state.language
    );

  const messages =
    ADMIN_ORDERS_MESSAGES[
      language
    ];

  const [
    orders,
    setOrders,
  ] =
    useState<Order[]>([]);

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

  const [
    editingOrder,
    setEditingOrder,
  ] =
    useState<Order | null>(
      null
    );

  const [
    editOpen,
    setEditOpen,
  ] =
    useState(false);

  async function fetchOrders() {
    try {
      const [
        ordersRes,
        establishmentsRes,
      ] =
        await Promise.all([
          adminFetch(
            "/api/orders"
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
        ordersRes.ok &&
        ordersJson.success
      ) {
        setOrders(
          Array.isArray(
            ordersJson.data
          )
            ? ordersJson.data
            : []
        );
      } else {
        console.error(
          ordersJson.error ??
            ordersJson.message
        );
      }

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

        const current =
          establishments[0];

        setCurrency(
          current?.currency
            ?.trim()
            .toUpperCase() ??
            ""
        );
      }
    } catch (error) {
      console.error(
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
  }, []);

  async function deleteOrder(
    order: Order
  ) {
    if (
      !confirm(
        messages.list.deleteConfirm(
          order.orderNumber
        )
      )
    ) {
      return;
    }

    try {
      const res =
        await adminFetch(
          `/api/orders/${order.id}`,
          {
            method:
              "DELETE",
          }
        );

      const json =
        await res.json();

      if (json.success) {
        await fetchOrders();
      } else {
        alert(
          json.error ??
            json.message ??
            messages.list
              .deleteError
        );
      }
    } catch (error) {
      console.error(
        error
      );

      alert(
        messages.list
          .deleteError
      );
    }
  }

  function editOrder(
    order: Order
  ) {
    setEditingOrder(
      order
    );

    setEditOpen(
      true
    );
  }

  function viewOrder(
    _order: Order
  ) {}

  const pending =
    orders.filter(
      (order) =>
        order.status ===
        "pending"
    ).length;

  const preparing =
    orders.filter(
      (order) =>
        order.status ===
        "preparing"
    ).length;

  const delivered =
    orders.filter(
      (order) =>
        order.status ===
        "delivered"
    ).length;

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <StatsCards
          total={
            orders.length
          }
          pending={
            pending
          }
          preparing={
            preparing
          }
          delivered={
            delivered
          }
        />

        <OrdersGrid
          orders={
            orders
          }
          currency={
            currency
          }
          onView={
            viewOrder
          }
          onEdit={
            editOrder
          }
          onDelete={
            deleteOrder
          }
        />
      </div>

      <EditOrderModal
        open={
          editOpen
        }
        order={
          editingOrder
        }
        onClose={() => {
          setEditOpen(
            false
          );

          setEditingOrder(
            null
          );
        }}
        onUpdated={() => {
          setEditOpen(
            false
          );

          setEditingOrder(
            null
          );

          void fetchOrders();
        }}
      />
    </>
  );
}