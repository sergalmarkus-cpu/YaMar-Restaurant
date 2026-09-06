"use client";

import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function Header() {
  const {
    session,
    establishment,
    isMenuOpen,
    setIsMenuOpen,
  } = useStore();

  const tableLabel =
    session?.table?.code ??
    (session?.tableId
      ? String(session.tableId)
      : "N/A");

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">
              {establishment?.name || "Restaurant"}
            </h1>

            <p className="text-sm text-gray-500">
              Mesa: {tableLabel}
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setIsMenuOpen(!isMenuOpen)
            }
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
    </header>
  );
}