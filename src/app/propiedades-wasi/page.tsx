'use client';

import React, { useState } from 'react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import WasiPropertiesList from '@/components/WasiPropertiesList';
import FavoritesButton from '@/components/FavoritesButton';

export default function PropiedadesWasiPage() {
  const [filters, setFilters] = useState({
    search: '',
    for_sale: false,
    for_rent: true, // Por defecto mostrar rentas
    min_price: undefined as number | undefined,
    max_price: undefined as number | undefined,
    bedrooms: undefined as number | undefined,
    city: 132, // Cali por defecto
    take: 12
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
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
      min_price: undefined,
      max_price: undefined,
      bedrooms: undefined,
      city: 132,
      take: 12
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.for_sale || filters.for_rent) count++;
    if (filters.min_price || filters.max_price) count++;
    if (filters.bedrooms) count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />
      
      {/* Hero Section Mejorado */}
      <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 pt-20">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Encuentra tu próximo <span className="text-blue-600">hogar</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Descubre apartamentos únicos, completamente equipados y verificados en las mejores zonas de Cali
            </p>
            
            {/* Search Bar Airbnb Style Mejorado */}
            <div className="max-w-4xl mx-auto bg-white rounded-full shadow-xl border border-gray-200 p-2">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
                {/* Ubicación */}
                <div className="px-6 py-4 border-r border-gray-200 md:border-r lg:border-r-0">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Ubicación</label>
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    placeholder="¿Dónde quieres alojarte?"
                    className="w-full text-sm text-gray-900 placeholder-gray-500 bg-transparent border-none focus:outline-none"
                  />
                </div>
                
                {/* Habitaciones */}
                <div className="px-6 py-4 border-r border-gray-200 md:border-r lg:border-r-0">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Habitaciones</label>
                  <select
                    value={filters.bedrooms || ''}
                    onChange={(e) => handleFilterChange('bedrooms', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full text-sm text-gray-900 bg-transparent border-none focus:outline-none cursor-pointer"
                  >
                    <option value="">Cualquiera</option>
                    <option value="1">1 habitación</option>
                    <option value="2">2 habitaciones</option>
                    <option value="3">3+ habitaciones</option>
                  </select>
                </div>
                
                {/* Precio */}
                <div className="px-6 py-4 border-r border-gray-200 md:border-r lg:border-r-0">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Presupuesto</label>
                  <input
                    type="number"
                    value={filters.max_price || ''}
                    onChange={(e) => handleFilterChange('max_price', e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="Precio máximo"
                    className="w-full text-sm text-gray-900 placeholder-gray-500 bg-transparent border-none focus:outline-none"
                  />
                </div>
                
                {/* Botón de búsqueda */}
                <div className="flex items-center justify-center px-2">
                  <button className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-full p-4 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar Estilo Airbnb */}
      <div className="sticky top-20 bg-white border-b border-gray-200 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Filter Tabs Mejorados */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0">
              <button
                onClick={() => handleFilterChange('for_rent', !filters.for_rent)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full border-2 transition-all duration-200 whitespace-nowrap ${
                  filters.for_rent 
                    ? 'bg-gray-900 border-gray-900 text-white' 
                    : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:shadow-md'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7zm0 0a2 2 0 012 0m14 0a2 2 0 012 0" />
                </svg>
                <span className="font-medium">Para renta</span>
              </button>
              
              <button
                onClick={() => handleFilterChange('for_sale', !filters.for_sale)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full border-2 transition-all duration-200 whitespace-nowrap ${
                  filters.for_sale 
                    ? 'bg-gray-900 border-gray-900 text-white' 
                    : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:shadow-md'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span className="font-medium">En venta</span>
              </button>
              
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full border-2 transition-all duration-200 whitespace-nowrap ${
                  getActiveFiltersCount() > 0 || isFilterOpen
                    ? 'bg-gray-900 border-gray-900 text-white' 
                    : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:shadow-md'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
                <span className="font-medium">Filtros</span>
                {getActiveFiltersCount() > 0 && (
                  <span className="bg-white text-gray-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </button>
              
              {/* Botón de Favoritos */}
              <FavoritesButton />
            </div>
            
            {/* Results count mejorado */}
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-sm text-gray-600">Mostrar:</span>
              <select
                value={filters.take}
                onChange={(e) => handleFilterChange('take', parseInt(e.target.value))}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value={12}>12 resultados</option>
                <option value={24}>24 resultados</option>
                <option value={48}>48 resultados</option>
              </select>
            </div>
          </div>
          
          {/* Advanced Filters Dropdown Mejorado */}
          {isFilterOpen && (
            <div className="mt-6 p-8 bg-white rounded-xl border border-gray-200 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Rango de precio */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Rango de precio</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Precio mínimo</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          value={filters.min_price || ''}
                          onChange={(e) => handleFilterChange('min_price', e.target.value ? parseInt(e.target.value) : undefined)}
                          placeholder="500,000"
                          className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Precio máximo</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          value={filters.max_price || ''}
                          onChange={(e) => handleFilterChange('max_price', e.target.value ? parseInt(e.target.value) : undefined)}
                          placeholder="5,000,000"
                          className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Habitaciones */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Habitaciones</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        onClick={() => handleFilterChange('bedrooms', filters.bedrooms === num ? undefined : num)}
                        className={`px-6 py-3 rounded-lg border-2 transition-all duration-200 font-medium ${
                          filters.bedrooms === num
                            ? 'bg-gray-900 border-gray-900 text-white'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:shadow-md'
                        }`}
                      >
                        {num}+ hab
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Acciones */}
                <div className="flex flex-col justify-end space-y-4">
                  <button
                    onClick={clearFilters}
                    className="px-6 py-3 text-gray-700 border-2 border-gray-300 rounded-lg hover:border-gray-400 hover:shadow-md transition-all duration-200 font-medium"
                  >
                    Limpiar todo
                  </button>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-black transition-all duration-200 font-medium"
                  >
                    Aplicar filtros
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Properties Grid con mejor padding */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <WasiPropertiesList filters={filters} />
      </div>

      {/* Inspired Section Rediseñada */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              ¿No encuentras lo que buscas?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nuestro equipo de expertos está aquí para ayudarte a encontrar el hogar perfecto. Contáctanos y encuentra exactamente lo que necesitas.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Feature 1 */}
            <div className="text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Búsqueda personalizada</h3>
              <p className="text-gray-600">Te ayudamos a encontrar exactamente lo que necesitas según tus preferencias y presupuesto</p>
            </div>
            
            {/* Feature 2 */}
            <div className="text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Propiedades verificadas</h3>
              <p className="text-gray-600">Todas nuestras propiedades están verificadas, actualizadas y listas para habitar</p>
            </div>
            
            {/* Feature 3 */}
            <div className="text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Atención personalizada</h3>
              <p className="text-gray-600">Acompañamiento completo en todo el proceso, desde la búsqueda hasta la entrega</p>
            </div>
          </div>
          
          {/* CTA Buttons Mejorados */}
          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+573017546634"
                className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Llamar ahora
              </a>
              
              <a
                href="https://wa.me/573017546634"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-white border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-200 hover:scale-105"
              >
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
} 