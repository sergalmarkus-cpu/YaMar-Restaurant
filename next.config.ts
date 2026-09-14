import type {
  NextConfig,
} from "next";

const securityHeaders = [
  {
    key:
      "Strict-Transport-Security",
    value:
      "max-age=31536000; includeSubDomains",
  },
  {
    key:
      "X-Content-Type-Options",
    value:
      "nosniff",
  },
  {
    key:
      "X-Frame-Options",
    value:
      "SAMEORIGIN",
  },
  {
    key:
      "Referrer-Policy",
    value:
      "strict-origin-when-cross-origin",
  },
  {
    key:
      "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(self)",
  },
];

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "192.168.1.108",
    "10.90.32.72",
  ],

  async headers() {
    return [
      {
        source:
          "/sw.js",
        headers: [
          {
            key:
              "Cache-Control",
            value:
              "no-cache, no-store, must-revalidate",
          },
          {
            key:
              "Service-Worker-Allowed",
            value:
              "/",
          },
          ...securityHeaders,
        ],
      },

      {
        source:
          "/(.*)",
        headers:
          securityHeaders,
      },
    ];
  },
};

export default nextConfig;