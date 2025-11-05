"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllProperties, Property } from '@/services/properties';

export default function PropertiesPageWithTaxonomies() {
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    for_sale: false,
    for_rent: true,
    min_price: '',
    max_price: '',
    bedrooms: '',
    location: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const properties = await getAllProperties();
        
        setAllProperties(properties);
        setFilteredProperties(properties);
      } catch (error) {
        console.error('❌ Error al cargar propiedades:', error);
        setError('Error al cargar propiedades desde Wasi CRM');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Aplicar filtros cuando cambien
  useEffect(() => {
    let filtered = [...allProperties];

    // Filtro por búsqueda de texto
    if (filters.search) {
      filtered = filtered.filter(property =>
        property.title.rendered.toLowerCase().includes(filters.search.toLowerCase()) ||
        property.content.rendered.toLowerCase().includes(filters.search.toLowerCase()) ||
        (property.acf?.location?.toLowerCase().includes(filters.search.toLowerCase()))
      );
    }

    // Filtro por tipo de negocio
    if (filters.for_sale && !filters.for_rent) {
      filtered = filtered.filter(property => property.acf?.for_sale);
    } else if (filters.for_rent && !filters.for_sale) {
      filtered = filtered.filter(property => property.acf?.for_rent);
    }

    // Filtro por habitaciones
    if (filters.bedrooms) {
      const bedroomCount = parseInt(filters.bedrooms);
      filtered = filtered.filter(property => 
        property.acf?.bedrooms && property.acf.bedrooms >= bedroomCount
      );
    }

    // Filtro por ubicación
    if (filters.location) {
      filtered = filtered.filter(property =>
        property.acf?.location?.toLowerCase().includes(filters.location.toLowerCase()) ||
        property.acf?.zone_label?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Filtro por precio mínimo
    if (filters.min_price) {
      const minPrice = parseInt(filters.min_price);
      filtered = filtered.filter(property => {
        const price = property.acf?.sale_price || property.acf?.rent_price || property.acf?.price || 0;
        return price >= minPrice;
      });
    }

    // Filtro por precio máximo
    if (filters.max_price) {
      const maxPrice = parseInt(filters.max_price);
      filtered = filtered.filter(property => {
        const price = property.acf?.sale_price || property.acf?.rent_price || property.acf?.price || 0;
        return price <= maxPrice;
      });
    }

    setFilteredProperties(filtered);
  }, [filters, allProperties]);

  const handlePropertiesFiltered = (properties: Property[]) => {
    setFilteredProperties(properties);
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      for_sale: false,
      for_rent: true,
      min_price: '',
      max_price: '',
      bedrooms: '',
      location: ''
    });
  };

  const sortProperties = (properties: Property[]) => {
    return properties.sort((a, b) => {
      // Ordenar por fecha de creación (más recientes primero)
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  };

  const sortedProperties = sortProperties(filteredProperties);

  const getPropertyImage = (property: Property) => {
    if (property._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
      return property._embedded['wp:featuredmedia'][0].source_url;
    }
    
    if (property.acf?.gallery && property.acf.gallery.length > 0) {
      return property.acf.gallery[0].url;
    }
    
    return '/placeholder-property.jpg';
  };

  const getPropertyLocation = (property: Property) => {
    return property.acf?.location || 'Cali, Valle del Cauca';
  };

  const getPropertyPrice = (property: Property) => {
    if (property.acf?.sale_price_label && property.acf.sale_price > 0) {
      return property.acf.sale_price_label;
    }
    
    if (property.acf?.rent_price_label && property.acf.rent_price > 0) {
      return property.acf.rent_price_label;
    }
    
    if (property.acf?.price && property.acf.price > 0) {
      return `$${property.acf.price.toLocaleString('es-CO')}`;
    }
    
    return 'Consultar precio';
  };

  const isNewProperty = (property: Property) => {
    const propertyDate = new Date(property.date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - propertyDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 15;
  };

  const getBusinessType = (property: Property) => {
    const types = [];
    if (property.acf?.for_sale) types.push('Venta');
    if (property.acf?.for_rent) types.push('Renta');
    return types.length > 0 ? types.join(' / ') : 'Consultar';
  };

  const PropertyCard: React.FC<{ property: Property }> = ({ property }) => (
    <Link 
      href={`/propiedad/${property.slug}`}
      className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={getPropertyImage(property)}
          alt={property.title.rendered}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-property.jpg';
          }}
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2">
          <span className="bg-primary text-white px-2 py-1 rounded-md text-xs font-medium">
            {getBusinessType(property)}
          </span>
        </div>

        {isNewProperty(property) && (
          <div className="absolute top-2 right-2">
            <span className="bg-green-500 text-white px-2 py-1 rounded-md text-xs font-medium">
              Nuevo
            </span>
          </div>
        )}

        {property.acf?.availability && (
          <div className="absolute bottom-2 right-2">
            <span className="bg-white/90 text-gray-800 px-2 py-1 rounded-md text-xs font-medium">
              {property.acf.availability}
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-200 line-clamp-2">
          {property.title.rendered}
        </h3>

        <p className="text-gray-600 mb-3 text-sm line-clamp-2">
          {property.excerpt.rendered}
        </p>

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

        {/* Ubicación */}
        <p className="text-sm text-gray-600 mb-3 flex items-center">
          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {getPropertyLocation(property)}
        </p>

        {/* Precio */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-primary">
              {getPropertyPrice(property)}
            </span>
            <span className="text-xs text-gray-500">
              Wasi ID: {property.acf?.wasi_id || property.id}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-md">
                  <div className="h-48 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error al cargar propiedades</h2>
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Propiedades Disponibles
          </h1>
          <p className="text-gray-600">
            Descubre nuestras {allProperties.length} propiedades disponibles desde Wasi CRM
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtros de búsqueda</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Búsqueda por texto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Título, ubicación, descripción..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Tipo de negocio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de negocio
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.for_rent}
                    onChange={(e) => handleFilterChange('for_rent', e.target.checked)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Renta</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.for_sale}
                    onChange={(e) => handleFilterChange('for_sale', e.target.checked)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Venta</span>
                </label>
              </div>
            </div>

            {/* Habitaciones */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Habitaciones mínimas
              </label>
              <select
                value={filters.bedrooms}
                onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Cualquiera</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>

            {/* Ubicación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ubicación
              </label>
              <input
                type="text"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                placeholder="Zona, ciudad..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtros de precio */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio mínimo
              </label>
              <input
                type="number"
                value={filters.min_price}
                onChange={(e) => handleFilterChange('min_price', e.target.value)}
                placeholder="Ej: 500000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio máximo
              </label>
              <input
                type="number"
                value={filters.max_price}
                onChange={(e) => handleFilterChange('max_price', e.target.value)}
                placeholder="Ej: 5000000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Botón limpiar filtros */}
          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Mostrando {filteredProperties.length} de {allProperties.length} propiedades
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        {/* Grid de propiedades */}
        {sortedProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay propiedades disponibles</h3>
            <p className="mt-1 text-sm text-gray-500">
              No se encontraron propiedades que coincidan con los filtros aplicados.
            </p>
            <div className="mt-6">
              <button
                onClick={clearFilters}
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
