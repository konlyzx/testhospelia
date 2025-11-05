'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRecommendations } from '@/contexts/RecommendationContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import type { WasiProperty } from '@/services/wasi';
import Image from 'next/image';
import Link from 'next/link';
import HeartIcon from './HeartIcon';

interface AIRecommendationsProps {
  properties: WasiProperty[];
  className?: string;
}

interface RecommendationAlgorithm {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  filter: (properties: WasiProperty[]) => WasiProperty[];
}

const PropertyCard = ({ property, isFavorite, onToggleFavorite }: {
  property: WasiProperty;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) => {
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const createSlug = (title: string, id: number) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim() + `-${id}`;
  };

  const allImages = [
    property.main_image,
    ...(property.galleries || []).flatMap((gallery) =>
      Object.values(gallery).filter(
        (item) => typeof item === "object" && item !== null && "url" in item
      )
    ),
  ].filter(Boolean);

  const getMainPrice = () => {
    if (property.for_rent === "true" && property.rent_price !== "0") {
      return {
        price: parseInt(property.rent_price),
        period: t('property.price.month'),
        type: "rent",
      };
    }
    if (property.for_sale === "true" && property.sale_price !== "0") {
      return {
        price: parseInt(property.sale_price),
        period: "",
        type: "sale",
      };
    }
    return { price: 0, period: "", type: "consult" };
  };

  const mainPrice = getMainPrice();
  const propertySlug = createSlug(property.title, property.id_property);

  return (
    <Link href={`/propiedad/${propertySlug}`}>
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 min-w-[280px] flex-shrink-0"
      >
        {/* Imagen */}
        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
            {allImages.length > 0 ? (
              <Image
                src={allImages[currentImageIndex]?.url || allImages[currentImageIndex]?.url_big || "/placeholder-property.jpg"}
                alt={property.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder-property.jpg";
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          {/* Botón de favoritos */}
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
              size={16}
              filled={isFavorite}
              className={isFavorite ? "text-white" : "text-gray-600"}
            />
          </button>

          {/* Badge de tipo */}
          <div className="absolute top-3 left-3">
            {property.for_rent === "true" && property.for_sale === "true" ? (
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
                Renta/Venta
              </span>
            ) : property.for_rent === "true" ? (
              <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
                Para Renta
              </span>
            ) : property.for_sale === "true" ? (
              <span className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
                En Venta
              </span>
            ) : null}
          </div>
        </div>

        {/* Información */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-gray-900 text-sm">
              {property.zone_label || property.city_label || "Cali"}
            </h3>
            <div className="flex items-center bg-gray-50 rounded-lg px-2 py-1">
              <svg className="w-3 h-3 text-yellow-500 fill-current" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="ml-1 text-xs text-gray-700 font-semibold">4.9</span>
            </div>
          </div>

          <h4 className="text-gray-800 font-medium text-sm mb-3 line-clamp-2">
            {property.title}
          </h4>

          {/* Características */}
          <div className="flex items-center gap-3 mb-3 text-xs text-gray-600">
            <span>
              {property.bedrooms && parseInt(property.bedrooms) > 0
                ? `${property.bedrooms} hab`
                : 'Estudio'}
            </span>
            {property.bathrooms && parseInt(property.bathrooms) > 0 && (
              <>
                <span>•</span>
                <span>{property.bathrooms} baños</span>
              </>
            )}
            {property.area && (
              <>
                <span>•</span>
                <span>{property.area}m²</span>
              </>
            )}
          </div>

          {/* Precio */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-900 font-bold text-lg">
                {mainPrice.price > 0 ? formatPrice(mainPrice.price) : 'Consultar precio'}
                {mainPrice.period && (
                  <span className="font-normal text-sm text-gray-500 ml-1">
                    {mainPrice.period}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default function AIRecommendations({ properties, className = '' }: AIRecommendationsProps) {
  const { getRecommendations, trackActivity } = useRecommendations();
  const { t } = useLanguage();
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [currentAlgorithm, setCurrentAlgorithm] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Algoritmos de recomendación dinámicos
  const algorithms: RecommendationAlgorithm[] = [
    {
      id: 'recent',
      name: 'Recién Agregadas',
      description: 'Las propiedades más nuevas en nuestra plataforma',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      filter: (props) => {
        // Ordenar por fecha de creación (más recientes primero)
        return [...props]
          .sort((a, b) => new Date(b.created_date || '').getTime() - new Date(a.created_date || '').getTime())
          .slice(0, 6);
      }
    },
    
    {
      id: 'price',
      name: 'Mejor Precio',
      description: 'Las mejores ofertas disponibles',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      filter: (props) => {
        return [...props]
          .filter(p => p.prices && p.prices.length > 0)
          .sort((a, b) => {
            const priceA = a.prices?.[0]?.price || 0;
            const priceB = b.prices?.[0]?.price || 0;
            return priceA - priceB;
          })
          .slice(0, 6);
      }
    },
    
    {
      id: 'area',
      name: 'Más Espaciosas',
      description: 'Propiedades con mayor área construida',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
      ),
      filter: (props) => {
        return [...props]
          .filter(p => parseInt(p.area || "0") > 0)
          .sort((a, b) => parseInt(b.area || "0") - parseInt(a.area || "0"))
          .slice(0, 6);
      }
    }
  ];

  useEffect(() => {
    // Cargar favoritos del localStorage
    const savedFavorites = localStorage.getItem("hospelia-favorites");
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }

    // Cambiar algoritmo automáticamente cada 10 segundos
    const interval = setInterval(() => {
      setCurrentAlgorithm((prev) => (prev + 1) % algorithms.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const toggleFavorite = (propertyId: number) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(propertyId)) {
        newFavorites.delete(propertyId);
      } else {
        newFavorites.add(propertyId);
      }
      localStorage.setItem("hospelia-favorites", JSON.stringify([...newFavorites]));
      window.dispatchEvent(new CustomEvent("favoritesUpdated"));
      return newFavorites;
    });

    trackActivity({
      type: 'favorite',
      propertyId: propertyId,
    });
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320; // Ancho de una tarjeta + gap
      const newScrollLeft = direction === 'left' 
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount;
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const currentRecommendations = algorithms[currentAlgorithm].filter(properties);

  if (currentRecommendations.length === 0) {
    return null;
  }

  return (
    <motion.section 
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="mb-8">
        {/* Header con algoritmo actual */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg">
                {algorithms[currentAlgorithm].icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {algorithms[currentAlgorithm].name}
                </h2>
                <p className="text-gray-600 text-sm">
                  {algorithms[currentAlgorithm].description}
                </p>
              </div>
            </div>
          </div>

          {/* Indicadores de algoritmo */}
          <div className="flex items-center gap-2">
            {algorithms.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentAlgorithm(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentAlgorithm 
                    ? 'bg-blue-500 w-6' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Controles de navegación */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-600 text-sm">
            {currentRecommendations.length} propiedades recomendadas
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Slider de propiedades */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          <AnimatePresence mode="popLayout">
            {currentRecommendations.map((property, index) => (
              <motion.div
                key={`${currentAlgorithm}-${property.id_property}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{ scrollSnapAlign: 'start' }}
              >
                <PropertyCard
                  property={property}
                  isFavorite={favorites.has(property.id_property)}
                  onToggleFavorite={() => toggleFavorite(property.id_property)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Badge de IA */}
      <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        IA
      </div>
    </motion.section>
  );
} 