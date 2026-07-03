"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Package, CheckCircle, XCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { Order, TranslatedText } from "@/types";

export function OrderHistory() {
  const { session, establishment, language } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchOrders();
      
      // Poll for updates every 30 seconds
      const interval = setInterval(fetchOrders, 30000);
      return () => clearInterval(interval);
    }
  }, [session]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/orders/session/${session?.id}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="text-yellow-600" />;
      case "accepted":
      case "preparing":
        return <Package className="text-blue-600" />;
      case "ready":
      case "delivering":
      case "delivered":
        return <CheckCircle className="text-green-600" />;
      case "cancelled":
        return <XCircle className="text-red-600" />;
      default:
        return <Clock className="text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "warning" | "success" | "destructive"> = {
      pending: "warning",
      accepted: "default",
      preparing: "default",
      ready: "success",
      delivering: "success",
      delivered: "success",
      cancelled: "destructive",
    };

    return <Badge variant={variants[status] || "default"}>{status.toUpperCase()}</Badge>;
  };

  const getTotalSpent = () => {
    return orders.reduce((sum, order) => sum + parseFloat(order.total), 0);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
        <p className="text-gray-600">Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
        <p className="text-gray-600">Your order history will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Order History</h2>
        <p className="text-gray-600">
          Total spent: {formatCurrency(getTotalSpent(), establishment?.currency)}
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    Order #{order.orderNumber}
                  </CardTitle>
                  <CardDescription>
                    {new Date(order.createdAt).toLocaleString()}
                  </CardDescription>
                </div>
                {getStatusBadge(order.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {order.items && order.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      {item.quantity}x {item.product?.name || "Product"}
                    </span>
                    <span>{formatCurrency(item.subtotal, establishment?.currency)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(order.total, establishment?.currency)}</span>
                </div>
                {order.estimatedTime && order.status !== "delivered" && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={16} />
                    <span>Estimated time: {order.estimatedTime} minutes</span>
                  </div>
                )}
                {order.notes && (
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">Notes:</span> {order.notes}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <Button className="w-full" variant="outline">
            Request Bill
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
