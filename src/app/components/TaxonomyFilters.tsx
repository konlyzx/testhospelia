"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  getTaxonomyTerms, 
  getPropertiesByTaxonomy, 
  WordPressProperty 
} from '@/services/wordpress';

// Interfaz para términos de taxonomía
interface TaxonomyTerm {
  id: number;
  name: string;
  slug: string;
  count: number;
}

// Props del componente
interface TaxonomyFiltersProps {
  onPropertiesFiltered: (properties: WordPressProperty[]) => void;
  onLoadingChange: (loading: boolean) => void;
  className?: string;
}

const TaxonomyFilters: React.FC<TaxonomyFiltersProps> = ({
  onPropertiesFiltered,
  onLoadingChange,
  className = ""
}) => {
  // Estados para los términos de taxonomías
  const [areas, setAreas] = useState<TaxonomyTerm[]>([]);
  const [types, setTypes] = useState<TaxonomyTerm[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Estados para filtros activos
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 5000000 });
  
  // Estado para mostrar/ocultar filtros en móvil
  const [showFilters, setShowFilters] = useState(false);

  // Cargar términos de taxonomías al montar el componente
  useEffect(() => {
    loadTaxonomyTerms();
  }, []);

  // Aplicar filtros cuando cambien
  useEffect(() => {
    applyFilters();
  }, [selectedArea, selectedType, priceRange]);

  // Función para cargar términos de taxonomías
  const loadTaxonomyTerms = async () => {
    try {
      setLoading(true);
      onLoadingChange(true);

      // Cargar áreas y tipos en paralelo
      const [areasData, typesData] = await Promise.all([
        getTaxonomyTerms('property_area'),
        getTaxonomyTerms('property_type')
      ]);

      setAreas(areasData);
      setTypes(typesData);

    } catch (error) {
      console.error('❌ Error cargando taxonomías:', error);
    } finally {
      setLoading(false);
      onLoadingChange(false);
    }
  };

  // Función para aplicar filtros
  const applyFilters = async () => {
    try {
      setLoading(true);
      onLoadingChange(true);

      let filteredProperties: WordPressProperty[] = [];

      // Si hay filtros específicos, usar la API de filtrado
      if (selectedArea !== 'all' || selectedType !== 'all') {
        // Priorizar el filtro más específico
        if (selectedArea !== 'all') {
          filteredProperties = await getPropertiesByTaxonomy('area', selectedArea, 50);
          
          // Si también hay filtro de tipo, filtrar localmente
          if (selectedType !== 'all') {
            filteredProperties = filteredProperties.filter(property => {
              if (property._embedded?.['wp:term']) {
                const terms = property._embedded['wp:term'].flat();
                return terms.some(term => 
                  term.taxonomy === 'property_type' && term.slug === selectedType
                );
              }
              return false;
            });
          }
        } else if (selectedType !== 'all') {
          filteredProperties = await getPropertiesByTaxonomy('type', selectedType, 50);
        }
      } else {
        // Si no hay filtros específicos, obtener todas las propiedades
        const { getAllProperties } = await import('@/services/wordpress');
        filteredProperties = await getAllProperties();
      }

      // Aplicar filtro de precio localmente
      if (priceRange.min > 0 || priceRange.max < 5000000) {
        filteredProperties = filteredProperties.filter(property => {
          const price = property.acf?.price || property.price || 0;
          return price >= priceRange.min && price <= priceRange.max;
        });
      }

      onPropertiesFiltered(filteredProperties);


    } catch (error) {
      console.error('❌ Error aplicando filtros:', error);
      onPropertiesFiltered([]);
    } finally {
      setLoading(false);
      onLoadingChange(false);
    }
  };

  // Función para limpiar filtros
  const clearFilters = () => {
    setSelectedArea('all');
    setSelectedType('all');
    setPriceRange({ min: 0, max: 5000000 });
  };

  // Función para formatear precio
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-100 ${className}`}>
      {/* Header con botón para móvil */}
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-bold text-lg text-gray-800 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filtros
        </h3>
        
        <div className="flex items-center gap-2">
          {/* Indicador de filtros activos */}
          {(selectedArea !== 'all' || selectedType !== 'all' || priceRange.min > 0 || priceRange.max < 5000000) && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              Activos
            </span>
          )}
          
          {/* Botón para móvil */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showFilters ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Contenido de filtros */}
      <AnimatePresence>
        <motion.div 
          className={`${showFilters ? 'block' : 'hidden'} md:block`}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-4 space-y-6">
            {/* Filtro por Área/Zona */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Zona
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="area"
                    value="all"
                    checked={selectedArea === 'all'}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Todas las zonas</span>
                </label>
                
                {areas.map((area) => (
                  <label key={area.id} className="flex items-center">
                    <input
                      type="radio"
                      name="area"
                      value={area.slug}
                      checked={selectedArea === area.slug}
                      onChange={(e) => setSelectedArea(e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      {area.name} {area.count > 0 && `(${area.count})`}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filtro por Tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tipo de Propiedad
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="all"
                    checked={selectedType === 'all'}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Todos los tipos</span>
                </label>
                
                {types.map((type) => (
                  <label key={type.id} className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value={type.slug}
                      checked={selectedType === type.slug}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      {type.name} {type.count > 0 && `(${type.count})`}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filtro por Rango de Precio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Rango de Precio (Mensual)
              </label>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Mínimo</label>
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Máximo</label>
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="5000000"
                    />
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={clearFilters}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Limpiar filtros
              </button>
              <button
                onClick={applyFilters}
                disabled={loading}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Aplicando...
                  </>
                ) : (
                  'Aplicar filtros'
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TaxonomyFilters;
