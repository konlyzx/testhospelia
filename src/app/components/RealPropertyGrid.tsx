"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PropertyPrice from './PropertyPrice';
import HLoader from './HLoader';
import { 
  getAllProperties, 
  WordPressProperty
} from '@/services/wordpress';
import { extraerZonaAmigable } from '@/utils/zoneUtils';
import { favorites } from '@/services/favorites';

interface RealPropertyGridProps {
  className?: string;
  title?: string;
  subtitle?: string;
  maxProperties?: number;
  showLoadMore?: boolean;
}

const RealPropertyGrid: React.FC<RealPropertyGridProps> = ({
  className = '',
  title = 'Propiedades Destacadas',
  subtitle = 'Descubre nuestras mejores opciones de alojamiento',
  maxProperties = 6,
  showLoadMore = true
}) => {
  const [properties, setProperties] = useState<WordPressProperty[]>([]);
  const [displayedProperties, setDisplayedProperties] = useState<WordPressProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const propertiesData = await getAllProperties();
        
        if (propertiesData && propertiesData.length > 0) {
          setProperties(propertiesData);
          setDisplayedProperties(propertiesData.slice(0, maxProperties));
        } else {
          console.warn('⚠️ No se encontraron propiedades en WordPress');
          setProperties([]);
          setDisplayedProperties([]);
        }
      } catch (err) {
        console.error('❌ Error al cargar propiedades desde WordPress:', err);
        setError('No se pudieron cargar las propiedades. Por favor, inténtalo de nuevo más tarde.');
        setProperties([]);
        setDisplayedProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [maxProperties]);

  const handleLoadMore = () => {
    const currentCount = displayedProperties.length;
    const newCount = Math.min(currentCount + maxProperties, properties.length);
    setDisplayedProperties(properties.slice(0, newCount));
    
    if (newCount >= properties.length) {
      setShowMore(false);
    }
  };

  const getPropertyImages = (property: WordPressProperty) => {
    const images: Array<{ url: string; alt: string }> = [];
    
    // Imagen principal
    if (property._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
      images.push({
        url: property._embedded['wp:featuredmedia'][0].source_url,
        alt: property.title.rendered
      });
    }
    
    // Imágenes de la galería
    if (property.acf?.gallery && property.acf.gallery.length > 0) {
      property.acf.gallery.forEach((img: any) => {
        if (img.url && !images.some(existing => existing.url === img.url)) {
          images.push({
            url: img.url,
            alt: img.alt || property.title.rendered
          });
        }
      });
    }
    
    // Si no hay imágenes, usar placeholder
    if (images.length === 0) {
      images.push({
        url: '/placeholder-property.jpg',
        alt: property.title.rendered
      });
    }
    
    return images;
  };

  const getPropertyPrice = (property: WordPressProperty) => {
    // Fallback al precio genérico
    if (property.acf?.price && property.acf.price > 0) {
      return `$${property.acf.price.toLocaleString('es-CO')}`;
    }
    
    return 'Consultar precio';
  };

  const getBusinessType = (property: WordPressProperty) => {
    return 'Disponible';
  };

  const generatePropertySlug = (property: WordPressProperty) => {
    const baseSlug = property.slug || 
      property.title.rendered
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    
    return `${baseSlug}-${property.id}`;
  };

  if (loading) {
    return (
      <div className={`py-16 ${className} flex items-center justify-center min-h-[400px]`}>
        <div className="text-center">
          <HLoader size="large" className="mb-6" />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600">
              Cargando propiedades destacadas...
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`py-16 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-lg mx-auto">
              <p className="text-red-700">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (displayedProperties.length === 0) {
    return (
      <div className={`py-16 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
            <p className="text-gray-600">{subtitle}</p>
            <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-lg mx-auto">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay propiedades disponibles</h3>
              <p className="mt-1 text-sm text-gray-500">
                Actualmente no hay propiedades disponibles en nuestro sistema WordPress.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`py-16 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
          <p className="text-sm text-gray-500 mt-2">
            Mostrando {displayedProperties.length} de {properties.length} propiedades desde WordPress
          </p>
        </div>

        {/* Grid de propiedades con estilo Airbnb */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedProperties.map((property) => {
            const images = getPropertyImages(property);
            const propertySlug = generatePropertySlug(property);
            
            return (
              <Link
                key={property.id}
                href={`/propiedad/${propertySlug}`}
                className="group bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Grid de imágenes estilo Airbnb */}
                <div className="relative">
                  {images.length > 0 ? (
                    <div className="grid grid-cols-4 grid-rows-2 gap-1 h-64">
                      {/* Imagen principal - más grande */}
                      <div className="col-span-2 row-span-2 relative overflow-hidden">
                        <Image
                          src={images[0]?.url || '/placeholder-property.jpg'}
                          alt={images[0]?.alt || property.title.rendered}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-property.jpg';
                          }}
                        />
                      </div>
                      
                      {/* Imágenes secundarias */}
                      {images.slice(1, 5).map((image, index) => (
                        <div key={index} className="relative overflow-hidden">
                          <Image
                            src={image.url}
                            alt={image.alt}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder-property.jpg';
                            }}
                          />
                          {index === 3 && images.length > 5 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <span className="text-white font-medium text-sm">
                                +{images.length - 5}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {/* Rellenar con placeholders si faltan imágenes */}
                      {images.length < 5 && [...Array(5 - images.length)].map((_, index) => (
                        <div key={`placeholder-${index}`} className="relative overflow-hidden bg-gray-200">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-64 bg-gray-200 flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <svg className="w-16 h-16 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p>Sin imágenes</p>
                      </div>
                    </div>
                  )}

                  {/* Badge de disponibilidad */}
                  {property.acf?.availability && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-green-500 text-white px-2 py-1 rounded-md text-xs font-medium shadow-lg">
                        {property.acf.availability}
                      </span>
                    </div>
                  )}
                  
                  {/* Badge de tipo de negocio */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium shadow-lg">
                      {getBusinessType(property)}
                    </span>
                  </div>

                  {/* Botón de favorito */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Aquí puedes agregar lógica de favoritos
                    }}
                    className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100"
                    style={{ right: property.acf?.availability ? '60px' : '12px' }}
                  >
                    <svg className="w-5 h-5 text-gray-600 hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>

                {/* Información de la propiedad */}
                <div className="p-6">
                  {/* Ubicación y rating */}
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600 flex items-center">
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {property.acf?.location || 'Ubicación no especificada'}
                    </p>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-gray-800 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-900 ml-1">
                        {(Math.random() * (5.0 - 4.0) + 4.0).toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {/* Título */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                    {property.title.rendered}
                  </h3>

                  {/* Características */}
                  <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                    {property.acf?.bedrooms && property.acf.bedrooms > 0 && (
                      <span className="flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21v-4a2 2 0 012-2h4a2 2 0 012 2v4" />
                        </svg>
                        {property.acf.bedrooms} hab
                      </span>
                    )}
                    {property.acf?.bathrooms && property.acf.bathrooms > 0 && (
                      <span className="flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                        </svg>
                        {property.acf.bathrooms} baños
                      </span>
                    )}
                    {property.acf?.size && (
                      <span className="flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                        </svg>
                        {property.acf.size}
                      </span>
                    )}
                  </div>

                  {/* Precio */}
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">
                      {getPropertyPrice(property)}
                    </span>
                    <span className="text-xs text-gray-500">
                      ID: {property.acf?.wasi_id || property.id}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Botón cargar más */}
        {showLoadMore && displayedProperties.length < properties.length && (
          <div className="text-center mt-12">
            <button
              onClick={handleLoadMore}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Ver más propiedades ({properties.length - displayedProperties.length} restantes)
            </button>
          </div>
        )}

        {/* Mensaje cuando se muestran todas */}
        {displayedProperties.length >= properties.length && properties.length > maxProperties && (
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Mostrando todas las {properties.length} propiedades disponibles
            </p>
            <Link
              href="/propiedades-wasi"
              className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Ver página completa de propiedades →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealPropertyGrid; 
