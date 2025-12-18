import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Experimental features para mejor rendimiento
  experimental: {
    // Optimización de bundles
    optimizePackageImports: ['@heroicons/react'],
  },
  
  // Optimización de imágenes
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wp.hospelia.co',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: '**.wasi.co',  // Para imágenes de WASI
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      }
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 días
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

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Compresión
  compress: true,
  
  // Output estático donde sea posible
  output: 'standalone',
  
  // Reducir el bundle size
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Optimización de bundle en producción
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 20,
            chunks: 'all',
          },
        },
      };
    }
    return config;
  },

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
