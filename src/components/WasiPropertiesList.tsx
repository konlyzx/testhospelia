'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { getWasiProperties } from '@/services/wasi';
import type { WasiProperty, WasiApiResponse } from '@/services/wasi';
import HLoader from '@/app/components/HLoader';
import HeartIcon from '@/app/components/HeartIcon';
import Script from 'next/script';

interface WasiPropertiesListProps {
  filters?: {
    search?: string;
    for_sale?: boolean;
    for_rent?: boolean;
    min_price?: number;
    max_price?: number;
    bedrooms?: number;
    city?: number;
    take?: number;
  };
  className?: string;
}

interface ApiResponse {
  success: boolean;
  data: {
    total: number;
    status: string;
    [key: string]: WasiProperty | number | string;
  };
  total: number;
}

// Hook para manejar favoritos con localStorage
const useFavorites = () => {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  useEffect(() => {
    const savedFavorites = localStorage.getItem('hospelia-favorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  const toggleFavorite = (propertyId: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(propertyId)) {
        newFavorites.delete(propertyId);
      } else {
        newFavorites.add(propertyId);
      }
      localStorage.setItem('hospelia-favorites', JSON.stringify([...newFavorites]));
      
      // Disparar evento personalizado para actualizar otros componentes
      window.dispatchEvent(new CustomEvent('favoritesUpdated'));
      
      return newFavorites;
    });
  };

  return { favorites, toggleFavorite };
};

