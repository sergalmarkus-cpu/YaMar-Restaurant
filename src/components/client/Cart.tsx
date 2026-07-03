"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { TranslatedText } from "@/types";

export function Cart() {
  const {
    cart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    session,
    establishment,
    language,
    addOrder,
  } = useStore();
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState("");

  const getTranslation = (text: TranslatedText | undefined): string => {
    if (!text) return "";
    return text[language] || text.es || Object.values(text)[0] || "";
  };

  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;

    setLoading(true);
    try {
      // Get user location if needed
      let latitude: number | undefined;
      let longitude: number | undefined;

      if (establishment?.geoFenceEnabled) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;
        } catch (err) {
          console.error("Location error:", err);
        }
      }

      // Prepare order items
      const items = cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        modifiers: item.selectedModifiers,
        notes: item.notes,
      }));

      // Create order
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session?.id,
          items,
          notes,
          latitude: latitude?.toString(),
          longitude: longitude?.toString(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || "Failed to place order");
        setLoading(false);
        return;
      }

      const order = await response.json();
      addOrder(order);
      clearCart();
      setNotes("");
      alert("Order placed successfully!");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
        <p className="text-gray-600">Add items from the menu to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Cart</h2>
        <Button variant="ghost" onClick={clearCart}>
          Clear All
        </Button>
      </div>

      <div className="space-y-4">
        {cart.map((item, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                {item.product.image && (
                  <img
                    src={item.product.image}
                    alt={getTranslation(item.product.name)}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h4 className="font-semibold">
                    {getTranslation(item.product.name)}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {formatCurrency(item.product.price, establishment?.currency)}
                  </p>
                  {item.selectedModifiers.length > 0 && (
                    <div className="mt-1">
                      {item.selectedModifiers.map((mod, i) => (
                        <p key={i} className="text-xs text-gray-500">
                          + {getTranslation(mod.name)} (+
                          {formatCurrency(mod.price, establishment?.currency)})
                        </p>
                      ))}
                    </div>
                  )}
                  {item.notes && (
                    <p className="text-xs text-gray-500 mt-1">
                      Note: {item.notes}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        updateCartItemQuantity(
                          item.product.id,
                          item.quantity - 1
                        )
                      }
                    >
                      <Minus size={16} />
                    </Button>
                    <span className="w-12 text-center font-semibold">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        updateCartItemQuantity(
                          item.product.id,
                          item.quantity + 1
                        )
                      }
                    >
                      <Plus size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-auto text-red-600"
                      onClick={() => removeFromCart(item.product.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">
                    {formatCurrency(item.subtotal, establishment?.currency)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Notes</CardTitle>
          <CardDescription>
            Add any special instructions for your order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="e.g., No onions, extra sauce..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatCurrency(subtotal, establishment?.currency)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax (10%)</span>
              <span>{formatCurrency(tax, establishment?.currency)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{formatCurrency(total, establishment?.currency)}</span>
            </div>
          </div>
          <Button
            className="w-full mt-4"
            onClick={handlePlaceOrder}
            disabled={loading}
          >
            {loading ? "Placing Order..." : "Place Order"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
