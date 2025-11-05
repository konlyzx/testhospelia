"use client";

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { WavyDivider, CirclePattern, DotPattern } from '../components/ui/Dividers';
import Link from 'next/link';
import Image from 'next/image';
import { useProperties, useZones } from '@/lib/hooks/useProperties';
import { PropertyGridSkeleton, FiltersSkeleton } from '../components/skeletons/PropertyCardSkeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Property } from '@/services/properties';

// Componente de tarjeta de propiedad optimizado
const PropertyCard = React.memo(({ property }: { property: Property }) => {
  const price = property.acf?.price || property.acf?.sale_price || property.acf?.rent_price || 0;
  const imageUrl = property._embedded?.['wp:featuredmedia']?.[0]?.source_url || 
                   property.acf?.gallery?.[0]?.url || 
                   '/zona-default.jpg';

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="relative">
        <Image 
          src={imageUrl}
          alt={property.title.rendered}
          width={400}
          height={224}
          className="w-full h-56 object-cover"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          priority={false}
          loading="lazy"
        />
        {property.acf?.featured && (
          <span className="absolute top-4 right-4 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            Destacado
          </span>
        )}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
          <span className="text-white font-bold text-lg">
            {new Intl.NumberFormat('es-CO', { 
              style: 'currency', 
              currency: 'COP', 
              minimumFractionDigits: 0 
            }).format(price)}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-xl mb-2 text-gray-800 line-clamp-2">
          {property.title.rendered}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2" 
           dangerouslySetInnerHTML={{ __html: property.excerpt.rendered }}
        />
        <div className="flex justify-between text-gray-500 text-sm mb-3">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {property.acf?.bedrooms || 0} hab.
          </span>
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {property.acf?.bathrooms || 0} baños
          </span>
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            {property.acf?.size || 'N/A'}
          </span>
        </div>
        <Link
          href={`/propiedad/${property.slug}`}
          className="block text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
          prefetch={false}
        >
          Ver detalles
        </Link>
      </div>
    </div>
  );
});

PropertyCard.displayName = 'PropertyCard';

