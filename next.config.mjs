/** @type {import('next').NextConfig} */
const nextConfig = {
  // Experimental features para mejor rendimiento
  experimental: {
    // Optimización de bundles
    optimizePackageImports: ['@heroicons/react'],
  },

  // Optimización de imágenes
  images: {
    // Bypass Next image optimizer host validation for external dynamic sources (e.g. Wasi)
    unoptimized: true,
    // Keep broad remotePatterns for Wasi/CDN plus legacy domain allow-list for safety in Turbopack
    domains: ['image.wasi.co', 'images.wasi.co', 'hospelia.co', 'wp.hospelia.co', 'firebasestorage.googleapis.com', 'images.unsplash.com', 'lh3.googleusercontent.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hospelia.co',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'wp.hospelia.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'image.wasi.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.wasi.co',
        pathname: '/**',
      }
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    dangerouslyAllowSVG: false,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },

  // Headers para optimización de cache y Content Security Policy
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300'
          }
        ]
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },

    ]
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  // Compresión
  compress: true,

  // Configuración de redirects para SEO
  async redirects() {
    return [
      {
        source: '/propiedades-wasi',
        destination: '/propiedades',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
