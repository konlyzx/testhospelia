import { wasiService } from '@/services/wasi';
import { notFound } from 'next/navigation';
import PropertyView from './PropertyView'; 

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