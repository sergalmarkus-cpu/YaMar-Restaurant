import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permitir acceso desde tu red local
  allowedDevOrigins: [
    '192.168.1.108',  // Tu IP local
    '10.90.32.72',    // La otra IP que aparecía antes
  ],
};

export default nextConfig;