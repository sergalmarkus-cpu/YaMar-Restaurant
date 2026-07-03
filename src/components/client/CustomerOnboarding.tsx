"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { isValidEmail, sanitizeInput } from "@/lib/utils";

interface Props {
  qrCode: string;
}

export function CustomerOnboarding({ qrCode }: Props) {
  const { setSession, setEstablishment, language, setLanguage } = useStore();
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    roomNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [locationPermission, setLocationPermission] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate name
      if (!formData.customerName.trim()) {
        setError("Name is required");
        setLoading(false);
        return;
      }

      // Validate email if provided
      if (formData.customerEmail && !isValidEmail(formData.customerEmail)) {
        setError("Invalid email address");
        setLoading(false);
        return;
      }

      // Get location if permission granted
      let latitude: number | undefined;
      let longitude: number | undefined;

      if (locationPermission) {
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

      // Get device ID
      const deviceId = localStorage.getItem("deviceId") || generateDeviceId();
      localStorage.setItem("deviceId", deviceId);

      // Create session
      const response = await fetch("/api/session/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          qrCode,
          customerName: sanitizeInput(formData.customerName),
          customerEmail: formData.customerEmail ? sanitizeInput(formData.customerEmail) : undefined,
          customerPhone: formData.customerPhone ? sanitizeInput(formData.customerPhone) : undefined,
          roomNumber: formData.roomNumber ? sanitizeInput(formData.roomNumber) : undefined,
          latitude: latitude?.toString(),
          longitude: longitude?.toString(),
          deviceId,
          language,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to create session");
        setLoading(false);
        return;
      }

      const session = await response.json();
      setSession(session);

      // Fetch establishment
      const estResponse = await fetch(`/api/establishment/${qrCode}`);
      if (estResponse.ok) {
        const est = await estResponse.json();
        setEstablishment(est);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error creating session:", err);
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  const generateDeviceId = () => {
    return `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const requestLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => setLocationPermission(true),
        () => setLocationPermission(false)
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome!</CardTitle>
          <CardDescription>
            Please provide your details to start ordering
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Language Selector */}
            <div>
              <label className="block text-sm font-medium mb-2">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="w-full h-10 rounded-lg border border-gray-300 px-3"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="de">Deutsch</option>
                <option value="fr">Français</option>
                <option value="it">Italiano</option>
                <option value="pt">Português</option>
              </select>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Name *
              </label>
              <Input
                type="text"
                value={formData.customerName}
                onChange={(e) =>
                  setFormData({ ...formData, customerName: e.target.value })
                }
                placeholder="John Doe"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Email (optional)
              </label>
              <Input
                type="email"
                value={formData.customerEmail}
                onChange={(e) =>
                  setFormData({ ...formData, customerEmail: e.target.value })
                }
                placeholder="john@example.com"
              />
              <p className="text-xs text-gray-500 mt-1">
                For receiving digital receipts
              </p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Phone (optional)
              </label>
              <Input
                type="tel"
                value={formData.customerPhone}
                onChange={(e) =>
                  setFormData({ ...formData, customerPhone: e.target.value })
                }
                placeholder="+34 600 000 000"
              />
            </div>

            {/* Room Number */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Room Number (optional)
              </label>
              <Input
                type="text"
                value={formData.roomNumber}
                onChange={(e) =>
                  setFormData({ ...formData, roomNumber: e.target.value })
                }
                placeholder="A12"
              />
            </div>

            {/* Location Permission */}
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <input
                type="checkbox"
                id="location"
                checked={locationPermission}
                onChange={(e) => {
                  if (e.target.checked) {
                    requestLocation();
                  } else {
                    setLocationPermission(false);
                  }
                }}
                className="w-4 h-4"
              />
              <label htmlFor="location" className="text-sm text-gray-700">
                Enable location for faster service delivery
              </label>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Loading..." : "Start Ordering"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
