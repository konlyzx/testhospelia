import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Hospelia',
    short_name: 'Hospelia',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0ea5e9',
    lang: 'es-CO',
    icons: [
      {
        src: '/img/logo-hospelia.webp',
        sizes: '192x192',
        type: 'image/webp'
      },
      {
        src: '/img/logo-hospelia.webp',
        sizes: '512x512',
        type: 'image/webp'
      }
    ]
  }
}

