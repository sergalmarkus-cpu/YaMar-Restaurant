"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useStore } from "@/store/useStore";
import { CustomerOnboarding } from "@/components/client/CustomerOnboarding";
import { MenuList } from "@/components/client/MenuList";
import { Cart } from "@/components/client/Cart";
import { OrderHistory } from "@/components/client/OrderHistory";
import { Header } from "@/components/client/Header";
import { BottomNav } from "@/components/client/BottomNav";

export default function ClientPage() {
  const params = useParams();
  const qrCode = params?.qrCode as string;
  const { session, setSession, establishment, setEstablishment } = useStore();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"menu" | "orders" | "cart">("menu");

  useEffect(() => {
    // Check if session exists for this QR code
    const checkSession = async () => {
      try {
        // Get device ID
        const deviceId = localStorage.getItem("deviceId") || generateDeviceId();
        localStorage.setItem("deviceId", deviceId);

        // Check if we have a session in storage
        if (session && session.active) {
          // Fetch establishment data
          const res = await fetch(`/api/establishment/${qrCode}`);
          if (res.ok) {
            const est = await res.json();
            setEstablishment(est);
          }
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setLoading(false);
      }
    };

    checkSession();
  }, [qrCode]);

  const generateDeviceId = () => {
    return `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session || !session.active) {
    return <CustomerOnboarding qrCode={qrCode} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {activeTab === "menu" && <MenuList />}
        {activeTab === "orders" && <OrderHistory />}
        {activeTab === "cart" && <Cart />}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
