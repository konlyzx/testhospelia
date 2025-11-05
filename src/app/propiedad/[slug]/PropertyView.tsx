"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import Chatbot from '@/app/components/Chatbot';
import { motion, AnimatePresence } from 'framer-motion';
import type { WasiProperty } from '@/services/wasi';
import { cleanDescription } from '@/utils/textUtils';

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
    rating: '4.5',
    reviews: 150,
    mobileRating: '4.75'
  });

  useEffect(() => {
    setClientSideValues({
      rating: (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1),
      reviews: Math.floor(Math.random() * 500 + 100),
      mobileRating: (Math.random() * (5.0 - 4.2) + 4.2).toFixed(2)
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

  const getPropertyPrice = () => {
    if (property.for_rent === '1' && property.rent_price) {
        return `$${parseInt(property.rent_price, 10).toLocaleString('es-CO')}`;
    }
    if (property.for_sale === '1' && property.sale_price) {
        return `$${parseInt(property.sale_price, 10).toLocaleString('es-CO')}`;
    }
    return 'Consultar precio';
  };

  const getBusinessType = () => {
    const types = [];
    if (property.for_sale === '1') types.push('Venta');
    if (property.for_rent === '1') types.push('Renta');
    return types.length > 0 ? types.join(' • ') : 'Disponible';
  };

  const handleContactClick = () => {
    const message = `Hola, estoy interesado en la propiedad "${property.title}" (ID: ${property.id_property}). ¿Podrían darme más información?`;
    const whatsappUrl = `https://wa.me/573017546634?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
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
                <Image
                  src={allImages[selectedImageIndex]?.url || '/placeholder-property.jpg'}
                  alt={property.title}
                  width={1200}
                  height={800}
                  className="object-contain w-full h-full"
                  priority
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
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
                  className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200 ${
                    selectedImageIndex === index ? 'ring-2 ring-white' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={`Vista ${index + 1}`}
                    fill
                    className="object-cover"
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
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="block sm:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <motion.button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-6 h-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: property.title,
                    text: `Mira esta propiedad en ${property.city_label}`,
                    url: window.location.href
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Enlace copiado al portapapeles');
                }
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200"
            >
              <svg className="w-6 h-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
           
          </div>
        </div>
      </div>

      <div className="hidden sm:block fixed top-28 left-0 right-50 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => router.back()}
                className="flex items-center space-x-2 p-3 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">
                  Volver
                </span>
              </motion.button>
            </div>
          </div>  
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20 sm:pt-32">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                {cleanDescription(property.title)}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-gray-600">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-medium">{property.zone_label || property.city_label}, {property.region_label}</span>
                </div>
                <span className="text-gray-400">•</span>
                <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                  <svg className="w-4 h-4 text-yellow-500 fill-current mr-1" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-semibold text-yellow-700" suppressHydrationWarning>
                    {clientSideValues.rating}
                  </span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                  ID: {property.id_property}
                </span>
              </div>
            </div>
            
            <div className="mt-4 lg:mt-0 lg:text-right">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                {getPropertyPrice()}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {getBusinessType()}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="relative mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {allImages.length > 0 ? (
            <>
              <div className="block sm:hidden">
                <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src={allImages[0]?.url || '/zona-default.jpg'}
                    alt={cleanDescription(property.title)}
                    fill
                    className="object-cover"
                    priority
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  />
                  
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                    1 / {allImages.length}
                  </div>
                  
                  <button
                    onClick={() => setShowAllPhotos(true)}
                    className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm border border-gray-200 px-3 py-2 rounded-xl font-medium text-sm flex items-center space-x-2 shadow-lg"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    <span>Ver todas</span>
                  </button>

                  <div 
                    className="absolute inset-0 cursor-pointer"
                    onClick={() => setShowAllPhotos(true)}
                  />
                </div>
              </div>

              <div className="hidden sm:grid grid-cols-4 grid-rows-2 gap-2 h-[500px] rounded-2xl overflow-hidden shadow-lg">
                <div className="col-span-2 row-span-2 relative group cursor-pointer bg-gray-200" onClick={() => setShowAllPhotos(true)}>
                  <Image
                    src={allImages[0]?.url || '/zona-default.jpg'}
                    alt={cleanDescription(property.title)}
                    fill
                    className="object-cover group-hover:scale-105 transition-all duration-500"
                    priority
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                {allImages.slice(1, 5).map((image, index) => (
                  <div 
                    key={index} 
                    className="relative group cursor-pointer bg-gray-200"
                    onClick={() => {
                      setSelectedImageIndex(index + 1);
                      setShowAllPhotos(true);
                    }}
                  >
                    <Image
                      src={image.url || '/zona-default.jpg'}
                      alt={`Vista ${index + 2}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-all duration-500"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {index === 3 && allImages.length > 5 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="text-center text-white">
                          <svg className="w-8 h-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                          </svg>
                          <span className="font-semibold">+{allImages.length - 5}</span>
                          <div className="text-sm">más fotos</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                <motion.button
                  onClick={() => setShowAllPhotos(true)}
                  className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm border border-gray-200 px-4 py-2 rounded-xl font-medium hover:bg-white hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span>Ver todas las fotos</span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-sm font-semibold">
                    {allImages.length}
                  </span>
                </motion.button>
              </div>
            </>
          ) : (
            <div className="h-64 sm:h-[500px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-lg">
              <div className="text-center text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="font-medium">Sin imágenes disponibles</p>
              </div>
            </div>
          )}
        </motion.div>

        <div className="block sm:hidden">
          <motion.div 
            className="bg-white p-4 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="mb-4">
              <h1 className="text-xl font-semibold text-gray-900 mb-2">
                {cleanDescription(property.title)}
              </h1>
              <div className="flex items-center text-gray-600 mb-2">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm">{property.zone_label || property.city_label}, {property.region_label}</span>
              </div>
              <div className="text-sm text-gray-600">
                Alojamiento entero: {getBusinessType().toLowerCase()} en {property.city_label}, Colombia
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {parseInt(property.bedrooms || '0') * 2} huéspedes · {property.bedrooms} habitaciones · {parseInt(property.bedrooms || '0') + parseInt(property.bathrooms || '0')} camas · {property.bathrooms} baños
              </div>
            </div>

            <div className="flex items-center mb-4">
              <div className="flex items-center">
                <span className="text-lg font-semibold text-gray-900" suppressHydrationWarning>
                  {clientSideValues.mobileRating}
                </span>
                <div className="flex ml-1 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="flex items-center text-gray-600">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-sm">Favorito entre huéspedes</span>
              </div>
              <div className="ml-auto text-gray-600">
                <span className="text-sm" suppressHydrationWarning>{clientSideValues.reviews} Reseñas</span>
              </div>
            </div>
             <div className="flex items-center py-4 border-t border-gray-200">
               <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mr-3">
                 <span className="text-white font-semibold text-sm">H</span>
               </div>
               <div className="flex-1">
                 <div className="font-medium text-gray-900">Anfitrión: Hospelia</div>
                 <div className="text-sm text-gray-600">Superanfitrión · 5+ años anfitrionando</div>
               </div>
             </div>
          </motion.div>

          <motion.div 
            className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="flex items-baseline mb-3">
              <span className="text-sm text-gray-600 line-through mr-2">
                ${(parseInt(property.rent_price || property.sale_price || '0') * 1.1).toLocaleString('es-CO')} COP
              </span>
              <span className="text-2xl font-bold text-gray-900">
                ${parseInt(property.rent_price || property.sale_price || '0').toLocaleString('es-CO')} COP
              </span>
            </div>
            <div className="text-sm text-gray-600 mb-4">
              X Mes
            </div>
            
             <motion.button
               onClick={handleContactClick}
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
             >
               Reserva
             </motion.button>
            
            <div className="flex items-center justify-center mt-3">
              <svg className="w-4 h-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-gray-600">Hallazgo excepcional</span>
            </div>
          </motion.div>

          {property.observations && (
            <motion.div 
              className="bg-white p-4 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-4">
                  {(() => {
                    const description = property.observations 
                      ? cleanDescription(property.observations)
                      : `Bienvenido a este hermoso ${getBusinessType().toLowerCase()} en ${property.zone_label || property.city_label}. Con ${property.bedrooms} habitaciones y ${property.bathrooms} baños, es perfecto para tu estadía. Ubicado en una zona privilegiada con fácil acceso a los principales puntos de interés de la ciudad.`;
                    
                    if (showFullDescription || description.length <= 200) {
                      return description;
                    }
                    return description.slice(0, 200) + '...';
                  })()}
                </p>
                {(() => {
                  const description = property.observations 
                    ? cleanDescription(property.observations)
                    : `Bienvenido a este hermoso ${getBusinessType().toLowerCase()} en ${property.zone_label || property.city_label}. Con ${property.bedrooms} habitaciones y ${property.bathrooms} baños, es perfecto para tu estadía. Ubicado en una zona privilegiada con fácil acceso a los principales puntos de interés de la ciudad.`;
                  
                  if (description.length > 200) {
                    return (
                      <button 
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="text-gray-900 font-medium underline"
                      >
                        {showFullDescription ? 'Mostrar menos' : 'Mostrar más'}
                      </button>
                    );
                  }
                  return null;
                })()}
              </div>
            </motion.div>
          )}

          <motion.div 
            className="bg-white p-4 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Lo que este lugar ofrece</h3>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-700 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
                <span className="text-gray-900">Wifi</span>
              </div>

              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-700 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-900">TV</span>
              </div>

              {property.furnished === 'true' && (
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-700 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7zm0 0a2 2 0 012 0m14 0a2 2 0 012 0" />
                  </svg>
                  <span className="text-gray-900">Completamente amoblado</span>
                </div>
              )}

              {property.garages && property.garages !== '0' && (
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-700 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span className="text-gray-900">Estacionamiento: {property.garages} puesto{parseInt(property.garages) > 1 ? 's' : ''}</span>
                </div>
              )}

              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-700 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="text-gray-900">Cocina equipada</span>
              </div>

              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-700 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span className="text-gray-900">Lavadora</span>
              </div>

              {property.area && (
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-700 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  <span className="text-gray-900">Área: {property.area} {property.unit_area_label}</span>
                </div>
              )}
            </div>

            {(() => {
              const features = [];
              if (property.furnished === 'true') features.push('Amoblado');
              if (property.garages && property.garages !== '0') features.push('Estacionamiento');
              if (property.area) features.push('Área especificada');
              features.push('Wifi', 'TV', 'Cocina equipada', 'Lavadora'); 
              
              const totalFeatures = features.length;
              
              if (totalFeatures > 6) {
                return (
                  <button 
                    onClick={() => setShowAllFeatures(!showAllFeatures)}
                    className="w-full mt-6 py-3 border border-gray-300 rounded-lg text-gray-900 font-medium hover:bg-gray-50 transition-colors"
                  >
                    {showAllFeatures ? 'Mostrar menos servicios' : `Mostrar los ${totalFeatures} servicios`}
                  </button>
                );
              }
              return null;
            })()}
          </motion.div>
        </div>

        <div className="hidden sm:block">
         <motion.div 
           className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16"
           initial={{ opacity: 0, y: 40 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.6 }}
         >
           <div className="lg:col-span-2 space-y-8">
             <div className="border-b border-gray-200 pb-8">
               <div className="flex items-center justify-between mb-4">
                 <div>
                   <h2 className="text-2xl font-semibold text-gray-900">
                     {getBusinessType()} en {property.zone_label || property.city_label}
                   </h2>
                   <div className="flex items-center space-x-2 text-gray-600 mt-1">
                     {property.bedrooms && (
                       <span>{property.bedrooms} habitaciones</span>
                     )}
                     {property.bathrooms && (
                       <>
                         <span>•</span>
                         <span>{property.bathrooms} baños</span>
                       </>
                     )}
                     {property.area && (
                       <>
                         <span>•</span>
                         <span>{property.area} {property.unit_area_label}</span>
                       </>
                     )}
                   </div>
                 </div>
                 <div className="text-right">
                   <div className="text-2xl font-semibold text-gray-900">{getPropertyPrice()}</div>
                   <div className="text-sm text-gray-600">ID: {property.id_property}</div>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                 {property.bedrooms && property.bedrooms !== '0' && (
                   <div className="flex items-center space-x-3">
                     <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                       <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7zm0 0a2 2 0 012 0m14 0a2 2 0 012 0" />
                       </svg>
                     </div>
                     <div>
                       <div className="font-medium text-gray-900">{property.bedrooms} habitaciones</div>
                     </div>
                   </div>
                 )}
                 
                 {property.bathrooms && property.bathrooms !== '0' && (
                   <div className="flex items-center space-x-3">
                     <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                       <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11" />
                       </svg>
                     </div>
                     <div>
                       <div className="font-medium text-gray-900">{property.bathrooms} baños</div>
                     </div>
                   </div>
                 )}

                 {property.garages && property.garages !== '0' && (
                   <div className="flex items-center space-x-3">
                     <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                       <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                       </svg>
                     </div>
                     <div>
                       <div className="font-medium text-gray-900">{property.garages} garajes</div>
                     </div>
                   </div>
                 )}
               </div>

               {(property.furnished || property.availability_label) && (
                 <div className="flex flex-wrap gap-2 pt-6">
                   {property.furnished === 'true' && (
                     <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                       Amoblado
                     </span>
                   )}
                   {property.availability_label && (
                     <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                       {property.availability_label}
                     </span>
                   )}
                   {property.property_condition_label && (
                     <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                       {property.property_condition_label}
                     </span>
                   )}
                 </div>
               )}
             </div>

             {property.observations && (
               <div className="border-b border-gray-200 pb-8">
                 <div className="relative bg-gradient-to-r from-blue-50 via-purple-50 to-teal-50 rounded-2xl p-8 border border-blue-100 overflow-hidden">
                   <div className="flex items-center mb-6">
                     <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl flex items-center justify-center mr-4">
                       <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                       </svg>
                     </div>
                     <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                       Acerca de esta propiedad
                     </h3>
                   </div>
                   <div className="space-y-6">
                     {cleanDescription(property.observations).split('\n\n').map((paragraph, index) => (
                       <div key={index} className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-sm">
                         <p className="text-gray-700 leading-8 text-lg font-medium">
                           {paragraph}
                         </p>
                       </div>
                     ))}
                   </div>
                   
                   <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-blue-200/30 to-teal-200/30 rounded-full blur-xl"></div>
                   <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-purple-200/30 to-blue-200/30 rounded-full blur-xl"></div>
                 </div>
               </div>
             )}

             <div className="border-b border-gray-200 pb-8">
               <h3 className="text-xl font-semibold text-gray-900 mb-4">Detalles de la propiedad</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {property.area && (
                   <div className="flex justify-between">
                     <span className="text-gray-600">Área total:</span>
                     <span className="font-medium">{property.area} {property.unit_area_label || 'm²'}</span>
                   </div>
                 )}
                 {property.built_area && (
                   <div className="flex justify-between">
                     <span className="text-gray-600">Área construida:</span>
                     <span className="font-medium">{property.built_area} {property.unit_built_area_label || 'm²'}</span>
                   </div>
                 )}
                 {property.private_area && (
                   <div className="flex justify-between">
                     <span className="text-gray-600">Área privada:</span>
                     <span className="font-medium">{property.private_area} {property.unit_private_area_label || 'm²'}</span>
                   </div>
                 )}
                 {property.maintenance_fee && property.maintenance_fee !== '0' && (
                   <div className="flex justify-between">
                     <span className="text-gray-600">Administración:</span>
                     <span className="font-medium">${parseInt(property.maintenance_fee).toLocaleString('es-CO')}</span>
                   </div>
                 )}
                 {property.building_date && (
                   <div className="flex justify-between">
                     <span className="text-gray-600">Año de construcción:</span>
                     <span className="font-medium">{property.building_date}</span>
                   </div>
                 )}
                 {property.floor && (
                   <div className="flex justify-between">
                     <span className="text-gray-600">Piso:</span>
                     <span className="font-medium">{property.floor}</span>
                   </div>
                 )}
               </div>
             </div>

             {property.features && (property.features.internal?.length > 0 || property.features.external?.length > 0) && (
               <div className="border-b border-gray-200 pb-8">
                 <h3 className="text-xl font-semibold text-gray-900 mb-4">Características</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {property.features.internal?.length > 0 && (
                     <div>
                       <h4 className="font-medium text-gray-900 mb-3">Internas</h4>
                       <ul className="space-y-2">
                         {property.features.internal.map((feature: any, index: number) => (
                           <li key={index} className="flex items-center text-sm text-gray-600">
                             <svg className="w-4 h-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                             </svg>
                             {feature.name || feature.nombre}
                           </li>
                         ))}
                       </ul>
                     </div>
                   )}
                   
                   {property.features.external?.length > 0 && (
                     <div>
                       <h4 className="font-medium text-gray-900 mb-3">Externas</h4>
                       <ul className="space-y-2">
                         {property.features.external.map((feature: any, index: number) => (
                           <li key={index} className="flex items-center text-sm text-gray-600">
                             <svg className="w-4 h-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                             </svg>
                             {feature.name || feature.nombre}
                           </li>
                         ))}
                       </ul>
                     </div>
                   )}
                 </div>
               </div>
             )}

             {property.latitude && property.longitude && (
               <div>
                 <h3 className="text-xl font-semibold text-gray-900 mb-4">Ubicación</h3>
                 <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center mb-4">
                   <div className="text-center text-gray-600">
                     <svg className="w-12 h-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                     </svg>
                     <p>Mapa próximamente</p>
                     <p className="text-sm mt-1">
                       Coordenadas: {property.latitude}, {property.longitude}
                     </p>
                   </div>
                 </div>
                 <p className="text-gray-600">{property.address || `${property.zone_label}, ${property.city_label}`}</p>
               </div>
             )}
           </div>

           <div className="lg:col-span-1">
             <motion.div 
               className="sticky top-24"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8, delay: 0.4 }}
             >
               <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                 <div className="text-center mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                   <div className="text-3xl font-bold text-gray-900 mb-1">
                     {getPropertyPrice()}
                   </div>
                   <div className="text-blue-600 font-semibold">
                     {getBusinessType()}
                   </div>
                 </div>

                 <div className="space-y-3 mb-6">
                   <motion.button
                     onClick={handleContactClick}
                     className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                   >
                     <svg className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                       <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                     </svg>
                     Contactar por WhatsApp
                   </motion.button>
                   
                   <motion.a
                     href={`tel:+573017546634`}
                     className="w-full bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center"
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                   >
                     <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                     </svg>
                     Llamar ahora
                   </motion.a>
                 </div>

                 <div className="flex items-center justify-center space-x-4 py-4 border-t border-gray-100">
                   <button className="flex flex-col items-center space-y-1 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200">
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                     </svg>
                     <span className="text-xs font-medium">Compartir</span>
                   </button>
                   
                   <button
                     onClick={() => toggleFavorite(property.id_property)}
                     className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-xl transition-all duration-200 ${
                       favorites.has(property.id_property)
                         ? 'text-red-500 bg-red-50'
                         : 'text-gray-600 hover:text-red-500 hover:bg-red-50'
                     }`}
                   >
                     <svg 
                       className={`w-5 h-5 ${
                         favorites.has(property.id_property) 
                           ? 'fill-current' 
                           : ''
                       }`} 
                       viewBox="0 0 24 24" 
                       stroke="currentColor"
                       fill={favorites.has(property.id_property) ? 'currentColor' : 'none'}
                     >
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                     </svg>
                     <span className="text-xs font-medium">
                       {favorites.has(property.id_property) ? 'Guardado' : 'Guardar'}
                     </span>
                   </button>
                 </div>

                 <div className="mt-4 pt-4 border-t border-gray-100">
                   <div className="text-center text-sm text-gray-600 flex items-center justify-center">
                     <svg className="w-4 h-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                     </svg>
                     <span className="font-medium">Información verificada</span>
                   </div>
                 </div>
               </div>
             </motion.div>
           </div>
         </motion.div>
        </div>
      </div>

      <PhotoGalleryModal />
      
      <Footer />
      
      <Chatbot />
    </div>
  );
} 