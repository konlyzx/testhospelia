"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import Chatbot from '@/app/components/Chatbot';
import { motion, AnimatePresence } from 'framer-motion';
import type { WasiProperty } from '@/services/wasi';
import { cleanDescription } from '@/utils/textUtils';
import Script from 'next/script';
import { FaCheckCircle, FaWhatsapp, FaShare, FaHeart, FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaCar, FaWifi, FaTv, FaUtensils, FaTshirt, FaShieldAlt, FaUserFriends, FaRegHeart, FaArrowLeft } from 'react-icons/fa';
import PropertySafetyAndPolicy from '@/app/components/PropertySafetyAndPolicy';

// Hook para manejar favoritos optimizado
const useFavorites = () => {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window !== 'undefined') {
      const savedFavorites = localStorage.getItem('hospelia-favorites');
      if (savedFavorites) {
        try {
          setFavorites(new Set(JSON.parse(savedFavorites)));
        } catch (e) {
          console.warn('Error parsing favorites from localStorage');
        }
      }
      setIsLoaded(true);
    }
  }, []);

  const toggleFavorite = (propertyId: number) => {
    if (!isLoaded) return;

    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(propertyId)) {
        newFavorites.delete(propertyId);
      } else {
        newFavorites.add(propertyId);
      }

      try {
        localStorage.setItem('hospelia-favorites', JSON.stringify([...newFavorites]));
        window.dispatchEvent(new CustomEvent('favoritesUpdated'));
      } catch (e) {
        console.warn('Error saving to localStorage');
      }

      return newFavorites;
    });
  };

  return { favorites, toggleFavorite, isLoaded };
};

interface PropertyViewProps {
  property: WasiProperty;
}

