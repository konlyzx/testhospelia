'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import type { WasiProperty } from '@/services/wasi';

interface ApiResponse {
  success: boolean;
  data: {
    total: number;
    status: string;
    [key: string]: WasiProperty | number | string;
  };
  total: number;
}

export default function FavoritosPage() {
  const [favoriteProperties, setFavoriteProperties] = useState<WasiProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener IDs de favoritos del localStorage
      const savedFavorites = localStorage.getItem('hospelia-favorites');
      if (!savedFavorites) {
        setFavoriteIds([]);
        setFavoriteProperties([]);
        setLoading(false);
        return;
      }

      const ids = JSON.parse(savedFavorites);
      setFavoriteIds(ids);

      if (ids.length === 0) {
        setFavoriteProperties([]);
        setLoading(false);
        return;
      }

      // Obtener todas las propiedades para filtrar las favoritas
      const response = await fetch('/api/wasi/properties?take=100&order=desc&order_by=created_at');
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Error al obtener propiedades');
      }

      // Extraer propiedades del objeto de respuesta
      const propertyKeys = Object.keys(data.data).filter(key => !isNaN(parseInt(key)));
      const allProperties = propertyKeys.map(key => data.data[key] as WasiProperty);
      
      // Filtrar solo las propiedades favoritas
      const favorites = allProperties.filter(property => ids.includes(property.id_property));
      
      setFavoriteProperties(favorites);
    } catch (err) {
      console.error('❌ Error al cargar favoritos:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = (propertyId: number) => {
    const newFavorites = favoriteIds.filter(id => id !== propertyId);
    setFavoriteIds(newFavorites);
    setFavoriteProperties(prev => prev.filter(prop => prop.id_property !== propertyId));
    
    localStorage.setItem('hospelia-favorites', JSON.stringify(newFavorites));
    window.dispatchEvent(new CustomEvent('favoritesUpdated'));
  };

  const formatPrice = (price: string, priceLabel: string) => {
    if (!price || price === '0') return 'Consultar precio';
    return priceLabel || `$${parseInt(price).toLocaleString('es-CO')}`;
  };

  const getMainPrice = (property: WasiProperty) => {
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

  const createSlug = (title: string, id: number) => {
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    return `${slug}-${id}`;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* Header */}
        <div className="mb-8">
          <Link href="/propiedades-wasi" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a propiedades
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Tus favoritos</h1>
              <p className="text-gray-600">
                {favoriteProperties.length === 0 
                  ? 'No tienes propiedades guardadas' 
                  : `${favoriteProperties.length} ${favoriteProperties.length === 1 ? 'propiedad guardada' : 'propiedades guardadas'}`
                }
              </p>
            </div>
            
            {favoriteProperties.length > 0 && (
              <button
                onClick={() => {
                  localStorage.removeItem('hospelia-favorites');
                  setFavoriteProperties([]);
                  setFavoriteIds([]);
                  window.dispatchEvent(new CustomEvent('favoritesUpdated'));
                }}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Limpiar todos
              </button>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-xl mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-red-800">Error al cargar favoritos</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
            <button
              onClick={loadFavorites}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && favoriteProperties.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes favoritos aún</h3>
            <p className="text-gray-600 mb-6">Guarda propiedades que te interesen para encontrarlas fácilmente después</p>
            <Link 
              href="/propiedades-wasi"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Explorar propiedades
            </Link>
          </div>
        )}

        {/* Grid de favoritos */}
        {!loading && !error && favoriteProperties.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteProperties.map((property) => {
              const allImages = [
                property.main_image,
                ...(property.galleries || []).flatMap(gallery => 
                  Object.values(gallery).filter(item => 
                    typeof item === 'object' && item !== null && 'url' in item
                  )
                )
              ].filter(Boolean);

              const mainPrice = getMainPrice(property);
              const propertySlug = createSlug(property.title, property.id_property);

              return (
                <div key={property.id_property} className="group">
                  <div className="relative">
                    {/* Imagen */}
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                      <Link href={`/propiedad/${propertySlug}`}>
                        <Image
                          src={allImages[0]?.url || allImages[0]?.url_big || '/placeholder-property.jpg'}
                          alt={property.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-property.jpg';
                          }}
                        />
                      </Link>
                    </div>

                    {/* Botón remover favorito */}
                    <button
                      onClick={() => removeFavorite(property.id_property)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-all duration-200 hover:scale-110 shadow-md"
                      title="Remover de favoritos"
                    >
                      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>

                    {/* Badge de tipo */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                        {property.for_rent === 'true' ? 'Renta' : 'Venta'}
                      </span>
                    </div>
                  </div>

                  {/* Información */}
                  <Link href={`/propiedad/${propertySlug}`}>
                    <div className="mt-3">
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

                      <p className="text-sm text-gray-600 truncate">{property.title}</p>

                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        {property.bedrooms && <span>{property.bedrooms} hab</span>}
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

                      <div className="mt-2">
                        <span className="text-base font-semibold text-gray-900">{mainPrice.price}</span>
                        {mainPrice.period && <span className="text-sm text-gray-600"> {mainPrice.period}</span>}
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
} 