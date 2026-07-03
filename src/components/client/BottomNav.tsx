"use client";

import { useStore } from "@/store/useStore";
import { Home, ShoppingCart, History } from "lucide-react";

interface Props {
  activeTab: "menu" | "orders" | "cart";
  onTabChange: (tab: "menu" | "orders" | "cart") => void;
}

export function BottomNav({ activeTab, onTabChange }: Props) {
  const { cart } = useStore();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-3 gap-2 py-2">
          <button
            onClick={() => onTabChange("menu")}
            className={`flex flex-col items-center py-2 rounded-lg transition-colors ${
              activeTab === "menu"
                ? "bg-black text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Home size={20} />
            <span className="text-xs mt-1">Menu</span>
          </button>

          <button
            onClick={() => onTabChange("orders")}
            className={`flex flex-col items-center py-2 rounded-lg transition-colors ${
              activeTab === "orders"
                ? "bg-black text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <History size={20} />
            <span className="text-xs mt-1">Orders</span>
          </button>

          <button
            onClick={() => onTabChange("cart")}
            className={`flex flex-col items-center py-2 rounded-lg transition-colors relative ${
              activeTab === "cart"
                ? "bg-black text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <ShoppingCart size={20} />
            <span className="text-xs mt-1">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 right-1/4 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
