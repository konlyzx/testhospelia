"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import PropertyPrice from './PropertyPrice';
import { 
  getAllProperties,
  WordPressProperty,
  // WordPressZone // No se necesita cargar zonas dinámicamente
} from '@/services/wordpress';
import { extraerZonaAmigable } from '@/utils/zoneUtils';

// Variantes de animación para el contenedor
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Variantes de animación para los elementos
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

// Ya no se limita el número de propiedades
// const MAX_PROPERTIES_TO_SHOW_ON_HOME = 6;

const ZONAS_FILTRO = [
  { key: "TODAS", label: "Todas" },
  { key: "SUR", label: "Sur" },
  { key: "NORTE", label: "Norte" },
  { key: "ESTE", label: "Este" },
  { key: "OESTE", label: "Oeste" },
];

// Extender WordPressProperty para incluir la URL de la imagen obtenida vía REST
interface EnrichedWordPressProperty extends WordPressProperty {
  gallery_image_urls?: string[]; // Cambiado para almacenar múltiples URLs
}

export default function AlojamientosPropertyGrid() {
  const [properties, setProperties] = useState<WordPressProperty[]>([]);
  // const [zones, setZones] = useState<WordPressZone[]>([]); // Zonas de filtro ahora son fijas
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState('TODAS'); // Filtro de zona seleccionado

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // getAllProperties ahora devuelve las propiedades con acf.gallery ya poblado
        const propertiesData = await getAllProperties(); 

        if (propertiesData.length === 0) {
          console.warn('No se encontraron propiedades en la API para AlojamientosGrid');
        }
        setProperties(propertiesData);
        setError(null);
      } catch (err) {
        console.error('Error al cargar datos para AlojamientosGrid:', err);
        setError('No se pudieron cargar los datos desde la API de WordPress. Por favor, inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  const normalizeZone = (zoneName?: string) => {
    if (!zoneName) return "";
    return zoneName.trim().toLowerCase();
  };

  // Filtrar propiedades por zona seleccionada
  const filteredProperties = selectedZone === 'TODAS' 
    ? properties 
    : properties.filter(property => {
        let propertyZone = "";
        // Intentar obtener de ACF primero
        if (property.acf?.zone) {
          propertyZone = normalizeZone(property.acf.zone);
        } else if (property.acf?.location) { // Fallback a acf.location
          propertyZone = normalizeZone(property.acf.location);
        }
        
        // Si no está en ACF, buscar en taxonomías
        if (!propertyZone && property._embedded?.['wp:term']) {
          const terms = property._embedded['wp:term'].flat();
          const zoneTerm = terms.find(term => term.taxonomy === 'zone' || term.taxonomy === 'property_location');
          if (zoneTerm) {
            propertyZone = normalizeZone(zoneTerm.slug) || normalizeZone(zoneTerm.name);
          }
        }

        const selectedFilterZoneNormalized = normalizeZone(selectedZone);

        // Lógica de comparación: "sur" (de la API) debe coincidir con "sur" (del filtro)
        // O si la zona de la propiedad contiene la zona del filtro (ej. "zona sur" contiene "sur")
        return propertyZone.includes(selectedFilterZoneNormalized);
      });

  // Ya no se usa propertiesToDisplay, se muestran todas las filteredProperties
  // const propertiesToDisplay = filteredProperties.slice(0, MAX_PROPERTIES_TO_SHOW_ON_HOME);

  const getPropertyImage = (property: WordPressProperty) => {
    // Prioridad a la galería ACF (poblada por getAllProperties)
    if (property.acf?.gallery && property.acf.gallery.length > 0 && property.acf.gallery[0].url) {
      return property.acf.gallery[0].url;
    }
    // Fallback a featured_media_url (también debería ser poblada por getAllProperties)
    if (property.featured_media_url) {
      return property.featured_media_url;
    }
    return '/default-property.jpg'; // Imagen por defecto final
  };

  const isNewProperty = (property: WordPressProperty) => {
    if (!property.date) return false;
    const propertyDate = new Date(property.date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - propertyDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 15;
  };

  const getPropertyLocation = (property: WordPressProperty) => {
    // Primero intentar obtener la ubicación desde ACF
    if (property.acf?.location) {
      return property.acf.location;
    }
    
    // Buscar en taxonomías embebidas (property_status)
    if (property._embedded?.['wp:term']) {
      const terms = property._embedded['wp:term'].flat();
      
      // Buscar específicamente en property_status
      const statusTerm = terms.find(term => 
        term.taxonomy === 'property_status'
      );
      
      if (statusTerm && statusTerm.slug) {
        // Extraer zona del slug (ej: "zona-norte" -> "Norte")
        return extraerZonaAmigable(statusTerm.slug);
      }
      
      // Buscar en otras taxonomías de ubicación
      const locationTerm = terms.find(term => 
        term.taxonomy === 'property_location' || 
        term.taxonomy === 'zone' || 
        term.taxonomy === 'location'
      );
      
      if (locationTerm) {
        return locationTerm.name;
      }
    }
    
    // Si hay class_list, buscar ahí también
    if (property.class_list && Array.isArray(property.class_list)) {
      const statusClass = property.class_list.find((cls: string) => 
        cls.includes('property_status-zona-')
      );
      
      if (statusClass) {
        // Extraer zona del class (ej: "property_status-zona-norte" -> "Norte")
        return extraerZonaAmigable(statusClass);
      }
    }
    
    // Valor por defecto
    return 'Cali';
  };

  const getPropertyPrice = (property: WordPressProperty) => {
    if (property.acf?.price) return property.acf.price;
    if (property.price) return property.price;
    return 0;
  };

  if (loading) {
    return (
      <section className="bg-gradient-to-b from-gray-50 to-white py-10 md:py-20"> {/* Ajustado el padding */}
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              Cargando propiedades...
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Ajustado para responsive */}
            {[...Array(6)].map((_, i) => ( // Mostrar 6 esqueletos
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-80 animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-5">
                  <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-3 w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-gradient-to-b from-gray-50 to-white py-10 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              Oops! Algo salió mal.
            </h2>
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg max-w-2xl mx-auto">
              {error}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-10 md:py-20">
      <div className="container mx-auto px-4">
        {/* Filtros por zonas fijas */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {ZONAS_FILTRO.map(zona => (
            <button 
              key={zona.key}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedZone === zona.key 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
              onClick={() => setSelectedZone(zona.key)}
            >
              {zona.label}
            </button>
          ))}
        </motion.div>

        {/* Cuadrícula de propiedades */}
        {filteredProperties.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" // Grid responsive
            variants={containerVariants}
            initial="hidden"
            whileInView="visible" // O animate="visible" si prefieres que siempre se anime al scrollear
            viewport={{ once: true }}
          >
            {filteredProperties.map((property) => ( // Usar filteredProperties directamente
              <motion.div 
                key={property.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col"
                variants={itemVariants}
                whileHover={{ 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
              >
                <div className="relative">
                  {isNewProperty(property) && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-md flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        Nuevo
                      </span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 z-10">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs px-3 py-1.5 rounded-full font-medium shadow-sm">
                      {getPropertyLocation(property)}
                    </span>
                  </div>
                  <div className="relative h-56 w-full overflow-hidden group">
                    <img
                      src={getPropertyImage(property)}
                      alt={property.title.rendered}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-3">
                    <PropertyPrice 
                      price={getPropertyPrice(property)} 
                      isMonthly={true} // Asumimos mensual por defecto, se puede hacer configurable
                      className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-500"
                    />
                    <div className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {property.acf?.category || 'Apartamento'}
                    </div>
                  </div>
                  <h3 
                    className="font-bold text-gray-800 mb-3 line-clamp-2 h-12" // Asegura altura consistente para el título
                    dangerouslySetInnerHTML={{ __html: property.title.rendered }}
                  />
                  <div className="w-16 h-0.5 bg-gradient-to-r from-blue-700 to-blue-300 mb-3"></div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 mt-auto">
                    {(property.acf?.bedrooms || 0) > 0 && (
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span>{property.acf?.bedrooms} {property.acf?.bedrooms === 1 ? 'Habitación' : 'Habitaciones'}</span>
                      </div>
                    )}
                    {(property.acf?.bathrooms || 0) > 0 && (
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                        </svg>
                        <span>{property.acf?.bathrooms} {property.acf?.bathrooms === 1 ? 'Baño' : 'Baños'}</span>
                      </div>
                    )}
                  </div>
                  <Link 
                    href={`/propiedad/${property.slug}`} // Asumiendo que la URL de detalle usa el slug
                    className="group inline-flex items-center justify-center w-full text-center bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-medium py-2.5 px-4 rounded-full transition-all duration-300"
                  >
                    <span>Ver detalles</span>
                    <svg 
                      className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-gray-100">
            <p className="text-gray-600">No se encontraron propiedades para la zona seleccionada.</p>
            {selectedZone !== "TODAS" && (
              <button 
                onClick={() => setSelectedZone("TODAS")}
                className="mt-4 px-5 py-2 rounded-full text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
              >
                Mostrar todas las zonas
              </button>
            )}
          </div>
        )}
        {/* El botón "Ver más propiedades" ya no es necesario aquí */}
      </div>
    </section>
  );
} 
