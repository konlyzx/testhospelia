import { WasiProperty, WasiPropertiesResponse } from '@/services/wasi';

// Interfaces adaptadas para la aplicación Hospelia
export interface Property {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  slug: string;
  date: string;
  featured_media: number;
  acf: {
    price?: number;
    bedrooms?: number;
    bathrooms?: number;
    rooms?: number;
    garage?: number;
    size?: string;
    location?: string;
    gallery?: Array<{
      id: number;
      url: string;
      alt: string;
    }>;
    [key: string]: any;
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      id: number;
      source_url: string;
      alt_text: string;
    }>;
  };
  meta?: {
    [key: string]: any;
  };
  property_meta?: {
    [key: string]: any;
  };
  wasi_data?: WasiProperty; // Datos originales de Wasi
}

export interface Zone {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
  link: string;
  parent: number;
  databaseId: number;
}

export interface Review {
  id: number;
  author_name: string;
  author_email: string;
  author_url: string;
  author_avatar_urls: {
    [size: string]: string;
  };
  date: string;
  content: {
    rendered: string;
  };
  rating: number;
  property_id: number;
}

// Servicio para convertir propiedades de Wasi al formato de la aplicación
class PropertyService {
  /**
   * Convierte una propiedad de Wasi al formato esperado por la aplicación
   */
  private convertWasiToProperty(wasiProperty: WasiProperty): Property {
    // Generar slug desde el título
    const slug = wasiProperty.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Construir galería de imágenes
    const gallery = [];
    
    // Imagen principal
    if (wasiProperty.main_image?.url) {
      gallery.push({
        id: parseInt(wasiProperty.main_image.id) || 1,
        url: wasiProperty.main_image.url_original || wasiProperty.main_image.url,
        alt: wasiProperty.title
      });
    }
    
    // Imágenes adicionales de galerías
    if (wasiProperty.galleries && wasiProperty.galleries.length > 0) {
      wasiProperty.galleries.forEach((galleryGroup, groupIndex) => {
        Object.keys(galleryGroup).forEach((key) => {
          if (!isNaN(parseInt(key))) {
            const image = galleryGroup[key];
            if (typeof image === 'object' && 'url' in image) {
              gallery.push({
                id: parseInt(image.id) || (groupIndex * 100 + parseInt(key)),
                url: image.url_original || image.url,
                alt: wasiProperty.title
              });
            }
          }
        });
      });
    }

    // Construir contenido descriptivo
    const contentParts = [];
    if (wasiProperty.observations) {
      contentParts.push(wasiProperty.observations);
    }
    if (wasiProperty.comment) {
      contentParts.push(wasiProperty.comment);
    }
    
    // Agregar características
    if (wasiProperty.features) {
      const features = [];
      if (wasiProperty.features.internal) {
        features.push(`Características internas: ${wasiProperty.features.internal.map(f => f.nombre).join(', ')}`);
      }
      if (wasiProperty.features.external) {
        features.push(`Características externas: ${wasiProperty.features.external.map(f => f.nombre).join(', ')}`);
      }
      if (features.length > 0) {
        contentParts.push(features.join('\n'));
      }
    }

    const content = contentParts.join('\n\n');

    // Construir excerpt
    const excerpt = `${wasiProperty.bedrooms} hab, ${wasiProperty.bathrooms} baños, ${wasiProperty.area} ${wasiProperty.unit_area_label} en ${wasiProperty.city_label}, ${wasiProperty.region_label}`;

    return {
      id: wasiProperty.id_property,
      title: {
        rendered: wasiProperty.title
      },
      content: {
        rendered: content
      },
      excerpt: {
        rendered: excerpt
      },
      slug: slug,
      date: wasiProperty.created_at,
      featured_media: parseInt(wasiProperty.main_image?.id) || 0,
      acf: {
        price: parseInt(wasiProperty.sale_price || wasiProperty.rent_price || '0'),
        bedrooms: parseInt(wasiProperty.bedrooms || '0'),
        bathrooms: parseInt(wasiProperty.bathrooms || '0'),
        rooms: parseInt(wasiProperty.bedrooms || '0'),
        garage: parseInt(wasiProperty.garages || '0'),
        size: `${wasiProperty.area} ${wasiProperty.unit_area_label}`,
        location: `${wasiProperty.city_label}, ${wasiProperty.region_label}`,
        gallery: gallery,
        // Campos específicos de Wasi
        wasi_id: wasiProperty.id_property,
        address: wasiProperty.address,
        for_sale: wasiProperty.for_sale === 'true',
        for_rent: wasiProperty.for_rent === 'true',
        sale_price: parseInt(wasiProperty.sale_price || '0'),
        rent_price: parseInt(wasiProperty.rent_price || '0'),
        sale_price_label: wasiProperty.sale_price_label,
        rent_price_label: wasiProperty.rent_price_label,
        area: wasiProperty.area,
        built_area: wasiProperty.built_area,
        private_area: wasiProperty.private_area,
        latitude: wasiProperty.latitude,
        longitude: wasiProperty.longitude,
        property_type: wasiProperty.id_property_type,
        availability: wasiProperty.availability_label,
        condition: wasiProperty.property_condition_label,
        furnished: wasiProperty.furnished === 'true',
        maintenance_fee: parseInt(wasiProperty.maintenance_fee || '0'),
        building_date: wasiProperty.building_date,
        visits: wasiProperty.visits,
        video: wasiProperty.video,
        zone_label: wasiProperty.zone_label,
        currency: wasiProperty.iso_currency
      },
      _embedded: wasiProperty.main_image?.url ? {
        'wp:featuredmedia': [{
          id: parseInt(wasiProperty.main_image.id) || 1,
          source_url: wasiProperty.main_image.url_original || wasiProperty.main_image.url,
          alt_text: wasiProperty.title
        }]
      } : undefined,
      wasi_data: wasiProperty
    };
  }

