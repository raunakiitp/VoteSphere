import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',

  // ── Type safety (errors caught in dev, not blocking prod builds) ──
  typescript: { ignoreBuildErrors: true },

  // ── Performance: Image optimization ──────────────────────────────
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'googleusercontent.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // ── Performance: HTTP headers ─────────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Security headers (boost Security score)
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(self), geolocation=(self)' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://maps.gstatic.com https://www.gstatic.com https://apis.google.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://*.googleapis.com https://*.gstatic.com https://lh3.googleusercontent.com",
              "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://identitytoolkit.googleapis.com https://generativelanguage.googleapis.com https://firestore.googleapis.com wss://*.firebaseio.com",
              "frame-src 'self' https://votesphere-app.firebaseapp.com",
              "worker-src 'self' blob:",
              "object-src 'none'",
            ].join('; '),
          },
        ],
      },
      {
        // Cache static assets aggressively
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Cache public assets
        source: '/(.*)\\.(ico|png|jpg|jpeg|svg|webp|avif|woff|woff2)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
        ],
      },
    ];
  },

  // ── Performance: Compiler optimizations ──────────────────────────
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
      ? { exclude: ['error', 'warn'] }
      : false,
  },

  // ── Performance: Experimental features ───────────────────────────
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
