import { wasiService } from '@/services/wasi';
import { notFound } from 'next/navigation';
import PropertyView from './PropertyView'; 
import type { Metadata } from 'next';
export const dynamic = 'force-static'
export const dynamicParams = false

async function getPropertyData(slug: string) {
  // const wasiService = new WasiService(); // Ya no es necesario, importamos la instancia
  const slugParts = slug?.split('-');
  const propertyId = slugParts?.[slugParts.length - 1];

  if (!propertyId || isNaN(Number(propertyId))) {
    return null;
  }

  try {
    const property = await wasiService.getPropertyById(Number(propertyId));
    return property;
  } catch (error) {
    console.error(`Failed to fetch property for slug: ${slug}`, error);
    return null;
  }
}

export default async function PropertyDetailPage({ params }: { params: { slug: string } }) {
  const property = await getPropertyData(params.slug);

  if (!property) {
    notFound();
  }

  return <PropertyView property={property} />;
}

export async function generateStaticParams() {
  const builds: Array<Promise<any>> = [
    wasiService.searchProperties({ scope: 3, id_availability: 1, take: 200, order: 'desc', order_by: 'created_at' } as any),
    wasiService.searchProperties({ scope: 3, id_availability: 1, take: 200, order: 'desc', order_by: 'visits' } as any),
  ]
  const params: { slug: string }[] = []
  try {
    const results = await Promise.all(builds)
    results.forEach((res) => {
      const keys = Object.keys(res).filter(k => !isNaN(parseInt(k)))
      keys.forEach(k => {
        const p: any = res[k]
        const title = (p?.title || '').toLowerCase().replace(/[^\w\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-').trim()
        const slug = `${title}-${p?.id_property}`
        params.push({ slug })
      })
    })
    // Uniques
    const seen = new Set<string>()
    return params.filter(p => { if (seen.has(p.slug)) return false; seen.add(p.slug); return true })
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const slug = params.slug;
  const slugParts = slug?.split('-');
  const propertyId = slugParts?.[slugParts.length - 1];
  const canonical = `https://hospelia.co/propiedad/${slug}`;

  if (!propertyId || isNaN(Number(propertyId))) {
    return {
      title: 'Propiedad | Hospelia',
      description: 'Detalle de propiedad en Hospelia',
      alternates: { canonical },
    };
  }

  const property = await wasiService.getPropertyById(Number(propertyId));
  const title = property?.title || 'Propiedad en Hospelia';
  const description = property?.observations || property?.description || `Propiedad ${propertyId} disponible en ${property?.city_label || 'Colombia'}`;
  const ogImage = property?.main_image?.url || '/zona-default.jpg';

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type: 'article',
      url: canonical,
      images: ogImage ? [ogImage] : undefined,
      locale: 'es_CO'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    robots: { index: true, follow: true }
  };
}
