"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

import StatsCards from "./StatsCards";
import OrdersGrid from "./OrdersGrid";
import EditOrderModal from "./EditOrderModal";

interface Order {
  id: number;
  orderNumber: string;
  tableId: number;
  status: string;
  total: number;
  notes?: string;
  createdAt: string;
}

export default function OrdersList() {
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
      const res =
        await adminFetch(
          "/api/orders"
        );

      const json =
        await res.json();

      if (json.success) {
        setOrders(
          json.data
        );
      } else {
        console.error(
          json.error
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
        `¿Eliminar el pedido ${order.orderNumber}?`
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
            "No se pudo eliminar el pedido."
        );
      }
    } catch (error) {
      console.error(
        error
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
    order: Order
  ) {
    console.log(
      order
    );

    // Más adelante abriremos un OrderDetailsModal.
  }

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