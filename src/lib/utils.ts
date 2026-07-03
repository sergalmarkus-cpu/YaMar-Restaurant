import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Calculate distance between two coordinates (Haversine formula)
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

// Check if coordinates are within geofence
export function isWithinGeofence(
  userLat: number,
  userLon: number,
  centerLat: number,
  centerLon: number,
  radiusMeters: number
): boolean {
  const distance = calculateDistance(userLat, userLon, centerLat, centerLon);
  return distance <= radiusMeters;
}

// Generate unique order number
export function generateOrderNumber(): string {
  const date = new Date();
  const timestamp = date.getTime().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `ORD-${timestamp}-${random}`;
}

// Generate unique receipt number
export function generateReceiptNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const timestamp = date.getTime().toString().slice(-6);
  const random = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, "0");
  return `RCT-${year}${month}${day}-${timestamp}${random}`;
}

// Format currency
export function formatCurrency(amount: number | string, currency = "EUR"): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency,
  }).format(num);
}

// Format time
export function formatTime(time: string): string {
  return time;
}

// Check if menu is currently open
export function isMenuOpen(schedules: any[], currentTime = new Date()): boolean {
  const dayOfWeek = currentTime.getDay();
  const currentTimeStr = `${currentTime.getHours().toString().padStart(2, "0")}:${currentTime.getMinutes().toString().padStart(2, "0")}`;

  const todaySchedules = schedules.filter(
    (s) => s.dayOfWeek === dayOfWeek && s.active
  );

  for (const schedule of todaySchedules) {
    if (currentTimeStr >= schedule.openTime && currentTimeStr <= schedule.closeTime) {
      return true;
    }
  }

  return false;
}

// Get next opening time
export function getNextOpeningTime(schedules: any[], currentTime = new Date()): Date | null {
  const dayOfWeek = currentTime.getDay();
  const currentTimeStr = `${currentTime.getHours().toString().padStart(2, "0")}:${currentTime.getMinutes().toString().padStart(2, "0")}`;

  // Check today's schedules
  const todaySchedules = schedules
    .filter((s) => s.dayOfWeek === dayOfWeek && s.active)
    .sort((a, b) => a.openTime.localeCompare(b.openTime));

  for (const schedule of todaySchedules) {
    if (currentTimeStr < schedule.openTime) {
      const [hours, minutes] = schedule.openTime.split(":").map(Number);
      const nextOpen = new Date(currentTime);
      nextOpen.setHours(hours, minutes, 0, 0);
      return nextOpen;
    }
  }

  // Check next days
  for (let i = 1; i <= 7; i++) {
    const nextDay = (dayOfWeek + i) % 7;
    const nextDaySchedules = schedules
      .filter((s) => s.dayOfWeek === nextDay && s.active)
      .sort((a, b) => a.openTime.localeCompare(b.openTime));

    if (nextDaySchedules.length > 0) {
      const [hours, minutes] = nextDaySchedules[0].openTime.split(":").map(Number);
      const nextOpen = new Date(currentTime);
      nextOpen.setDate(nextOpen.getDate() + i);
      nextOpen.setHours(hours, minutes, 0, 0);
      return nextOpen;
    }
  }

  return null;
}

// Time until opening
export function getTimeUntilOpening(nextOpenTime: Date): string {
  const now = new Date();
  const diff = nextOpenTime.getTime() - now.getTime();

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }

  return `${hours}h ${minutes}m`;
}

// Validate email
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Sanitize input
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, "");
}

// Generate QR token
export function generateQRToken(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

// Find nearest point of sale
export function findNearestPOS(
  userLat: number,
  userLon: number,
  pointsOfSale: any[]
): any[] {
  return pointsOfSale
    .map((pos) => ({
      ...pos,
      distance: calculateDistance(
        userLat,
        userLon,
        parseFloat(pos.latitude),
        parseFloat(pos.longitude)
      ),
    }))
    .filter((pos) => pos.distance <= pos.radius)
    .sort((a, b) => a.distance - b.distance);
}
