import useSWR from 'swr';
import { getAllProperties } from '@/services/properties';
import type { Property } from '@/services/properties';

// Fetcher optimizado con manejo de errores
const fetcher = async (): Promise<Property[]> => {
  try {
    return await getAllProperties();
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

export interface UsePropertiesOptions {
  // Filtros de búsqueda
  zone?: string | null;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number | null;
  search?: string;
  
  // Opciones de SWR
  refreshInterval?: number;
  revalidateOnFocus?: boolean;
  revalidateOnReconnect?: boolean;
}

export interface UsePropertiesReturn {
  properties: Property[];
  filteredProperties: Property[];
  isLoading: boolean;
  isError: boolean;
  mutate: () => void;
  isValidating: boolean;
}

export function useProperties(options: UsePropertiesOptions = {}): UsePropertiesReturn {
  const {
    zone,
    minPrice = 0,
    maxPrice = Infinity,
    bedrooms,
    search,
    refreshInterval = 300000, // 5 minutos
    revalidateOnFocus = false,
    revalidateOnReconnect = true,
  } = options;

  const { data, error, mutate, isValidating } = useSWR<Property[]>(
    'properties',
    fetcher,
    {
      refreshInterval,
      revalidateOnFocus,
      revalidateOnReconnect,
      dedupingInterval: 60000, // 1 minuto de deduplicación
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      // Cache por 10 minutos, revalidar en background
      focusThrottleInterval: 60000,
    }
  );

  const properties = data || [];
  const isLoading = !data && !error;
  const isError = !!error;

  // Filtrado optimizado en cliente
  const filteredProperties = properties.filter(property => {
    // Filtro por zona
    if (zone && property.acf?.zone_label && 
        property.acf.zone_label.toLowerCase() !== zone.toLowerCase()) {
      return false;
    }

    // Filtro por precio
    const price = property.acf?.price || property.acf?.sale_price || property.acf?.rent_price || 0;
    if (price < minPrice || price > maxPrice) {
      return false;
    }

    // Filtro por habitaciones
    if (bedrooms !== null && bedrooms !== undefined) {
      const propertyBedrooms = property.acf?.bedrooms || 0;
      if (propertyBedrooms < bedrooms) {
        return false;
      }
    }

    // Filtro por búsqueda de texto
    if (search && search.trim()) {
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

  return {
    properties,
    filteredProperties,
    isLoading,
    isError,
    mutate,
    isValidating,
  };
}

// Hook específico para obtener una propiedad por slug o ID
export function useProperty(slugOrId: string) {
  const { data, error, mutate, isValidating } = useSWR(
    slugOrId ? `property-${slugOrId}` : null,
    async () => {
      const { getPropertyBySlug, getPropertyById } = await import('@/services/properties');
      
      // Detectar si es un ID numérico o un slug
      const isNumericId = /^\d+$/.test(slugOrId);
      const isPropertyId = slugOrId.startsWith('property-') && /property-\d+$/.test(slugOrId);
      
      if (isNumericId) {
        // Es un ID directo
        return getPropertyById(parseInt(slugOrId));
      } else if (isPropertyId) {
        // Es del formato property-123
        const id = parseInt(slugOrId.replace('property-', ''));
        return getPropertyById(id);
      } else {
        // Es un slug normal
        return getPropertyBySlug(slugOrId);
      }
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 300000, // 5 minutos
      errorRetryCount: 3,
    }
  );

  return {
    property: data,
    isLoading: !data && !error,
    isError: !!error,
    mutate,
    isValidating,
  };
}

// Hook para zonas
export function useZones() {
  const { data, error, mutate } = useSWR(
    'zones',
    async () => {
      const { getAllZones } = await import('@/services/properties');
      return getAllZones();
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 600000, // 10 minutos - las zonas cambian poco
      errorRetryCount: 2,
    }
  );

  return {
    zones: data || [],
    isLoading: !data && !error,
    isError: !!error,
    mutate,
  };
} 