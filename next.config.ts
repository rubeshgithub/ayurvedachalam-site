import type { NextConfig } from "next";

// architecture.md §10: allow only self, the scheduler embed, GA4 and the map embed.
// BOOKING_EMBED_URL and MAPS origins are read from the environment at build time.
const bookingOrigin = (() => { try { return process.env.BOOKING_EMBED_URL ? new URL(process.env.BOOKING_EMBED_URL).origin : ""; } catch { return ""; } })();
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob: https://www.google-analytics.com https://*.googleusercontent.com https://maps.gstatic.com https://maps.googleapis.com`,
  `font-src 'self' data:`,
  `connect-src 'self' https://www.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com`,
  `frame-src 'self' https://www.google.com https://maps.google.com ${bookingOrigin}`.trim(),
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  // Classic rendering model: server-rendered pages with ISR (architecture.md §1, §2).
  cacheComponents: false,
  trailingSlash: true,
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
  turbopack: {
    rules: { "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" } },
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
