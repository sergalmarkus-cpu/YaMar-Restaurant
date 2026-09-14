import type {
  Metadata,
  Viewport,
} from "next";
import type {
  ReactNode,
} from "react";

import {
  Geist,
} from "next/font/google";

import "./globals.css";

import PwaServiceWorkerRegister from "@/components/pwa/PwaServiceWorkerRegister";
import {
  Toaster,
} from "@/components/ui/sonner";
import {
  cn,
} from "@/lib/utils";

const geist = Geist({
  subsets: [
    "latin",
  ],
  variable:
    "--font-sans",
});

export const metadata: Metadata = {
  applicationName:
    "YaMar",

  title: {
    default:
      "YaMar",
    template:
      "%s | YaMar",
  },

  description:
    "Sistema Integral de Gestión para Restaurantes y Hoteles",

  manifest:
    "/manifest.webmanifest",

  appleWebApp: {
    capable:
      true,
    statusBarStyle:
      "default",
    title:
      "YaMar",
  },

  icons: {
    icon: [
      {
        url:
          "/icons/yamar-192.png",
        sizes:
          "192x192",
        type:
          "image/png",
      },
      {
        url:
          "/icons/yamar-512.png",
        sizes:
          "512x512",
        type:
          "image/png",
      },
    ],

    apple: [
      {
        url:
          "/icons/yamar-apple-touch-icon.png",
        sizes:
          "180x180",
        type:
          "image/png",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor:
    "#4f46e5",
  colorScheme:
    "light",
};

export default function RootLayout({
  children,
}: {
  children:
    ReactNode;
}) {
  return (
    <html
      lang="es"
      className={cn(
        "font-sans",
        geist.variable
      )}
    >
      <body className="min-h-screen bg-slate-100 text-slate-900 antialiased">
        {children}

        <PwaServiceWorkerRegister />

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