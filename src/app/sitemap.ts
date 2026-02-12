import { MetadataRoute } from 'next'
import { posts } from '@/content/blog/posts'
import { wasiService } from '@/services/wasi'

// Configuración para exportación estática
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://hospelia.co'

  // URLs estáticas principales
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/alojamientos`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/propiedades`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sobre-nosotros`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/hazte-anfitrion`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ayuda`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/centro-ayuda`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/destinos`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/accesibilidad`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/apartamentos-amoblados-en-cali`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/alquiler-temporal-en-cali`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/apartamentos-en-bochalema`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/apartamentos-en-el-sur-de-cali`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/apartamentos-por-dias-en-cali`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/airbnb-en-cali`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/alojamiento-amoblado-en-cali`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/apartamentos-cerca-de-univalle`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/alquiler-apartamentos-turisticos-cali`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/apartamentos-amoblados-economicos-cali`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]

  const blogRoutes: MetadataRoute.Sitemap = posts.map(p => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const extra: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/gracias`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    }
  ]

  // Generar rutas dinámicas para propiedades
  let propertyRoutes: MetadataRoute.Sitemap = []

  try {
    const builds: Array<Promise<any>> = [
      wasiService.searchProperties({ scope: 3, id_availability: 1, take: 100, order: 'desc', order_by: 'created_at' } as any),
      wasiService.searchProperties({ scope: 3, id_availability: 1, take: 100, order: 'desc', order_by: 'visits' } as any),
    ]

    const results = await Promise.all(builds)
    const seen = new Set<string>()

    results.forEach((res) => {
      const keys = Object.keys(res).filter(k => !isNaN(parseInt(k)))
      keys.forEach(k => {
        const p: any = res[k]
        const title = (p?.title || '').toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
        const slug = `${title}-${p?.id_property}`

        if (!seen.has(slug)) {
          seen.add(slug)
          const updatedAt = p.updated_at ? new Date(p.updated_at) : new Date()

          propertyRoutes.push({
            url: `${baseUrl}/propiedad/${slug}`,
            lastModified: updatedAt,
            changeFrequency: 'weekly',
            priority: 0.8,
          })
        }
      })
    })
  } catch (error) {
    console.error('Error generating property sitemap:', error)
  }

  return [...staticRoutes, ...blogRoutes, ...extra, ...propertyRoutes]
}