// Componente de filtro optimizado
const PropertyFilters = React.memo(({ 
  zones,
  activeZone,
  onZoneChange,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  bedrooms,
  onBedroomsChange,
  isLoading,
  t
}: {
  zones: any[];
  activeZone: string | null;
  onZoneChange: (zone: string | null) => void;
  minPrice: number;
  maxPrice: number;
  onMinPriceChange: (value: number) => void;
  onMaxPriceChange: (value: number) => void;
  bedrooms: number | null;
  onBedroomsChange: (value: number | null) => void;
  isLoading: boolean;
  t: (key: string) => string;
}) => {
  if (isLoading) {
    return <FiltersSkeleton />;
  }

      return (
      <div className="bg-white p-6 rounded-xl shadow-md sticky top-20">
        <h3 className="font-bold text-xl mb-4 text-gray-800">{t('common.filters')}</h3>
        
        {/* Zonas */}
        <div className="mb-6">
          <label className="font-medium text-gray-700 block mb-2">{t('common.zone')}</label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            <div className="flex items-center">
              <input 
                type="radio" 
                id="all-zones" 
                checked={activeZone === null} 
                onChange={() => onZoneChange(null)}
                className="w-4 h-4 text-blue-600"
              />
              <label htmlFor="all-zones" className="ml-2 text-gray-600">{t('common.all_zones')}</label>
            </div>
          {zones.map(zone => (
            <div key={zone.id} className="flex items-center">
              <input 
                type="radio" 
                id={`zone-${zone.id}`} 
                checked={activeZone === zone.slug}
                onChange={() => onZoneChange(zone.slug)}
                className="w-4 h-4 text-blue-600"
              />
              <label htmlFor={`zone-${zone.id}`} className="ml-2 text-gray-600">
                {zone.name}
              </label>
            </div>
          ))}
        </div>
      </div>
      
              {/* Precio */}
        <div className="mb-6">
          <label className="font-medium text-gray-700 block mb-2">{t('common.price')} (COP)</label>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-500 block mb-1">{t('common.minimum')}</label>
            <input 
              type="range" 
              min="500000" 
              max="3000000" 
              step="100000" 
              value={minPrice}
              onChange={(e) => onMinPriceChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <span className="text-sm text-gray-600 block mt-1">
              {new Intl.NumberFormat('es-CO', { 
                style: 'currency', 
                currency: 'COP', 
                minimumFractionDigits: 0 
              }).format(minPrice)}
            </span>
          </div>
                      <div>
              <label className="text-sm text-gray-500 block mb-1">{t('common.maximum')}</label>
            <input 
              type="range" 
              min="500000" 
              max="3000000" 
              step="100000" 
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <span className="text-sm text-gray-600 block mt-1">
              {new Intl.NumberFormat('es-CO', { 
                style: 'currency', 
                currency: 'COP', 
                minimumFractionDigits: 0 
              }).format(maxPrice)}
            </span>
          </div>
        </div>
      </div>
      
              {/* Habitaciones */}
        <div className="mb-6">
          <label className="font-medium text-gray-700 block mb-2">{t('common.bedrooms')}</label>
          <div className="flex space-x-2 flex-wrap">
            {[null, 1, 2, 3, 4].map((value, index) => (
              <button
                key={index}
                onClick={() => onBedroomsChange(value)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  bedrooms === value
                    ? 'bg-blue-600 text-white font-medium' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {value === null ? t('common.all') : value + '+'}
              </button>
            ))}
          </div>
        </div>
        
        {/* Botón resetear filtros */}
        <button 
          onClick={() => {
            onZoneChange(null);
            onMinPriceChange(500000);
            onMaxPriceChange(3000000);
            onBedroomsChange(null);
          }}
          className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
        >
          {t('common.reset_filters')}
        </button>
    </div>
  );
});

PropertyFilters.displayName = 'PropertyFilters';

export default function PropertiesPage() {
  const searchParams = useSearchParams();
  const zoneParam = searchParams.get('zona');
  const { t } = useLanguage();
  
  const [activeZone, setActiveZone] = useState<string | null>(zoneParam);
  const [minPrice, setMinPrice] = useState(500000);
  const [maxPrice, setMaxPrice] = useState(3000000);
  const [bedrooms, setBedrooms] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'recent'>('recent');
  
  // Usar hooks optimizados
  const { zones, isLoading: zonesLoading } = useZones();
  const { 
    filteredProperties, 
    isLoading: propertiesLoading, 
    isError,
    isValidating 
  } = useProperties({
    zone: activeZone,
    minPrice,
    maxPrice,
    bedrooms,
  });

  // Aplicar ordenamiento
  const sortedProperties = useMemo(() => {
    const sorted = [...filteredProperties];
    
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => {
          const priceA = a.acf?.price || a.acf?.sale_price || a.acf?.rent_price || 0;
          const priceB = b.acf?.price || b.acf?.sale_price || b.acf?.rent_price || 0;
          return priceA - priceB;
        });
      case 'price-desc':
        return sorted.sort((a, b) => {
          const priceA = a.acf?.price || a.acf?.sale_price || a.acf?.rent_price || 0;
          const priceB = b.acf?.price || b.acf?.sale_price || b.acf?.rent_price || 0;
          return priceB - priceA;
        });
      case 'recent':
      default:
        return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  }, [filteredProperties, sortBy]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Divisor superior */}
      <WavyDivider color="text-white" />
      
      {/* Header de la página */}
      <div className="bg-blue-600 py-12 relative overflow-hidden">
        <CirclePattern className="top-20 -right-20" color="text-white/20" />
        <CirclePattern className="-bottom-40 -left-20" color="text-white/10" />
        
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Propiedades Disponibles
          </h1>
          <p className="text-blue-100 max-w-xl">
            Explora todas nuestras propiedades disponibles en las mejores ubicaciones. 
            Filtra por zona, precio y características para encontrar tu hogar ideal.
          </p>
          {isValidating && (
            <div className="mt-4 flex items-center text-blue-100">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Actualizando propiedades...
            </div>
          )}
        </div>
      </div>
      
      {/* Divider bajo el header */}
      <WavyDivider className="transform rotate-180" color="text-blue-600" />
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar con filtros */}
          <div className="md:col-span-1">
            <PropertyFilters 
              zones={zones}
              activeZone={activeZone}
              onZoneChange={setActiveZone}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onMinPriceChange={setMinPrice}
              onMaxPriceChange={setMaxPrice}
              bedrooms={bedrooms}
              onBedroomsChange={setBedrooms}
              isLoading={zonesLoading}
              t={t}
            />
          </div>
          
          {/* Lista de propiedades */}
          <div className="md:col-span-3">
                          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {propertiesLoading ? '...' : sortedProperties.length} {' '}
                  {sortedProperties.length === 1 ? t('common.property_found') : t('common.properties_found')}
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-900 text-sm font-bold">{t('common.sort_by')}:</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-bold text-gray-900 font-medium min-w-[180px] shadow-sm hover:shadow-md transition-all duration-200 appearance-none pr-10"
                  >
                    <option value="recent">{t('common.recent')}</option>
                    <option value="price-asc">{t('common.price_low_high')}</option>
                    <option value="price-desc">{t('common.price_high_low')}</option>
                  </select>
                </div>
              </div>
            
            {propertiesLoading ? (
              <PropertyGridSkeleton count={6} />
            ) : isError ? (
              <div className="bg-white p-8 rounded-xl shadow text-center">
                <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Error al cargar propiedades</h3>
                <p className="text-gray-500 mb-4">
                  Hubo un problema al cargar las propiedades. Por favor intenta recargar la página.
                </p>
                <button 
                  onClick={() => window.location.reload()}
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Recargar página
                </button>
              </div>
                          ) : sortedProperties.length === 0 ? (
                <div className="bg-white p-8 rounded-xl shadow text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">{t('common.no_properties')}</h3>
                  <p className="text-gray-500 mb-4">
                    {t('common.no_properties_desc')}
                  </p>
                  <button 
                    onClick={() => {
                      setActiveZone(null);
                      setMinPrice(500000);
                      setMaxPrice(3000000);
                      setBedrooms(null);
                    }}
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    {t('common.reset_filters')}
                  </button>
                </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {sortedProperties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Divider final */}
      <WavyDivider className="transform rotate-180" color="text-white" />
      
      {/* Call-to-action */}
      <div className="bg-blue-600 py-16 relative">
        <DotPattern className="inset-0 opacity-10" color="text-white" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-bold text-white mb-4">{t('common.not_found_title')}</h2>
          <p className="text-blue-100 max-w-xl mx-auto mb-8">
            {t('common.not_found_desc')}
          </p>
          <Link
            href="/contacto"
            className="inline-block px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
          >
            {t('common.contact_us')}
          </Link>
        </div>
      </div>
    </div>
  );
} 