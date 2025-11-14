import { NextRequest, NextResponse } from 'next/server';
import { getAllProperties } from '@/services/properties';

// Configuración para exportación estática
export const dynamic = 'force-static';
export const revalidate = false;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Obtener parámetros de filtrado
    const zone = searchParams.get('zone');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const bedrooms = searchParams.get('bedrooms');
    const search = searchParams.get('search');

    // Cache headers para optimización
    const cacheHeaders = {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      'CDN-Cache-Control': 'public, max-age=300',
      'Vercel-CDN-Cache-Control': 'public, max-age=300',
    };

    // Obtener todas las propiedades (esto se cachea automáticamente)
    let properties = await getAllProperties();

    // Aplicar filtros en servidor si se especifican
    if (zone || minPrice || maxPrice || bedrooms || search) {
      properties = properties.filter(property => {
        // Filtro por zona
        if (zone && property.acf?.zone_label && 
            property.acf.zone_label.toLowerCase() !== zone.toLowerCase()) {
          return false;
        }

        // Filtro por precio
        if (minPrice || maxPrice) {
          const price = property.acf?.price || property.acf?.sale_price || property.acf?.rent_price || 0;
          if (minPrice && price < parseInt(minPrice)) return false;
          if (maxPrice && price > parseInt(maxPrice)) return false;
        }

        // Filtro por habitaciones
        if (bedrooms) {
          const propertyBedrooms = property.acf?.bedrooms || 0;
          if (propertyBedrooms < parseInt(bedrooms)) return false;
        }

        // Filtro por búsqueda de texto
        if (search) {
          const searchTerm = search.toLowerCase().trim();
          const title = property.title.rendered.toLowerCase();
          const description = property.excerpt.rendered.toLowerCase();
          const location = (property.acf?.location || '').toLowerCase();
          
          if (!title.includes(searchTerm) && 
              !description.includes(searchTerm) && 
              !location.includes(searchTerm)) {
            return false;
          }
        }

        return true;
      });
    }

    return NextResponse.json(
      {
        properties,
        count: properties.length,
        cached: true,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: cacheHeaders,
      }
    );

  } catch (error) {
    console.error('Error in properties API:', error);
    
    return NextResponse.json(
      { 
        error: 'Error al obtener propiedades',
        properties: [],
        count: 0,
      },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        }
      }
    );
  }
}