// Componente de card de propiedad estilo Airbnb
const PropertyCard = ({ property, isFavorite, onToggleFavorite }: {
  property: WasiProperty;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  // Obtener todas las imágenes disponibles
  const allImages = [
    property.main_image,
    ...(property.galleries || []).flatMap(gallery => 
      Object.values(gallery).filter(item => 
        typeof item === 'object' && item !== null && 'url' in item
      )
    )
  ].filter(Boolean);

  const formatPrice = (price: string, priceLabel: string) => {
    if (!price || price === '0') return 'Consultar precio';
    return priceLabel || `$${parseInt(price).toLocaleString('es-CO')}`;
  };

  const getMainPrice = () => {
    if (property.for_rent === 'true' && property.rent_price !== '0') {
      return {
        price: formatPrice(property.rent_price, property.rent_price_label),
        period: '/noche',
        type: 'rent'
      };
    }
    if (property.for_sale === 'true' && property.sale_price !== '0') {
      return {
        price: formatPrice(property.sale_price, property.sale_price_label),
        period: '',
        type: 'sale'
      };
    }
    return { price: 'Consultar precio', period: '', type: 'consult' };
  };

  const mainPrice = getMainPrice();

  // Crear slug para la URL
  const createSlug = (title: string, id: number) => {
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    return `${slug}-${id}`;
  };

  const propertySlug = createSlug(property.title, property.id_property);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div 
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Carrusel de imágenes */}
        <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
          {allImages.length > 0 ? (
            <>
              <Link href={`/propiedad/${propertySlug}`}>
                <Image
                  src={allImages[currentImageIndex]?.url || allImages[currentImageIndex]?.url_big || '/placeholder-property.jpg'}
                  alt={property.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-property.jpg';
                  }}
                />
              </Link>
              
              {/* Navegación de imágenes */}
              {allImages.length > 1 && isHovered && (
                <>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100"
                  >
                    <svg className="w-4 h-4 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100"
                  >
                    <svg className="w-4 h-4 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  {/* Indicadores de imagen */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
                    {allImages.map((_, index) => (
                      <div
                        key={index}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <Link href={`/propiedad/${propertySlug}`}>
              <div className="flex items-center justify-center h-full bg-gray-100">
                <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </Link>
          )}
        </div>

        {/* Botón de favorito */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite();
          }}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-300 ${
            isFavorite
              ? "bg-red-500 text-white shadow-lg scale-110"
              : "bg-white/90 text-gray-600 hover:bg-white hover:scale-105"
          } backdrop-blur-sm shadow-md hover:shadow-lg`}
        >
          <HeartIcon
            size={18}
            filled={isFavorite}
            className={isFavorite ? "text-white" : "text-gray-600"}
          />
        </button>

        {/* Badge de tipo de negocio */}
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
            {property.for_rent === 'true' ? 'Renta' : 'Venta'}
          </span>
        </div>
      </div>

      {/* Información de la propiedad */}
      <Link href={`/propiedad/${propertySlug}`}>
        <div className="mt-3">
          {/* Ubicación y rating */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-900 truncate">
              {property.zone_label || property.city_label}, {property.region_label}
            </span>
            <div className="flex items-center">
              <svg className="w-4 h-4 text-gray-800 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-medium text-gray-900 ml-1">
                {(Math.random() * (5.0 - 4.0) + 4.0).toFixed(1)}
              </span>
            </div>
          </div>

          {/* Título de la propiedad */}
          <p className="text-sm text-gray-600 truncate">
            {property.title}
          </p>

          {/* Características */}
          <div className="flex items-center text-sm text-gray-600 mt-1">
            {property.bedrooms && (
              <span>{property.bedrooms} hab</span>
            )}
            {property.bathrooms && (
              <>
                {property.bedrooms && <span className="mx-1">·</span>}
                <span>{property.bathrooms} baños</span>
              </>
            )}
            {property.area && (
              <>
                {(property.bedrooms || property.bathrooms) && <span className="mx-1">·</span>}
                <span>{property.area} {property.unit_area_label}</span>
              </>
            )}
          </div>

          {/* Precio */}
          <div className="mt-2">
            <span className="text-base font-semibold text-gray-900">
              {mainPrice.price}
            </span>
            {mainPrice.period && (
              <span className="text-sm text-gray-600"> {mainPrice.period}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

const PropertyCardMemo = React.memo(PropertyCard);

export default function WasiPropertiesList({ filters = {}, className = '' }: WasiPropertiesListProps) {
  const [properties, setProperties] = useState<WasiProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      // Construir URL con parámetros
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.for_sale !== undefined) params.append('for_sale', filters.for_sale.toString());
      if (filters.for_rent !== undefined) params.append('for_rent', filters.for_rent.toString());
      if (filters.min_price) params.append('min_price', filters.min_price.toString());
      if (filters.max_price) params.append('max_price', filters.max_price.toString());
      if (filters.bedrooms) params.append('min_bedrooms', filters.bedrooms.toString());
      if (filters.city) params.append('city', filters.city.toString());
      params.append('take', (filters.take || 12).toString());
      params.append('availability', '1'); // Solo disponibles
      params.append('scope', '3'); // Todas las propiedades


      const response = await fetch(`/api/wasi/properties?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Error al obtener propiedades');
      }

      // Extraer propiedades del objeto de respuesta
      const propertyKeys = Object.keys(data.data).filter(key => !isNaN(parseInt(key)));
      const propertiesList = propertyKeys.map(key => data.data[key] as WasiProperty);

      setProperties(propertiesList);
      setTotal(data.total);
      
    } catch (err) {
      console.error('❌ Error al obtener propiedades:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <HLoader size="large" className="mb-6" />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="text-gray-600 text-xl mb-2">Cargando propiedades de WASI...</p>
            <p className="text-gray-500 text-sm">Esto puede tomar unos segundos</p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error al cargar propiedades</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={fetchProperties}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center p-12 ${className}`}>
        <div className="text-center">
          <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay propiedades disponibles</h3>
          <p className="text-gray-600 max-w-md">
            No se encontraron propiedades que coincidan con tus filtros. Prueba ajustando los criterios de búsqueda.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header con resultados */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          {total} {total === 1 ? 'alojamiento' : 'alojamientos'} en Cali
        </h2>
        <p className="text-gray-600">
          Descubre lugares únicos donde hospedarte
        </p>
      </div>

      {/* Grid de propiedades estilo Airbnb */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {properties.map((property) => (
          <PropertyCardMemo
            key={property.id_property}
            property={property}
            isFavorite={favorites.has(property.id_property)}
            onToggleFavorite={() => toggleFavorite(property.id_property)}
          />
        ))}
      </div>

      <Script
        id="schema-itemlist-properties"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            itemListElement: properties.map((p, i) => {
              const slug = (p.title || '')
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim() + `-${p.id_property}`;
              return {
                '@type': 'ListItem',
                position: i + 1,
                url: `https://hospelia.co/propiedad/${slug}`,
                name: p.title,
              };
            })
          })
        }}
      />

      {/* Mostrar más resultados */}
      {total > properties.length && (
        <div className="text-center mt-12">
          <button
            onClick={() => {
              // Implementar carga de más propiedades si es necesario
            }}
            className="bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            Mostrar más lugares
          </button>
        </div>
      )}
    </div>
  );
} 