export default function PropertyView({ property }: PropertyViewProps) {
  const router = useRouter();

  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const { favorites, toggleFavorite } = useFavorites();

  const [clientSideValues, setClientSideValues] = useState({
    rating: '4.87',
    reviews: 3,
    mobileRating: '4.87'
  });

  useEffect(() => {
    setClientSideValues({
      rating: (Math.random() * (5.0 - 4.5) + 4.5).toFixed(2),
      reviews: Math.floor(Math.random() * 20 + 3),
      mobileRating: (Math.random() * (5.0 - 4.5) + 4.5).toFixed(2)
    });
  }, []);

  const allImages = useMemo(() => {
    const images = [];
    if (property.main_image) {
      images.push({ url: property.main_image.url, id: property.main_image.id || 'main' });
    }
    if (property.galleries) {
      property.galleries.forEach(gallery => {
        Object.values(gallery).forEach((img: any) => {
          if (typeof img === 'object' && img !== null && img.url) {
            images.push({ url: img.url, id: img.id });
          }
        });
      });
    }
    return images.filter(img => img.url);
  }, [property]);

  const buildSlug = (title: string, id: number) => {
    const slug = (title || '')
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    return `${slug}-${id}`;
  };

  const structuredData = useMemo(() => {
    const price = property.for_rent === '1' && property.rent_price
      ? parseInt(property.rent_price, 10)
      : property.for_sale === '1' && property.sale_price
        ? parseInt(property.sale_price, 10)
        : undefined;

    const offer = price !== undefined ? {
      '@type': 'Offer',
      price: price,
      priceCurrency: 'COP',
      availability: 'https://schema.org/InStock'
    } : undefined;

    return {
      '@context': 'https://schema.org',
      '@type': 'RealEstateListing',
      name: property.title,
      url: `https://hospelia.co/propiedad/${buildSlug(property.title, property.id_property)}`,
      description: cleanDescription(property.description || ''),
      image: allImages.map(img => img.url),
      address: {
        '@type': 'PostalAddress',
        addressLocality: property.city_label,
        addressRegion: property.region_label,
        addressCountry: 'CO'
      },
      seller: { '@id': 'https://hospelia.co/#organization' },
      offers: offer,
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: parseFloat(clientSideValues.rating),
        reviewCount: clientSideValues.reviews
      }
    };
  }, [property, allImages, clientSideValues]);

  const getPropertyPrice = () => {
    if ((property.for_rent === 'true' || property.for_rent === '1') && property.rent_price) {
      return `$${parseInt(property.rent_price, 10).toLocaleString('es-CO')}`;
    }
    if ((property.for_sale === 'true' || property.for_sale === '1') && property.sale_price) {
      return `$${parseInt(property.sale_price, 10).toLocaleString('es-CO')}`;
    }
    return 'Consultar precio';
  };

  const getBusinessType = () => {
    const types = [];
    if (property.for_sale === 'true' || property.for_sale === '1') types.push('Venta');
    if (property.for_rent === 'true' || property.for_rent === '1') types.push('Renta');
    return types.length > 0 ? types.join(' • ') : 'Disponible';
  };

  const handleContactClick = () => {
    const message = `Hola, estoy interesado en la propiedad "${property.title}" (ID: ${property.id_property}). ¿Podrían darme más información?`;
    const whatsappUrl = `https://wa.me/573017546634?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement>,
    fallbackSrc: string
  ) => {
    if (!event.currentTarget.src.includes(fallbackSrc)) {
      event.currentTarget.src = fallbackSrc;
    }
  };

  const PhotoGalleryModal = () => {
    if (!showAllPhotos) return null;

    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 bg-black z-50 flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 text-white">
            <button
              onClick={() => setShowAllPhotos(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <span className="text-lg font-medium">
              {selectedImageIndex + 1} / {allImages.length}
            </span>
            <div className="w-10"></div>
          </div>

          {/* Main Image */}
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="relative max-w-5xl max-h-full w-full bg-gray-900 rounded-lg overflow-hidden">
              <motion.div
                key={selectedImageIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
              >
                <img
                  src={allImages[selectedImageIndex]?.url || '/placeholder-property.jpg'}
                  alt={property.title}
                  className="object-contain w-full h-full"
                  loading="eager"
                  decoding="async"
                  onError={(event) => handleImageError(event, '/placeholder-property.jpg')}
                />
              </motion.div>
            </div>
          </div>

          {/* Navigation */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={() => setSelectedImageIndex(prev => prev === 0 ? allImages.length - 1 : prev - 1)}
                className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setSelectedImageIndex(prev => prev === allImages.length - 1 ? 0 : prev + 1)}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Thumbnails */}
          <div className="p-6 overflow-x-auto">
            <div className="flex space-x-3 min-w-max">
              {allImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200 ${selectedImageIndex === index ? 'ring-2 ring-white' : 'opacity-70 hover:opacity-100'
                    }`}
                >
                  <img
                    src={image.url}
                    alt={`Vista ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    onError={(event) => handleImageError(event, '/placeholder-property.jpg')}
                  />
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Header />
      <Script
        id="schema-realestate-property"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-8">
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-6 group cursor-pointer"
        >
          <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Volver</span>
        </button>

        {/* Title Header */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-2">
                {cleanDescription(property.title)}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                <div className="flex items-center font-medium">
                  <FaMapMarkerAlt className="mr-1.5 text-gray-500" />
                  <span className="underline decoration-gray-300 underline-offset-2">
                    {property.zone_label || property.city_label}, {property.region_label}
                  </span>
                </div>
                <span className="text-gray-300">•</span>
                <span className="text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded text-xs">
                  ID: {property.id_property}
                </span>
              </div>
            </div>
            
            <div className="hidden lg:block text-right">
               <div className="flex items-center justify-end gap-3 mb-2">
                 <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-sm font-medium underline decoration-gray-300 underline-offset-2">
                   <FaShare /> Compartir
                 </button>
                 <button 
                   onClick={() => toggleFavorite(property.id_property)}
                   className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-sm font-medium underline decoration-gray-300 underline-offset-2"
                 >
                   {favorites.has(property.id_property) ? <FaHeart className="text-red-500" /> : <FaRegHeart />} 
                   {favorites.has(property.id_property) ? 'Guardado' : 'Guardar'}
                 </button>
               </div>
            </div>
          </div>
        </motion.div>

        {/* Gallery Grid - 1 Large + 4 Small */}
        <motion.div
          className="relative rounded-2xl overflow-hidden mb-10 h-[300px] sm:h-[400px] md:h-[500px]"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          {allImages.length > 0 ? (
            <div className="grid grid-cols-4 grid-rows-2 gap-2 h-full">
              {/* Main Large Image */}
              <div 
                className="col-span-4 sm:col-span-2 row-span-2 relative cursor-pointer group"
                onClick={() => setShowAllPhotos(true)}
              >
                <img
                  src={allImages[0]?.url || '/zona-default.jpg'}
                  alt={cleanDescription(property.title)}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="eager"
                  decoding="async"
                  onError={(event) => handleImageError(event, '/zona-default.jpg')}
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
              </div>

              {/* Smaller Images (Hidden on mobile, visible on sm+) */}
              {allImages.slice(1, 5).map((image, index) => (
                <div
                  key={index}
                  className={`hidden sm:block relative cursor-pointer group col-span-1 row-span-1`}
                  onClick={() => {
                    setSelectedImageIndex(index + 1);
                    setShowAllPhotos(true);
                  }}
                >
                  <img
                    src={image.url || '/zona-default.jpg'}
                    alt={`Vista ${index + 2}`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                    onError={(event) => handleImageError(event, '/zona-default.jpg')}
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
                </div>
              ))}

              {/* View All Photos Button */}
              <button
                onClick={() => setShowAllPhotos(true)}
                className="absolute bottom-4 right-4 bg-white border border-gray-800 text-gray-800 px-4 py-1.5 rounded-lg text-sm font-medium shadow-md hover:bg-gray-100 transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Mostrar todas las fotos
              </button>
            </div>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-2xl">
              <span className="text-gray-500">Sin imágenes disponibles</span>
            </div>
          )}
        </motion.div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Header Block */}
            <div className="border-b border-gray-200 pb-8 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {getBusinessType()} en {property.zone_label || property.city_label}
                </h2>
                <div className="text-gray-600 text-base mb-4">
                  {property.bedrooms || '1'} habitaciones • {property.bathrooms || '1'} Baños • {property.area ? `${property.area} M²` : ''}
                </div>
                
                {/* Pills */}
                <div className="flex flex-wrap gap-3">
                  {property.bedrooms && (
                    <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-blue-100">
                      <FaBed /> {property.bedrooms} habitaciones
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-blue-100">
                      <FaBath /> {property.bathrooms} baños
                    </div>
                  )}
                  <div className="bg-green-100 text-green-800 px-3 py-1.5 rounded-lg text-sm font-medium border border-green-200">
                    Disponible
                  </div>
                </div>
              </div>
              
              <div className="text-right hidden sm:block">
                 <div className="text-2xl font-bold text-gray-900">{getPropertyPrice()}</div>
                 <div className="text-xs text-gray-500">ID: {property.id_property}</div>
              </div>
            </div>

            {/* About Section */}
            {property.observations && (
              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Acerca de este alojamiento</h3>
                <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed">
                  <p>
                    {(() => {
                      const description = cleanDescription(property.observations);
                      if (showFullDescription || description.length <= 300) {
                        return description;
                      }
                      return description.slice(0, 300) + '...';
                    })()}
                  </p>
                  {cleanDescription(property.observations).length > 300 && (
                    <button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="mt-2 text-gray-900 font-semibold underline flex items-center gap-1"
                    >
                      {showFullDescription ? 'Mostrar menos' : 'Mostrar más'}
                      <svg className={`w-4 h-4 transition-transform ${showFullDescription ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Details Grid */}
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Detalles de la propiedad</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                {property.area && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-600 flex items-center gap-2"><FaRulerCombined className="text-gray-400"/> Área total:</span>
                    <span className="font-medium text-gray-900">{property.area} m²</span>
                  </div>
                )}
                {property.built_area && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-600 flex items-center gap-2"><FaRulerCombined className="text-gray-400"/> Área construida:</span>
                    <span className="font-medium text-gray-900">{property.built_area} m²</span>
                  </div>
                )}
                {property.floor && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-600 flex items-center gap-2"><FaCheckCircle className="text-green-500 text-xs"/> Piso:</span>
                    <span className="font-medium text-gray-900">{property.floor}</span>
                  </div>
                )}
                {property.garages && property.garages !== '0' && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-600 flex items-center gap-2"><FaCar className="text-gray-400"/> Parqueadero:</span>
                    <span className="font-medium text-gray-900">{property.garages}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-600 flex items-center gap-2"><FaCheckCircle className="text-green-500 text-xs"/> Amoblado:</span>
                  <span className="font-medium text-gray-900">{property.furnished === 'true' ? 'Sí' : 'No'}</span>
                </div>
              </div>
            </div>

            {/* Features (Internal/External) */}
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Características</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Internal */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Internas</h4>
                  <ul className="space-y-3">
                    {/* Default Features */}
                    <li className="flex items-center gap-3 text-gray-600">
                      <FaWifi className="text-green-500" /> Wifi
                    </li>
                    <li className="flex items-center gap-3 text-gray-600">
                      <FaTv className="text-green-500" /> Televisión
                    </li>
                    <li className="flex items-center gap-3 text-gray-600">
                      <FaUtensils className="text-green-500" /> Cocina equipada
                    </li>
                    <li className="flex items-center gap-3 text-gray-600">
                      <FaTshirt className="text-green-500" /> Lavadora
                    </li>
                    
                    {/* Dynamic Internal Features */}
                    {property.features?.internal?.slice(0, showAllFeatures ? undefined : 4).map((feature: any, idx: number) => (
                      <li key={`int-${idx}`} className="flex items-center gap-3 text-gray-600">
                        <FaCheckCircle className="text-green-500 flex-shrink-0" /> {feature.name || feature.nombre}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* External */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Externas</h4>
                  <ul className="space-y-3">
                    {property.features?.external?.slice(0, showAllFeatures ? undefined : 6).map((feature: any, idx: number) => (
                      <li key={`ext-${idx}`} className="flex items-center gap-3 text-gray-600">
                        <FaCheckCircle className="text-green-500 flex-shrink-0" /> {feature.name || feature.nombre}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {((property.features?.internal?.length || 0) + (property.features?.external?.length || 0) > 10) && (
                <button 
                  onClick={() => setShowAllFeatures(!showAllFeatures)}
                  className="mt-6 w-full py-3 border border-gray-900 rounded-lg font-semibold text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  {showAllFeatures ? 'Mostrar menos características' : `Mostrar las ${(property.features?.internal?.length || 0) + (property.features?.external?.length || 0)} características`}
                </button>
              )}
            </div>

            {/* Safety & Policies Side-by-Side */}
            <PropertySafetyAndPolicy />

            {/* Reviews Section - REMOVED */}

            {/* Location */}
            <div className="border-t border-gray-200 pt-8 hidden">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Ubicación</h3>
              <div className="bg-gray-100 h-64 rounded-xl flex flex-col items-center justify-center text-gray-500 mb-4 border border-gray-200">
                <FaMapMarkerAlt className="text-4xl mb-2 text-gray-400" />
                <span className="font-medium">Mapa próximamente</span>
                <span className="text-xs mt-1">Coordenadas: {property.latitude}, {property.longitude}</span>
              </div>
              <p className="text-gray-600 text-sm">
                {property.address || `${property.zone_label}, ${property.city_label}, Valle del Cauca, Colombia`}
              </p>
              <p className="text-gray-500 text-xs mt-2">
                La ubicación exacta se proporcionará después de la reserva.
              </p>
            </div>

          </div>

          {/* Right Column - Sticky Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xl shadow-gray-200/50">
                <div className="flex justify-between items-baseline mb-6">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">{getPropertyPrice()}</span>
                    <span className="text-gray-500 text-sm"> total</span>
                  </div>
                </div>

                {/* Booking Form Inputs */}
                <div className="border border-gray-300 rounded-lg overflow-hidden mb-4">
                  <div className="grid grid-cols-2 border-b border-gray-300">
                    <div className="p-3 border-r border-gray-300 cursor-pointer hover:bg-gray-50">
                      <div className="text-[10px] font-bold uppercase text-gray-800">Llegada</div>
                      <div className="text-gray-500 text-sm">Agregar fecha</div>
                    </div>
                    <div className="p-3 cursor-pointer hover:bg-gray-50">
                      <div className="text-[10px] font-bold uppercase text-gray-800">Salida</div>
                      <div className="text-gray-500 text-sm">Agregar fecha</div>
                    </div>
                  </div>
                  <div className="p-3 cursor-pointer hover:bg-gray-50 flex justify-between items-center">
                    <div>
                      <div className="text-[10px] font-bold uppercase text-gray-800">Huéspedes</div>
                      <div className="text-gray-900 text-sm">1 huésped</div>
                    </div>
                    <FaUserFriends className="text-gray-400"/>
                  </div>
                </div>

                {/* Primary CTA */}
                <button
                  onClick={handleContactClick}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-lg font-bold text-lg mb-4 transition-colors shadow-sm cursor-pointer"
                >
                  Reserva ahora
                </button>

                {/* Secondary Actions */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <a
                    href={`https://wa.me/573017546634?text=${encodeURIComponent(`Hola, estoy interesado en ${property.title}`)}`}
                    target="_blank"
                    className="flex items-center justify-center gap-2 py-2.5 border border-green-500 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors text-sm"
                  >
                    <FaWhatsapp className="text-lg" /> WhatsApp
                  </a>
                  <a
                    href="tel:+573017546634"
                    className="flex items-center justify-center gap-2 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm"
                  >
                    Llamar
                  </a>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                   <button className="flex items-center gap-2 text-gray-600 text-sm hover:text-blue-600 hover:no-underline cursor-pointer">
                     <FaShare /> Compartir
                   </button>
                   <button 
                     onClick={() => toggleFavorite(property.id_property)}
                     className="flex items-center gap-2 text-gray-600 text-sm hover:text-blue-600 hover:no-underline cursor-pointer"
                   >
                     {favorites.has(property.id_property) ? <FaHeart className="text-red-500" /> : <FaRegHeart />} Guardar
                   </button>
                </div>
                
                <div className="mt-4 flex justify-center text-xs text-green-600 font-medium items-center gap-1 bg-green-50 py-2 rounded">
                  <FaShieldAlt /> Información verificada por Hospelia
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Lead Form */}
        <div className="mt-16 bg-white border border-gray-200 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between shadow-sm">
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-bold text-gray-900 mb-2">¿Sigues buscando?</h3>
            <p className="text-gray-600">Explora más opciones en Cali o cuéntanos qué necesitas.</p>
          </div>
          <Link
            href="/alojamientos"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-sm"
          >
            Ver en Cali
          </Link>
        </div>

      </div>

      <PhotoGalleryModal />
      <Footer />
      <Chatbot />
    </div>
  );
}
