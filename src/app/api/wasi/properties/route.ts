import { NextRequest, NextResponse } from 'next/server';
import { wasiService } from '@/services/wasi';

// Configuración para exportación estática
export const dynamic = 'force-static';
export const revalidate = false;

export async function GET(request: NextRequest) {
  try {
    
    const searchParams = request.nextUrl.searchParams;
    
    // Extraer parámetros de la URL
    const filters: any = {};
    
    // Parámetros básicos
    if (searchParams.get('search')) filters.match = searchParams.get('search');
    if (searchParams.get('city')) filters.id_city = parseInt(searchParams.get('city')!);
    if (searchParams.get('region')) filters.id_region = parseInt(searchParams.get('region')!);
    if (searchParams.get('zone')) filters.id_zone = searchParams.get('zone');
    
    // Tipo de negocio
    if (searchParams.get('for_sale')) filters.for_sale = searchParams.get('for_sale') === 'true';
    if (searchParams.get('for_rent')) filters.for_rent = searchParams.get('for_rent') === 'true';
    if (searchParams.get('for_transfer')) filters.for_transfer = searchParams.get('for_transfer') === 'true';
    
    // Características
    if (searchParams.get('min_bedrooms')) filters.min_bedrooms = parseInt(searchParams.get('min_bedrooms')!);
    if (searchParams.get('max_bedrooms')) filters.max_bedrooms = parseInt(searchParams.get('max_bedrooms')!);
    if (searchParams.get('bathrooms')) filters.bathrooms = parseInt(searchParams.get('bathrooms')!);
    if (searchParams.get('garages')) filters.garages = parseInt(searchParams.get('garages')!);
    
    // Precios
    if (searchParams.get('min_price')) filters.min_price = parseInt(searchParams.get('min_price')!);
    if (searchParams.get('max_price')) filters.max_price = parseInt(searchParams.get('max_price')!);
    
    // Estados y disponibilidad
    if (searchParams.get('availability')) filters.id_availability = parseInt(searchParams.get('availability')!);
    if (searchParams.get('scope')) filters.scope = parseInt(searchParams.get('scope')!);
    
    // Paginación
    if (searchParams.get('skip')) filters.skip = parseInt(searchParams.get('skip')!);
    if (searchParams.get('take')) filters.take = parseInt(searchParams.get('take')!);
    if (searchParams.get('order')) filters.order = searchParams.get('order');
    if (searchParams.get('order_by')) filters.order_by = searchParams.get('order_by');
    
    console.log('🔍 Filtros que se van a usar (GET):', filters);
    const properties = await wasiService.searchProperties(filters);
    console.log('✅ Resultado de búsqueda (GET):', properties);
    
    return NextResponse.json({
      success: true,
      data: properties,
      total: properties?.total ?? 0
    });
    
  } catch (error) {
    console.error('❌ Error en API de propiedades:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al obtener propiedades',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

// Nuevo endpoint POST para búsqueda avanzada
export async function POST(request: NextRequest) {
  try {
    
    const body = await request.json();
    const { slug, id, search, ...filters } = body;

    // Si se proporciona un slug, buscar por slug
    if (slug) {
      const property = await wasiService.searchPropertyBySlug(slug);
      
      if (property) {
        return NextResponse.json({
          success: true,
          data: { [property.id_property]: property, total: 1, status: 'success' },
          total: 1
        });
      } else {
        return NextResponse.json({
          success: false,
          error: 'Propiedad no encontrada',
          data: { total: 0, status: 'not_found' },
          total: 0
        });
      }
    }

    // Si se proporciona un ID, buscar por ID
    if (id) {
      const property = await wasiService.getPropertyById(parseInt(id));
      
      if (property) {
        return NextResponse.json({
          success: true,
          data: { [property.id_property]: property, total: 1, status: 'success' },
          total: 1
        });
      } else {
        return NextResponse.json({
          success: false,
          error: 'Propiedad no encontrada',
          data: { total: 0, status: 'not_found' },
          total: 0
        });
      }
    }

    // Búsqueda general con filtros
    console.log('🔍 Filtros que se van a usar (POST):', { ...filters, id_availability: 1, scope: 3, take: filters.take || 10 });
    const properties = await wasiService.searchProperties({
      ...filters,
      id_availability: 1,
      scope: 3,
      take: filters.take || 10
    });
    console.log('✅ Resultado de búsqueda (POST):', properties);

    return NextResponse.json({
      success: true,
      data: properties,
      total: properties?.total ?? 0
    });
    
  } catch (error) {
    console.error('❌ Error en búsqueda avanzada de propiedades:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error en búsqueda de propiedades',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
