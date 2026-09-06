import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { randomBytes } from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* ==========================================================
   FORMATO
========================================================== */

export function formatCurrency(
  value: number | string,
  locale = "es-ES",
  currency = "EUR"
) {
  const amount =
    typeof value === "string"
      ? parseFloat(value)
      : value;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}

/* ==========================================================
   VALIDACIONES
========================================================== */

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function sanitizeInput(text: string) {
  return text
    .trim()
    .replace(/[<>]/g, "");
}

/* ==========================================================
   QR
========================================================== */

export function generateQRToken(length = 32) {
  return randomBytes(length)
    .toString("hex");
}

/* ==========================================================
   PEDIDOS
========================================================== */

export function generateOrderNumber() {
  const now = new Date();

  const date =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");

  const random =
    Math.floor(Math.random() * 9000) + 1000;

  return `ORD-${date}-${random}`;
}

/* ==========================================================
   GEOLOCALIZACIÓN
========================================================== */

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function distanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371000;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return (
    2 *
    R *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    )
  );
}

export function isWithinGeofence(
  lat: number,
  lon: number,
  centerLat: number,
  centerLon: number,
  radiusMeters: number
) {
  return (
    distanceMeters(
      lat,
      lon,
      centerLat,
      centerLon
    ) <= radiusMeters
  );
}

export function findNearestPOS<
  T extends {
    latitude: number;
    longitude: number;
  }
>(
  latitude: number,
  longitude: number,
  locations: T[]
) {
  if (!locations.length)
    return null;

  return locations.reduce(
    (nearest, current) => {
      const currentDistance =
        distanceMeters(
          latitude,
          longitude,
          current.latitude,
          current.longitude
        );

      const nearestDistance =
        distanceMeters(
          latitude,
          longitude,
          nearest.latitude,
          nearest.longitude
        );

      return currentDistance <
        nearestDistance
        ? current
        : nearest;
    }
  );
}

/* ==========================================================
   HORARIOS
========================================================== */

export function getTimeUntilOpening(
  openingTime: string
) {
  const now = new Date();

  const [hour, minute] =
    openingTime
      .split(":")
      .map(Number);

  const opening = new Date();

  opening.setHours(hour);
  opening.setMinutes(minute);
  opening.setSeconds(0);

  const diff =
    opening.getTime() -
    now.getTime();

  if (diff <= 0)
    return "Abierto";

  const hours = Math.floor(
    diff / 3600000
  );

  const minutes = Math.floor(
    (diff % 3600000) / 60000
  );

  return `${hours}h ${minutes}m`;
}