  /**
   * Obtiene todas las propiedades desde nuestro API endpoint
   */
  async getAllProperties(): Promise<Property[]> {
    try {
      
      // Usar nuestro endpoint API en lugar de llamar directamente a Wasi
      const response = await fetch('/api/wasi/properties?take=100&order=desc&order_by=created_at', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error al obtener propiedades: ${response.status}`);
      }

      const apiResponse = await response.json();
      
      // Verificar si la respuesta tiene el formato esperado
      if (!apiResponse.success) {
        throw new Error(`Error en API: ${apiResponse.error || 'Error desconocido'}`);
      }

      // Extraer propiedades del objeto de respuesta
      const wasiResponse: WasiPropertiesResponse = apiResponse.data;
      const propertyKeys = Object.keys(wasiResponse).filter(key => !isNaN(parseInt(key)));
      const wasiProperties = propertyKeys.map(key => wasiResponse[key] as WasiProperty);

      // Convertir al formato de la aplicación
      const properties = wasiProperties.map(wp => this.convertWasiToProperty(wp));
      
      return properties;
    } catch (error) {
      console.error('❌ Error al obtener propiedades desde nuestro API:', error);
      throw error;
    }
  }

  /**
   * Obtiene una propiedad por slug
   */
  async getPropertyBySlug(slug: string): Promise<Property | null> {
    try {
      
      // Buscar por título que contenga el slug usando nuestro API
      const response = await fetch('/api/wasi/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filters: {
            match: slug.replace(/-/g, ' '),
            id_availability: 1,
            scope: 3,
            take: 10
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Error al buscar propiedad: ${response.status}`);
      }

      const apiResponse = await response.json();
      
      if (!apiResponse.success) {
        throw new Error(`Error en API: ${apiResponse.error || 'Error desconocido'}`);
      }

      const wasiResponse: WasiPropertiesResponse = apiResponse.data;
      const propertyKeys = Object.keys(wasiResponse).filter(key => !isNaN(parseInt(key)));
      const wasiProperties = propertyKeys.map(key => wasiResponse[key] as WasiProperty);

      // Buscar la propiedad que mejor coincida con el slug
      for (const wasiProperty of wasiProperties) {
        const propertySlug = wasiProperty.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
        
        if (propertySlug.includes(slug) || slug.includes(propertySlug)) {
          const property = this.convertWasiToProperty(wasiProperty);
          return property;
        }
      }

      return null;
    } catch (error) {
      console.error('❌ Error al buscar propiedad por slug:', error);
      throw error;
    }
  }

  /**
   * Obtiene una propiedad por ID
   */
  async getPropertyById(id: number): Promise<Property | null> {
    try {
      
      const response = await fetch('/api/wasi/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filters: {
            id_property: id,
            scope: 3,
            take: 1
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Error al buscar propiedad: ${response.status}`);
      }

      const apiResponse = await response.json();
      
      if (!apiResponse.success) {
        throw new Error(`Error en API: ${apiResponse.error || 'Error desconocido'}`);
      }

      const wasiResponse: WasiPropertiesResponse = apiResponse.data;
      const propertyKeys = Object.keys(wasiResponse).filter(key => !isNaN(parseInt(key)));
      
      if (propertyKeys.length > 0) {
        const wasiProperty = wasiResponse[propertyKeys[0]] as WasiProperty;
        const property = this.convertWasiToProperty(wasiProperty);
        return property;
      }

      return null;
    } catch (error) {
      console.error('❌ Error al buscar propiedad por ID:', error);
      throw error;
    }
  }

  /**
   * Obtiene propiedades por filtros
   */
  async getPropertiesByFilters(filters: {
    search?: string;
    for_sale?: boolean;
    for_rent?: boolean;
    min_price?: number;
    max_price?: number;
    bedrooms?: number;
    bathrooms?: number;
    city?: number;
    region?: number;
    property_type?: number;
    zone?: string;
    take?: number;
    skip?: number;
  }): Promise<Property[]> {
    try {
      
      const response = await fetch('/api/wasi/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filters: {
            match: filters.search,
            for_sale: filters.for_sale,
            for_rent: filters.for_rent,
            min_price: filters.min_price,
            max_price: filters.max_price,
            min_bedrooms: filters.bedrooms,
            bathrooms: filters.bathrooms,
            id_city: filters.city,
            id_region: filters.region,
            id_property_type: filters.property_type,
            id_zone: filters.zone,
            id_availability: 1, // Solo disponibles
            scope: 3, // Todas las propiedades
            take: Math.min(filters.take || 20, 100),
            skip: filters.skip || 0,
            order: 'desc',
            order_by: 'created_at'
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Error al obtener propiedades filtradas: ${response.status}`);
      }

      const apiResponse = await response.json();
      
      if (!apiResponse.success) {
        throw new Error(`Error en API: ${apiResponse.error || 'Error desconocido'}`);
      }

      const wasiResponse: WasiPropertiesResponse = apiResponse.data;
      const propertyKeys = Object.keys(wasiResponse).filter(key => !isNaN(parseInt(key)));
      const wasiProperties = propertyKeys.map(key => wasiResponse[key] as WasiProperty);
      const properties = wasiProperties.map(wp => this.convertWasiToProperty(wp));
      
      return properties;
    } catch (error) {
      console.error('❌ Error al obtener propiedades filtradas:', error);
      throw error;
    }
  }

  /**
   * Obtiene zonas desde las propiedades de Wasi
   */
  async getAllZones(): Promise<Zone[]> {
    try {
      
      const response = await fetch('/api/wasi/properties?scope=3&take=100&order=desc&order_by=created_at', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error al obtener propiedades para zonas: ${response.status}`);
      }

      const apiResponse = await response.json();
      
      if (!apiResponse.success) {
        throw new Error(`Error en API: ${apiResponse.error || 'Error desconocido'}`);
      }

      const wasiResponse: WasiPropertiesResponse = apiResponse.data;
      const propertyKeys = Object.keys(wasiResponse).filter(key => !isNaN(parseInt(key)));
      const wasiProperties = propertyKeys.map(key => wasiResponse[key] as WasiProperty);

      // Extraer zonas únicas
      const zonesMap = new Map<string, Zone>();
      
      wasiProperties.forEach((property, index) => {
        if (property.zone_label && property.zone_label.trim()) {
          const zoneKey = `${property.id_zone}_${property.zone_label}`;
          if (!zonesMap.has(zoneKey)) {
            zonesMap.set(zoneKey, {
              id: property.id_zone || index + 1000,
              name: property.zone_label,
              slug: property.zone_label.toLowerCase().replace(/\s+/g, '-'),
              description: `Zona en ${property.city_label}, ${property.region_label}`,
              count: 1,
              link: `/propiedades?zone=${property.id_zone}`,
              parent: 0,
              databaseId: property.id_zone || index + 1000
            });
          } else {
            const zone = zonesMap.get(zoneKey)!;
            zone.count++;
          }
        }
      });

      const zones = Array.from(zonesMap.values());
      return zones;
    } catch (error) {
      console.error('❌ Error al obtener zonas:', error);
      return [];
    }
  }

  /**
   * Obtiene reseñas (simuladas por ahora ya que Wasi no maneja reseñas)
   */
  async getReviewsByPropertyId(propertyId: number): Promise<Review[]> {
    return [];
  }
}

// Exportar instancia singleton
export const propertyService = new PropertyService();

// Re-exportar funciones para compatibilidad con el código existente
export const getAllProperties = () => propertyService.getAllProperties();
export const getPropertyBySlug = (slug: string) => propertyService.getPropertyBySlug(slug);
export const getPropertyById = (id: number) => propertyService.getPropertyById(id);
export const getAllZones = () => propertyService.getAllZones();
export const getReviewsByPropertyId = (propertyId: number) => propertyService.getReviewsByPropertyId(propertyId);

// Alias para compatibilidad
export type WordPressProperty = Property;
export type WordPressZone = Zone;
export type WordPressReview = Review; 
