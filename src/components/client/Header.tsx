"use client";

import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function Header() {
  const { session, establishment, isMenuOpen, setIsMenuOpen } = useStore();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">{establishment?.name || "Restaurant"}</h1>
            <p className="text-sm text-gray-500">
              Table: {session?.table?.code || "N/A"}
            </p>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
    </header>
  );
}
