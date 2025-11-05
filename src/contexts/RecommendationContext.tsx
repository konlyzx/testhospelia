'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { WasiProperty } from '@/services/wasi';

interface UserActivity {
  id: string;
  type: 'search' | 'view' | 'favorite' | 'inquiry';
  propertyId?: number;
  filters?: {
    bedrooms?: number;
    priceRange?: [number, number];
    forRent?: boolean;
    forSale?: boolean;
    zone?: string;
    amenities?: string[];
  };
  timestamp: number;
}

interface Recommendation {
  id: string;
  type: 'based_on_search' | 'similar_properties' | 'trending' | 'new_for_you';
  title: string;
  subtitle: string;
  properties: WasiProperty[];
  confidence: number; // 0-1
  reason: string;
}

interface RecommendationContextType {
  userActivity: UserActivity[];
  trackActivity: (activity: Omit<UserActivity, 'id' | 'timestamp'>) => void;
  getRecommendations: (properties: WasiProperty[]) => Recommendation[];
  clearActivity: () => void;
}

const RecommendationContext = createContext<RecommendationContextType | undefined>(undefined);

export function RecommendationProvider({ children }: { children: React.ReactNode }) {
  const [userActivity, setUserActivity] = useState<UserActivity[]>([]);

  useEffect(() => {
    // Cargar actividad guardada del localStorage
    const savedActivity = localStorage.getItem('hospelia-user-activity');
    if (savedActivity) {
      try {
        const parsedActivity = JSON.parse(savedActivity);
        // Mantener solo actividad de los últimos 30 días
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        const recentActivity = parsedActivity.filter((activity: UserActivity) => 
          activity.timestamp > thirtyDaysAgo
        );
        setUserActivity(recentActivity);
      } catch (error) {
        console.log('Error cargando actividad del usuario:', error);
      }
    }
  }, []);

  const trackActivity = (activity: Omit<UserActivity, 'id' | 'timestamp'>) => {
    const newActivity: UserActivity = {
      ...activity,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    setUserActivity(prev => {
      const updated = [...prev, newActivity];
      // Mantener solo los últimos 100 registros
      const trimmed = updated.slice(-100);
      
      // Guardar en localStorage
      localStorage.setItem('hospelia-user-activity', JSON.stringify(trimmed));
      
      return trimmed;
    });
  };

  const clearActivity = () => {
    setUserActivity([]);
    localStorage.removeItem('hospelia-user-activity');
  };

  const getRecommendations = useCallback((allProperties: WasiProperty[]): Recommendation[] => {
    if (!allProperties || allProperties.length === 0) return [];

    const recommendations: Recommendation[] = [];
    
    // 1. Basado en búsquedas anteriores
    const searchBasedRecs = getSearchBasedRecommendations(allProperties);
    if (searchBasedRecs) recommendations.push(searchBasedRecs);

    // 2. Propiedades similares a las vistas
    const similarRecs = getSimilarPropertiesRecommendations(allProperties);
    if (similarRecs) recommendations.push(similarRecs);

    // 3. Tendencias populares (propiedades más nuevas o con mejores precios)
    const trendingRecs = getTrendingRecommendations(allProperties);
    if (trendingRecs) recommendations.push(trendingRecs);

    // 4. Nuevo para ti (propiedades que no ha visto)
    const newForYouRecs = getNewForYouRecommendations(allProperties);
    if (newForYouRecs) recommendations.push(newForYouRecs);

    // Ordenar por confianza
    const sortedRecs = recommendations.sort((a, b) => b.confidence - a.confidence);
    
    return sortedRecs;
  }, [userActivity]);

  const getSearchBasedRecommendations = (properties: WasiProperty[]): Recommendation | null => {
    const searches = userActivity.filter(a => a.type === 'search' && a.filters);
    if (searches.length === 0) return null;

    // Analizar patrones de búsqueda más recientes
    const recentSearches = searches.slice(-5);
    const preferences = analyzeSearchPatterns(recentSearches);

    // Filtrar propiedades que coincidan con las preferencias
    const matchingProperties = properties.filter(property => {
      let score = 0;
      
      // Coincidencia de habitaciones
      if (preferences.bedrooms && property.bedrooms) {
        const propertyBedrooms = parseInt(property.bedrooms);
        if (propertyBedrooms === preferences.bedrooms) score += 3;
        else if (Math.abs(propertyBedrooms - preferences.bedrooms) === 1) score += 1;
      }

      // Coincidencia de tipo (renta/venta)
      if (preferences.forRent && property.for_rent === 'true') score += 2;
      if (preferences.forSale && property.for_sale === 'true') score += 2;

      // Coincidencia de rango de precio
      if (preferences.priceRange) {
        const [minPrice, maxPrice] = preferences.priceRange;
        const propertyPrice = parseInt(property.rent_price || property.sale_price || '0');
        if (propertyPrice >= minPrice && propertyPrice <= maxPrice) score += 2;
      }

      return score >= 2;
    }).slice(0, 6);

    if (matchingProperties.length === 0) return null;

    // Generar título dinámico basado en preferencias
    let title = 'Basado en tu búsqueda anterior';
    let subtitle = 'te puede gustar';
    
    if (preferences.bedrooms) {
      if (preferences.zone) {
        subtitle = `este apartamento de ${preferences.bedrooms} hab en ${preferences.zone}`;
      } else {
        subtitle = `estos apartamentos de ${preferences.bedrooms} habitaciones`;
      }
    }

    return {
      id: 'search-based',
      type: 'based_on_search',
      title,
      subtitle,
      properties: matchingProperties,
      confidence: 0.8,
      reason: 'Basado en tus búsquedas recientes'
    };
  };

  const getSimilarPropertiesRecommendations = (properties: WasiProperty[]): Recommendation | null => {
    const viewedProperties = userActivity
      .filter(a => a.type === 'view' && a.propertyId)
      .map(a => a.propertyId!)
      .slice(-10); // Últimas 10 propiedades vistas

    if (viewedProperties.length === 0) return null;

    // Encontrar propiedades similares
    const similarProperties = properties.filter(property => {
      if (viewedProperties.includes(property.id_property)) return false;
      
      // Buscar similitudes con propiedades vistas
      const viewedProperty = properties.find(p => viewedProperties.includes(p.id_property));
      if (!viewedProperty) return false;

      let similarity = 0;
      if (property.bedrooms === viewedProperty.bedrooms) similarity += 2;
      if (property.for_rent === viewedProperty.for_rent) similarity += 1;
      if (property.for_sale === viewedProperty.for_sale) similarity += 1;
      if (property.zone_label === viewedProperty.zone_label) similarity += 3;

      return similarity >= 3;
    }).slice(0, 6);

    if (similarProperties.length === 0) return null;

    return {
      id: 'similar-properties',
      type: 'similar_properties',
      title: 'Propiedades similares',
      subtitle: 'que podrían interesarte',
      properties: similarProperties,
      confidence: 0.7,
      reason: 'Basado en propiedades que has visto'
    };
  };

  const getTrendingRecommendations = (properties: WasiProperty[]): Recommendation | null => {
    // Propiedades más recientes o con mejor relación calidad-precio
    const trendingProperties = properties
      .filter(property => {
        const createdAt = new Date(property.created_at || '').getTime();
        const oneMonthAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        return createdAt > oneMonthAgo;
      })
      .sort((a, b) => {
        const dateA = new Date(a.created_at || '').getTime();
        const dateB = new Date(b.created_at || '').getTime();
        return dateB - dateA;
      })
      .slice(0, 6);

    if (trendingProperties.length === 0) return null;

    return {
      id: 'trending',
      type: 'trending',
      title: 'Tendencias populares',
      subtitle: 'Las más nuevas en Cali',
      properties: trendingProperties,
      confidence: 0.6,
      reason: 'Propiedades recientemente agregadas'
    };
  };

  const getNewForYouRecommendations = (properties: WasiProperty[]): Recommendation | null => {
    const viewedPropertyIds = userActivity
      .filter(a => a.type === 'view' && a.propertyId)
      .map(a => a.propertyId!);

    const newProperties = properties
      .filter(property => !viewedPropertyIds.includes(property.id_property))
      .slice(0, 6);

    if (newProperties.length === 0) return null;

    return {
      id: 'new-for-you',
      type: 'new_for_you',
      title: 'Nuevo para ti',
      subtitle: 'Propiedades que no has explorado',
      properties: newProperties,
      confidence: 0.5,
      reason: 'Propiedades que no has visto antes'
    };
  };

  const analyzeSearchPatterns = (searches: UserActivity[]) => {
    const patterns = {
      bedrooms: null as number | null,
      priceRange: null as [number, number] | null,
      forRent: false,
      forSale: false,
      zone: null as string | null,
      amenities: [] as string[],
    };

    // Analizar patrones más comunes
    const bedroomCounts: Record<number, number> = {};
    const priceCounts: Record<string, number> = {};
    let rentCount = 0, saleCount = 0;

    searches.forEach(search => {
      if (search.filters) {
        // Habitaciones
        if (search.filters.bedrooms) {
          bedroomCounts[search.filters.bedrooms] = (bedroomCounts[search.filters.bedrooms] || 0) + 1;
        }

        // Tipo
        if (search.filters.forRent) rentCount++;
        if (search.filters.forSale) saleCount++;

        // Zona
        if (search.filters.zone) {
          patterns.zone = search.filters.zone;
        }
      }
    });

    // Determinar preferencias más comunes
    const mostCommonBedrooms = Object.entries(bedroomCounts)
      .sort(([,a], [,b]) => b - a)[0];
    if (mostCommonBedrooms) {
      patterns.bedrooms = parseInt(mostCommonBedrooms[0]);
    }

    patterns.forRent = rentCount > saleCount;
    patterns.forSale = saleCount > rentCount;

    return patterns;
  };

  return (
    <RecommendationContext.Provider value={{
      userActivity,
      trackActivity,
      getRecommendations,
      clearActivity,
    }}>
      {children}
    </RecommendationContext.Provider>
  );
}

export function useRecommendations() {
  const context = useContext(RecommendationContext);
  if (context === undefined) {
    throw new Error('useRecommendations must be used within a RecommendationProvider');
  }
  return context;
} 