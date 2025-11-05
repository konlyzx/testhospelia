"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { WordPressZone } from '@/services/wordpress';
import { WavyDivider, CurvyDivider, DotPattern, CirclePattern } from './ui/Dividers';

// Imágenes por defecto para zonas (si no vienen de WordPress)
const defaultZoneImages: Record<string, string> = {
  norte: 'https://firebasestorage.googleapis.com/v0/b/hospelia-cms.appspot.com/o/images%2Fzona-norte.jpg?alt=media',
  sur: 'https://firebasestorage.googleapis.com/v0/b/hospelia-cms.appspot.com/o/images%2Fzona-sur.jpg?alt=media',
  oeste: 'https://firebasestorage.googleapis.com/v0/b/hospelia-cms.appspot.com/o/images%2Fzona-oeste.jpg?alt=media',
  centro: 'https://firebasestorage.googleapis.com/v0/b/hospelia-cms.appspot.com/o/images%2Fzona-centro.jpg?alt=media',
  default: 'https://firebasestorage.googleapis.com/v0/b/hospelia-cms.appspot.com/o/images%2Fcity-default.jpg?alt=media'
};

// Variantes para animaciones
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

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

export default function RealLocations() {
  const [zones, setZones] = useState<WordPressZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeZone, setActiveZone] = useState<number | null>(null);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  useEffect(() => {
    async function fetchZones() {
      try {
        setLoading(true);
        
        // TEMPORALMENTE COMENTADO: Cargar zonas desde WordPress (ahora usa GraphQL)
        // const zonesData = await getAllZones();
        
        // Por ahora usamos zonas estáticas hasta que se arregle GraphQL
        const zonesData: WordPressZone[] = [
          {
            id: "1",
            databaseId: 1,
            name: "Zona Norte",
            slug: "zona-norte",
            description: "Explora nuestras propiedades en Zona Norte",
            acfFields: {
              destacado: true,
              order: 1,
              description_short: "Zona residencial exclusiva con fácil acceso a centros comerciales"
            }
          },
          {
            id: "2",
            databaseId: 2,
            name: "Centro",
            slug: "centro",
            description: "Explora nuestras propiedades en Centro",
            acfFields: {
              destacado: false,
              order: 2,
              description_short: "Corazón de la ciudad con acceso a todo"
            }
          },
          {
            id: "3",
            databaseId: 3,
            name: "Sur",
            slug: "sur",
            description: "Explora nuestras propiedades en Sur",
            acfFields: {
              destacado: false,
              order: 3,
              description_short: "Zona tranquila y familiar"
            }
          }
        ];
        
        if (!zonesData || zonesData.length === 0) {
          console.warn('No se encontraron zonas en la API GraphQL');
        }
        
        // Ordenar zonas: primero las destacadas, luego por orden (si existe) o alfabéticamente
        const sortedZones = [...zonesData].sort((a, b) => {
          const aDestacado = a.acfFields?.destacado ?? false;
          const bDestacado = b.acfFields?.destacado ?? false;
          const aOrder = a.acfFields?.order;
          const bOrder = b.acfFields?.order;
          
          // Primero zonas destacadas
          if (aDestacado && !bDestacado) return -1;
          if (!aDestacado && bDestacado) return 1;
          
          // Luego por orden si existe (asegurarse que ambos sean números válidos)
          if (typeof aOrder === 'number' && typeof bOrder === 'number') {
            return aOrder - bOrder;
          }
          if (typeof aOrder === 'number') return -1; // a tiene orden, b no
          if (typeof bOrder === 'number') return 1;  // b tiene orden, a no
          
          // Finalmente por nombre
          return a.name.localeCompare(b.name);
        });
        
        setZones(sortedZones);
        setActiveZone(sortedZones.length > 0 ? sortedZones[0].databaseId : null);
        setError(null);
      } catch (err) {
        console.error('Error al cargar zonas (GraphQL):', err);
        const errorMessage = err instanceof Error ? err.message : 'No se pudieron cargar las zonas desde la API. Por favor, inténtalo de nuevo más tarde.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
    
    fetchZones();
  }, []);

  // Función para obtener la URL de la imagen de una zona
  const getZoneImage = (zone: WordPressZone): string => {
    // Intentar obtener la imagen de ACF via GraphQL
    if (zone.acfFields?.imagen?.node?.sourceUrl) {
      return zone.acfFields.imagen.node.sourceUrl;
    }
    
    // Fallback a lógica anterior con slugs e imágenes por defecto
    const slugLower = zone.slug.toLowerCase();
    for (const key in defaultZoneImages) {
      if (slugLower.includes(key) || key.includes(slugLower)) {
        return defaultZoneImages[key];
      }
    }
    
    // Imagen por defecto final
    return defaultZoneImages.default;
  };

  // Obtener la descripción corta de una zona
  const getZoneDescription = (zone: WordPressZone): string => {
    // Intentar obtener descripción corta de ACF via GraphQL
    if (zone.acfFields?.description_short) {
      return zone.acfFields.description_short;
    }
    
    // Usar la descripción principal de la taxonomía si existe
    if (zone.description) {
      return zone.description;
    }
    
    // Fallback genérico
    return `Explora nuestras propiedades en ${zone.name}`;
  };

  // Mostrar solo las primeras 6 zonas
  const displayedZones = zones.slice(0, 6);
  
  // Encontrar la zona activa usando databaseId
  const currentActiveZone = activeZone ? zones.find(z => z.databaseId === activeZone) : null;

  // Renderizar carga
  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Zonas Populares
            </h2>
            <div className="flex flex-col items-center justify-center my-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Cargando zonas disponibles...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Renderizar error
  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Zonas Populares
            </h2>
            <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl max-w-2xl mx-auto shadow-sm">
              <div className="flex items-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="font-medium">Ha ocurrido un error</span>
              </div>
              <p className="text-red-600">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white relative">
      {/* Divisor superior */}
      <WavyDivider className="-mt-16" color="text-blue-50" />
      
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <CirclePattern className="-right-20 top-40" color="text-blue-100/40" />
        <CirclePattern className="left-10 bottom-20" color="text-indigo-100/30" />
        <DotPattern className="top-0 right-0 w-1/3 h-1/3" color="text-blue-50" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 relative inline-block">
            <span className="relative z-10">Zonas Populares</span>
            <span className="absolute -bottom-2 left-0 right-0 h-3 bg-blue-100 opacity-70 z-0"></span>
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Descubre nuestros alojamientos en las mejores ubicaciones de la ciudad, todos con acabados de lujo y totalmente amoblados para tu comodidad.
          </p>
        </div>

        <div className="mb-8 flex justify-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {displayedZones.map((zone) => (
            <button
              key={`tab-${zone.id}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeZone === zone.databaseId
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveZone(zone.databaseId)}
            >
              {zone.name}
            </button>
          ))}
        </div>

        {currentActiveZone && (
          <div className="max-w-7xl mx-auto mb-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-white rounded-2xl overflow-hidden shadow-md">
              <div className="md:col-span-5 h-64 md:h-96 relative">
                <img 
                  src={getZoneImage(currentActiveZone)} 
                  alt={currentActiveZone.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h3 className="text-3xl font-bold text-white mb-2">{currentActiveZone.name}</h3>
                  <p className="text-gray-200 mb-4 line-clamp-3">{getZoneDescription(currentActiveZone)}</p>
                  <Link 
                    href={`/propiedades?zona=${currentActiveZone.slug}`}
                    className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors w-fit"
                  >

                    <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
              <div className="md:col-span-7 p-6">
                <h4 className="text-xl font-semibold text-gray-900 mb-4">Propiedades destacadas</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Limitamos a solo 2 propiedades destacadas en la vista principal */}
                  {[1, 2].map((item) => (
                    <div 
                      key={item} 
                      className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-600">{`Propiedad ${item}`}</span>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Disponible</span>
                      </div>
                      <p className="text-gray-500 text-sm">Apartamento amoblado con todas las comodidades</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <Link 
                    href={`/propiedades?zona=${currentActiveZone.slug}`}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    Ver todas las propiedades de {currentActiveZone.name} →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Limitamos a solo 3 zonas en la vista principal */}
          {displayedZones.slice(0, 3).map((zone) => (
            <motion.div 
              key={zone.id}
              variants={itemVariants}
              className="relative group"
              onMouseEnter={() => setHoveredZone(zone.id)}
              onMouseLeave={() => setHoveredZone(null)}
            >
              <Link href={`/propiedades?zona=${zone.slug}`} className="block">
                <div className="relative h-64 overflow-hidden rounded-xl shadow-md">
                  {/* Imagen con fallback */}
                  <img 
                    src={getZoneImage(zone)} 
                    alt={zone.name}
                    className={`w-full h-full object-cover transition-transform duration-700 ${
                      hoveredZone === zone.id ? 'scale-110' : ''
                    }`}
                    onError={(e) => {
                      e.currentTarget.src = defaultZoneImages.default;
                    }}
                  />
                  
                  {/* Overlay con gradiente */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  
                  {/* Contenido */}
                  <div className="absolute bottom-0 left-0 p-6 w-full">
                    <h3 className="text-white text-xl md:text-2xl font-bold mb-1">
                      {zone.name}
                    </h3>
                    <p className="text-gray-200 mb-3 text-sm line-clamp-2">
                      {getZoneDescription(zone)}
                    </p>
                 
                  </div>

                  {/* Badge destacado */}
                  {zone.acfFields?.destacado && (
                    <div className="absolute top-4 right-4 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-md">
                      Destacado
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Estadísticas de zonas */}
        <div className="mt-16 bg-blue-50 rounded-2xl p-8 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-blue-600 text-4xl font-bold mb-2">{zones.reduce((total, zone) => total + (zone.count ?? 0), 4)}</div>
              <div className="text-gray-700">Zonas disponibles</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-blue-600 text-4xl font-bold mb-2">
              <div className="text-blue-600 text-4xl font-bold mb-2">24+</div>
              </div>
              <div className="text-gray-700">Propiedades en total</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-blue-600 text-4xl font-bold mb-2">24/7</div>
              <div className="text-gray-700">Atención al cliente</div>
            </div>
          </div>
        </div>
        
        {/* Ver todas las zonas - redirecciona a la página de propiedades */}
        <div className="text-center mt-10">
          <Link 
            href="/propiedades" 
            className="inline-block px-6 py-3 bg-white text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors font-medium"
          >
          </Link>
        </div>
      </div>

      {/* Divisor inferior */}
      <WavyDivider className="transform rotate-180 mt-16" color="text-gray-50" />
    </section>
  );
} 
