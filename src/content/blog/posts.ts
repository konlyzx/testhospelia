export type BlogPost = {
  slug: string
  title: string
  category: string
  date: string
  excerpt: string
  cover: string
  coverAlt?: string
  tags?: string[]
  featured?: boolean
  content: string
}

export const posts: BlogPost[] = [
  {
    slug: 'alojamientos-en-cali-guia-completa',
    title: 'Alojamientos en Cali: Guía completa 2025',
    category: 'guia',
    date: '2025-01-05',
    excerpt: 'Dónde hospedarte en Cali: zonas, precios, consejos y mejores prácticas.',
    cover: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1920&h=1080&fit=crop',
    coverAlt: 'Apartamento amoblado luminoso en Cali',
    tags: ['alojamientos', 'cali', 'guia'],
    featured: true,
    content: 'Explora las mejores zonas para alojarte en Cali, desde el sur con Bochalema y Ciudad Jardín, hasta áreas cercanas a Univalle. Considera servicios, acceso y seguridad.'
  },
  {
    slug: 'mejores-zonas-para-alojarte-en-cali',
    title: 'Las mejores zonas para alojarte en Cali',
    category: 'zonas',
    date: '2025-01-10',
    excerpt: 'Sur de Cali, Bochalema y alrededores: ventajas y puntos de interés.',
    cover: 'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=1920&h=1080&fit=crop',
    coverAlt: 'Sala moderna en zona sur de Cali',
    tags: ['zonas', 'bochalema', 'cali'],
    featured: true,
    content: 'El sur de Cali ofrece servicios, centros comerciales y conectividad. Bochalema es ideal por su tranquilidad y cercanía a universidades.'
  },
  {
    slug: 'apartamentos-por-dias-en-cali',
    title: 'Apartamentos por días en Cali: qué debes saber',
    category: 'consejos',
    date: '2025-01-15',
    excerpt: 'Recomendaciones para estancias cortas: reservas seguras y amenities.',
    cover: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1920&h=1080&fit=crop',
    coverAlt: 'Sala con televisión y plantas en apartamento temporal',
    tags: ['por dias', 'amenities', 'reservas'],
    featured: false,
    content: 'Para estadías cortas, prioriza apartamentos con servicios incluidos, wifi estable y buena ubicación para moverte fácilmente.'
  }
]

export const categories = ['guia', 'zonas', 'consejos']
