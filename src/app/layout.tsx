import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

import { Geist } from "next/font/google";

import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "YaMar Admin",
  description: "Sistema Integral de Gestión para Restaurantes y Hoteles",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="es"
      className={cn("font-sans", geist.variable)}
    >
      <body className="min-h-screen bg-slate-100 text-slate-900 antialiased">

        {children}

        <Toaster
          position="top-right"
          richColors
          closeButton
          expand={true}
          duration={3500}
        />

      </body>
    </html>
  );
}