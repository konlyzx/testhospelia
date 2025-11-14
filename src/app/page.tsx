"use client";
import React, { useState, useEffect, useRef, useMemo, useCallback, lazy, Suspense } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { IoMdClose } from "react-icons/io";
import { FaWhatsapp } from "react-icons/fa";
import { WordPressProperty, getAllProperties } from "@/services/wordpress";
import { extraerZonaAmigable } from "@/utils/zoneUtils";
import PropertyPrice from "./components/PropertyPrice";
import Image from "next/image";
import DestinationCover from "./components/DestinationCover";
import type { WasiProperty } from "@/services/wasi";
import HLoader from "./components/HLoader";
import HeartIcon from "./components/HeartIcon";
import RealPropertyGrid from "./components/RealPropertyGrid";
import { trackWhatsAppConversion } from '@/utils/googleAds';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useRecommendations } from '@/contexts/RecommendationContext';

// Lazy loading para componentes no críticos
const BlogSection = lazy(() => import("./components/BlogSection"));
const Testimonials = lazy(() => import("./components/Testimonials"));
const FAQ = lazy(() => import("./components/FAQ"));
const Chatbot = lazy(() => import("./components/Chatbot"));
const AIRecommendations = lazy(() => import("./components/AIRecommendations"));
const TrustedBy = lazy(() => import("./components/TrustedBy"));

// Componente de loading optimizado
const LazyComponentLoader = () => (
  <div className="w-full h-32 bg-gray-50 animate-pulse rounded-lg flex items-center justify-center">
    <div className="text-gray-400">Cargando...</div>
  </div>
);

interface ApiResponse {
  success: boolean;
  data: {
    total: number;
    status: string;
    [key: string]: WasiProperty | number | string;
  };
  total: number;
}


const useFavorites = () => {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  useEffect(() => {
    const savedFavorites = localStorage.getItem("hospelia-favorites");
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  const toggleFavorite = (propertyId: number) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(propertyId)) {
        newFavorites.delete(propertyId);
      } else {
        newFavorites.add(propertyId);
      }
      localStorage.setItem(
        "hospelia-favorites",
        JSON.stringify([...newFavorites])
      );

      window.dispatchEvent(new CustomEvent("favoritesUpdated"));

      return newFavorites;
    });
  };

  return { favorites, toggleFavorite };
};


const FavoritesButton = () => {
  const [favoritesCount, setFavoritesCount] = useState(0);

  useEffect(() => {
    const updateFavoritesCount = () => {
      const savedFavorites = localStorage.getItem("hospelia-favorites");
      if (savedFavorites) {
        const favorites = JSON.parse(savedFavorites);
        setFavoritesCount(favorites.length);
      } else {
        setFavoritesCount(0);
      }
    };

    updateFavoritesCount();
    window.addEventListener("storage", updateFavoritesCount);
    window.addEventListener("favoritesUpdated", updateFavoritesCount);

    return () => {
      window.removeEventListener("storage", updateFavoritesCount);
      window.removeEventListener("favoritesUpdated", updateFavoritesCount);
    };
  }, []);

  if (favoritesCount === 0) {
    return null;
  }

  return (
    <Link href="/favoritos">
      <button className="relative flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-full hover:border-gray-400 hover:shadow-md transition-all duration-200">
        <svg
          className="w-5 h-5 text-red-500"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <span className="text-sm font-medium text-gray-700">Favoritos</span>
        {favoritesCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {favoritesCount}
          </span>
        )}
      </button>
    </Link>
  );
};


const PropertyCard = ({
  property,
  isFavorite,
  onToggleFavorite,
}: {
  property: WasiProperty;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) => {
  const { t } = useLanguage();
  const { formatPrice: formatPriceCurrency } = useCurrency();
  const { trackActivity } = useRecommendations();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const allImages = [
    property.main_image,
    ...(property.galleries || []).flatMap((gallery) =>
      Object.values(gallery).filter(
        (item) => typeof item === "object" && item !== null && "url" in item
      )
    ),
  ].filter(Boolean);

  const formatPrice = (price: string, priceLabel: string) => {
    if (!price || price === "0") return "Consultar precio";
    return priceLabel || `$${parseInt(price).toLocaleString("es-CO")}`;
  };

  const getMainPrice = () => {
    if (property.for_rent === "true" && property.rent_price !== "0") {
      return {
        price: formatPriceCurrency(parseInt(property.rent_price)),
        period: t('property.price.month'),
        type: "rent",
      };
    }
    if (property.for_sale === "true" && property.sale_price !== "0") {
      return {
        price: formatPriceCurrency(parseInt(property.sale_price)),
        period: "",
        type: "sale",
      };
    }
    return { price: t('property.price.consult'), period: "", type: "consult" };
  };

  const mainPrice = getMainPrice();

  const createSlug = (title: string, id: number) => {
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    return `${slug}-${id}`;
  };

  const propertySlug = createSlug(property.title, property.id_property);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + allImages.length) % allImages.length
    );
  };

  return (
    <Link href={`/propiedad/${propertySlug}`}>
      <div
        className="group cursor-pointer transition-all duration-500 ease-out"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl hover:border-gray-200 transition-all duration-500 hover:-translate-y-2">
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
              {allImages.length > 0 ? (
                <>
                  <Image
                    src={
                      allImages[currentImageIndex]?.url ||
                      allImages[currentImageIndex]?.url_big ||
                      "/placeholder-property.jpg"
                    }
                    alt={property.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-property.jpg";
                    }}
                  />

                  {/* Overlay gradient sutil */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Navegación de imágenes mejorada */}
                  {allImages.length > 1 && isHovered && (
                    <>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          prevImage();
                        }}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-3 shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
                      >
                        <svg
                          className="w-5 h-5 text-gray-700"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          nextImage();
                        }}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-3 shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
                      >
                        <svg
                          className="w-5 h-5 text-gray-700"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </>
                  )}

                  {/* Dots indicadores mejorados */}
                  {allImages.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {allImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setCurrentImageIndex(index);
                          }}
                          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                            index === currentImageIndex
                              ? "bg-white shadow-lg scale-125"
                              : "bg-white/60 hover:bg-white/80 hover:scale-110"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Botón de favoritos mejorado */}
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
                size={20}
                filled={isFavorite}
                className={isFavorite ? "text-white" : "text-gray-600"}
              />
            </button>

            {/* Badge de tipo de propiedad */}
            <div className="absolute top-4 left-4">
              {property.for_rent === "true" && property.for_sale === "true" ? (
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm">
                  Renta/Venta
                </span>
              ) : property.for_rent === "true" ? (
                <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm">
                  Para Renta
                </span>
              ) : property.for_sale === "true" ? (
                <span className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm">
                  En Venta
                </span>
              ) : null}
            </div>
          </div>

          {/* Información de la propiedad mejorada */}
          <div className="p-10">
            {/* Header con ubicación y rating */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-xl mb-2 leading-tight">
                  {property.zone_label || property.city_label || "Cali"}
                </h3>
                <p className="text-gray-600 text-base font-medium">Colombia</p>
              </div>
              <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 ml-3">
                <svg
                  className="w-5 h-5 text-yellow-500 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="ml-2 text-base text-gray-700 font-semibold">
                  4.9
                </span>
              </div>
            </div>

            {/* Título de la propiedad */}
            <h4
              className="text-gray-800 font-semibold text-lg mb-4 leading-tight overflow-hidden"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {property.title}
            </h4>

            {/* Características con iconos mejorados */}
            <div className="flex items-center gap-5 mb-5">
              <div className="flex items-center text-gray-600">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mr-3">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7zm0 0a2 2 0 012 0m14 0a2 2 0 012 0"
                    />
                  </svg>
                </div>
                <span className="text-base font-medium">
                  {property.bedrooms && parseInt(property.bedrooms) > 0
                    ? `${property.bedrooms} hab`
                    : "Estudio"}
                </span>
              </div>

              {property.bathrooms && parseInt(property.bathrooms) > 0 && (
                <div className="flex items-center text-gray-600">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mr-3">
                    <svg
                      className="w-5 h-5 text-purple-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                      />
                    </svg>
                  </div>
                  <span className="text-base font-medium">
                    {property.bathrooms} baños
                  </span>
                </div>
              )}

              {property.area && (
                <div className="flex items-center text-gray-600">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mr-3">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                      />
                    </svg>
                  </div>
                  <span className="text-base font-medium">
                    {property.area}m²
                  </span>
                </div>
              )}
            </div>

            {/* Precio destacado */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900 font-bold text-2xl">
                  {mainPrice.price}
                  {mainPrice.period && (
                    <span className="font-normal text-lg text-gray-500 ml-1">
                      {mainPrice.period}
                    </span>
                  )}
                </p>
                {mainPrice.type === "rent" && (
                  <p className="text-gray-500 text-base mt-1">
                    Precio por Mes
                  </p>
                )}
              </div>

              {/* Botón CTA sutil */}
              <button className="ml-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-7 py-3 rounded-xl font-semibold text-base transition-all duration-300 hover:shadow-lg hover:scale-105 opacity-0 group-hover:opacity-100">
                Ver detalles
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Componente para vista de lista
const PropertyListItem = ({
  property,
  isFavorite,
  onToggleFavorite,
}: {
  property: WasiProperty;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) => {
  const { t } = useLanguage();
  const { formatPrice: formatPriceCurrency } = useCurrency();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Obtener todas las imágenes disponibles
  const allImages = [
    property.main_image,
    ...(property.galleries || []).flatMap((gallery) =>
      Object.values(gallery).filter(
        (item) => typeof item === "object" && item !== null && "url" in item
      )
    ),
  ].filter(Boolean);

  const formatPrice = (price: string, priceLabel: string) => {
    if (!price || price === "0") return "Consultar precio";
    return priceLabel || `$${parseInt(price).toLocaleString("es-CO")}`;
  };

  const getMainPrice = () => {
    if (property.for_rent === "true" && property.rent_price !== "0") {
      return {
        price: formatPriceCurrency(parseInt(property.rent_price)),
        period: t('property.price.month'),
        type: "rent",
      };
    }
    if (property.for_sale === "true" && property.sale_price !== "0") {
      return {
        price: formatPriceCurrency(parseInt(property.sale_price)),
        period: "",
        type: "sale",
      };
    }
    return { price: t('property.price.consult'), period: "", type: "consult" };
  };

  const mainPrice = getMainPrice();

  const createSlug = (title: string, id: number) => {
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    return `${slug}-${id}`;
  };

  const propertySlug = createSlug(property.title, property.id_property);

  return (
    <Link href={`/propiedad/${propertySlug}`}>
      <div className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl hover:border-gray-200 transition-all duration-500 hover:-translate-y-1">
        <div className="flex flex-col lg:flex-row">
          {/* Sección de imagen - más grande en vista lista */}
          <div className="relative lg:w-[400px] lg:flex-shrink-0">
            <div className="relative aspect-[4/3] lg:aspect-[5/4] lg:h-[320px] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
              {allImages.length > 0 ? (
                <>
                  <Image
                    src={
                      allImages[currentImageIndex]?.url ||
                      allImages[currentImageIndex]?.url_big ||
                      "/placeholder-property.jpg"
                    }
                    alt={property.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-property.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <svg
                    className="w-20 h-20 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
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
                size={20}
                filled={isFavorite}
                className={isFavorite ? "text-white" : "text-gray-600"}
              />
            </button>

            {/* Badge de tipo de propiedad */}
            <div className="absolute top-4 left-4">
              {property.for_rent === "true" && property.for_sale === "true" ? (
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm">
                  Renta/Venta
                </span>
              ) : property.for_rent === "true" ? (
                <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm">
                  Para Renta
                </span>
              ) : property.for_sale === "true" ? (
                <span className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm">
                  En Venta
                </span>
              ) : null}
            </div>
          </div>

          {/* Información de la propiedad - layout horizontal */}
          <div className="flex-1 p-8 lg:p-10 flex flex-col justify-between lg:min-h-[320px]">
            {/* Sección superior */}
            <div>
              <div className="flex justify-between items-start mb-4">
                {/* Ubicación y rating */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900 text-2xl">
                      {property.zone_label || property.city_label || "Cali"}
                    </h3>
                    <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 ml-4">
                      <svg
                        className="w-5 h-5 text-yellow-500 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span className="ml-2 text-base text-gray-700 font-semibold">
                        4.9
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-base font-medium mb-1">
                    Colombia
                  </p>
                </div>
              </div>

              {/* Título de la propiedad */}
              <h4 className="text-gray-800 font-semibold text-xl mb-4 leading-tight">
                {property.title}
              </h4>

              {/* Características en una sola línea */}
              <div className="flex items-center gap-8 mb-6">
                <div className="flex items-center text-gray-600">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mr-3">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7zm0 0a2 2 0 012 0m14 0a2 2 0 012 0"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="text-base font-semibold text-gray-900">
                      {property.bedrooms && parseInt(property.bedrooms) > 0
                        ? `${property.bedrooms}`
                        : "0"}
                    </span>
                    <span className="text-sm text-gray-600 ml-1">
                      {property.bedrooms && parseInt(property.bedrooms) > 0
                        ? "habitaciones"
                        : "estudio"}
                    </span>
                  </div>
                </div>

                {property.bathrooms && parseInt(property.bathrooms) > 0 && (
                  <div className="flex items-center text-gray-600">
                    <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mr-3">
                      <svg
                        className="w-5 h-5 text-purple-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                        />
                      </svg>
                    </div>
                    <div>
                      <span className="text-base font-semibold text-gray-900">
                        {property.bathrooms}
                      </span>
                      <span className="text-sm text-gray-600 ml-1">baños</span>
                    </div>
                  </div>
                )}

                {property.area && (
                  <div className="flex items-center text-gray-600">
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mr-3">
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                        />
                      </svg>
                    </div>
                    <div>
                      <span className="text-base font-semibold text-gray-900">
                        {property.area}
                      </span>
                      <span className="text-sm text-gray-600 ml-1">m²</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Precio y botón de acción - Sección inferior */}
            <div className="flex items-center justify-between mt-auto">
              <div>
                <p className="text-gray-900 font-bold text-3xl">
                  {mainPrice.price}
                  {mainPrice.period && (
                    <span className="font-normal text-xl text-gray-500 ml-2">
                      {mainPrice.period}
                    </span>
                  )}
                </p>
                {mainPrice.type === "rent" && (
                  <p className="text-gray-500 text-base mt-1">
                    Precio por mes
                  </p>
                )}
              </div>

              {/* Botón CTA más prominente */}
              <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold text-base transition-all duration-300 hover:shadow-lg hover:scale-105">
                Ver detalles
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function Home() {
  const { t } = useLanguage();
  const { trackActivity } = useRecommendations();
  const [properties, setProperties] = useState<WasiProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const { favorites, toggleFavorite: basToggleFavorite } = useFavorites();

  // Wrapper para toggleFavorite que incluye tracking
  const toggleFavorite = (propertyId: number) => {
    const wasFavorite = favorites.has(propertyId);
    basToggleFavorite(propertyId);
    
    if (!wasFavorite) {
      // Solo trackear cuando se agrega a favoritos
      trackActivity({
        type: 'favorite',
        propertyId: propertyId,
      });
    }
  };

  // Filtros para la búsqueda
  const [filters, setFilters] = useState({
    search: "",
    for_rent: false,
    for_sale: false,
    min_price: undefined as number | undefined,
    max_price: undefined as number | undefined,
    bedrooms: undefined as number | undefined,
    sorting: "date_desc" as string,
  });

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      
      // Construir parámetros para la API
      const params = new URLSearchParams({
        city: "132", // ID de Cali
        availability: "1", // Disponibles
        scope: "3", // Scope público
        take: "50", // Cantidad de propiedades
        order: "desc",
        order_by: "created_at"
      });

      const response = await fetch(`/api/wasi/properties?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      if (data.success && data.data) {
        const propertiesArray = Object.entries(data.data)
          .filter(([key]) => !["total", "status"].includes(key))
          .map(([, value]) => value as WasiProperty);

        setProperties(propertiesArray);
        setTotal(data.total || propertiesArray.length);
      } else {
        console.warn("⚠️ No se encontraron propiedades", data);
        setProperties([]);
        setTotal(0);
      }
    } catch (err) {
      console.error("❌ Error al cargar propiedades:", err);
      setError(
        "No se pudieron cargar las propiedades. Por favor, recarga la página."
      );
      setProperties([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // useEffect para cargar propiedades al montar el componente
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Funciones auxiliares definidas antes de los hooks memoizados
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.min_price) count++;
    if (filters.max_price) count++;
    if (filters.bedrooms) count++;
    return count;
  };

  const sortProperties = (properties: WasiProperty[]) => {
    return [...properties].sort((a, b) => {
      switch (filters.sorting) {
        case "price_asc":
          // Obtener el precio principal de cada propiedad
          const getPriceValue = (property: WasiProperty) => {
            if (property.for_rent === "true" && property.rent_price && property.rent_price !== "0") {
              return parseFloat(property.rent_price);
            }
            if (property.for_sale === "true" && property.sale_price && property.sale_price !== "0") {
              return parseFloat(property.sale_price);
            }
            return 0;
          };
          
          const priceA = getPriceValue(a);
          const priceB = getPriceValue(b);
          
          // Si ambos precios son 0, mantener orden original
          if (priceA === 0 && priceB === 0) return 0;
          // Si uno es 0, ponerlo al final
          if (priceA === 0) return 1;
          if (priceB === 0) return -1;
          
          return priceA - priceB;
          
        case "price_desc":
          const getPriceValueDesc = (property: WasiProperty) => {
            if (property.for_rent === "true" && property.rent_price && property.rent_price !== "0") {
              return parseFloat(property.rent_price);
            }
            if (property.for_sale === "true" && property.sale_price && property.sale_price !== "0") {
              return parseFloat(property.sale_price);
            }
            return 0;
          };
          
          const priceA2 = getPriceValueDesc(a);
          const priceB2 = getPriceValueDesc(b);
          
          // Si ambos precios son 0, mantener orden original
          if (priceA2 === 0 && priceB2 === 0) return 0;
          // Si uno es 0, ponerlo al final
          if (priceA2 === 0) return 1;
          if (priceB2 === 0) return -1;
          
          return priceB2 - priceA2;
          
        case "date_desc":
        default:
          // Ordenar por fecha de creación, más recientes primero
          const dateA = new Date(a.created_at || '').getTime();
          const dateB = new Date(b.created_at || '').getTime();
          
          // Si no hay fechas válidas, usar ID como fallback (ID más alto = más reciente)
          if (!dateA && !dateB) {
            return b.id_property - a.id_property;
          }
          if (!dateA) return 1;
          if (!dateB) return -1;
          
          return dateB - dateA;
      }
    });
  };

  // Aplicar filtros a las propiedades
  const filteredProperties = useMemo(() => {
    let filtered = [...properties];

    // Filtro por tipo de negocio
    if (filters.for_rent && !filters.for_sale) {
      filtered = filtered.filter(property => property.for_rent === "true");
    } else if (filters.for_sale && !filters.for_rent) {
      filtered = filtered.filter(property => property.for_sale === "true");
    } else if (filters.for_rent && filters.for_sale) {
      filtered = filtered.filter(property => 
        property.for_rent === "true" || property.for_sale === "true"
      );
    }

    // Filtro por habitaciones
    if (filters.bedrooms) {
      filtered = filtered.filter(property => {
        const bedrooms = parseInt(property.bedrooms || "0");
        return bedrooms >= filters.bedrooms!;
      });
    }

    // Filtro por precio
    if (filters.min_price || filters.max_price) {
      filtered = filtered.filter(property => {
        let price = 0;
        
        // Obtener el precio principal
        if (property.for_rent === "true" && property.rent_price && property.rent_price !== "0") {
          price = parseInt(property.rent_price);
        } else if (property.for_sale === "true" && property.sale_price && property.sale_price !== "0") {
          price = parseInt(property.sale_price);
        }

        if (price === 0) return false; // Excluir propiedades sin precio

        const meetsMin = !filters.min_price || price >= filters.min_price;
        const meetsMax = !filters.max_price || price <= filters.max_price;
        
        return meetsMin && meetsMax;
      });
    }

    return filtered;
  }, [properties, filters.for_rent, filters.for_sale, filters.bedrooms, filters.min_price, filters.max_price]);

  // Memoizar las propiedades ordenadas
  const sortedProperties = useMemo(() => {
    return sortProperties(filteredProperties);
  }, [filteredProperties, filters.sorting]);

  // Memoizar el conteo de filtros activos
  const activeFiltersCount = useMemo(() => {
    return getActiveFiltersCount();
  }, [filters]);

  // Callbacks memoizados para evitar re-renders
  const handleFilterChange = useCallback((key: keyof typeof filters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      search: "",
      for_rent: false,
      for_sale: false,
      min_price: undefined,
      max_price: undefined,
      bedrooms: undefined,
      sorting: "date_desc",
    });
  }, []);

  const whatsappLink = `https://wa.me/573017546634?text=${encodeURIComponent("Hola, me interesa conocer más sobre sus propiedades en Cali.")}`;

  return (
    <div className="bg-white min-h-screen">
      <Header />

      <div className="relative pt-24 sm:pt-20 lg:pt-24 pb-10 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <div className="inline-flex items-center px-4 py-2 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full text-white/90 text-xs font-semibold mb-4">Vive mejor en Cali</div>
                <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">{t('home.hero.title')} <span className="text-blue-200">{t('home.hero.highlight')}</span></h1>
                <p className="mt-4 text-white/90 text-lg max-w-xl">{t('home.hero.subtitle')}</p>
                <div className="mt-6 flex items-center gap-4">
                  <div className="flex items-center text-white/90"><svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Propiedades verificadas</div>
                  <div className="flex items-center text-white/90"><svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m4 0h-1V9a2 2 0 00-2-2H9m4 0h1a2 2 0 012 2v3m-6 4h6" /></svg>Reserva segura</div>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="mt-8 bg-white rounded-2xl shadow-2xl border border-white/20 p-3">
                <div className="flex flex-col lg:flex-row gap-2">
                  <div className="flex-1 px-4 py-3 rounded-xl bg-gray-50">
                    <label className="text-xs font-bold text-gray-900">Destino</label>
                    <select id="destino" name="destino" value={filters.search} onChange={(e) => handleFilterChange('search', e.target.value)} className="w-full text-sm font-medium bg-transparent border-none outline-none">
                      <option value="">Explora destinos</option>
                      <option value="Cali">Cali</option>
                    </select>
                  </div>
                  <div className="flex-1 px-4 py-3 rounded-xl bg-gray-50">
                    <label className="text-xs font-bold text-gray-900">Habitaciones</label>
                    <select id="habitaciones" name="habitaciones" value={filters.bedrooms || ''} onChange={(e) => handleFilterChange('bedrooms', e.target.value ? parseInt(e.target.value) : undefined)} className="w-full text-sm font-medium bg-transparent border-none outline-none">
                      <option value="">¿Cuántas?</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3+</option>
                    </select>
                  </div>
                  <div className="flex-1 px-4 py-3 rounded-xl bg-gray-50">
                    <label className="text-xs font-bold text-gray-900">Presupuesto</label>
                    <select id="presupuesto" name="presupuesto" value={filters.min_price === 2800000 && filters.max_price === 3600000 ? '2800000-3600000' : filters.min_price === 4000000 ? '4000000+' : ''} onChange={(e) => { const value = e.target.value; if (value === '2800000-3600000') { handleFilterChange('min_price', 2800000); handleFilterChange('max_price', 3600000); } else if (value === '4000000+') { handleFilterChange('min_price', 4000000); handleFilterChange('max_price', undefined); } else { handleFilterChange('min_price', undefined); handleFilterChange('max_price', undefined); } }} className="w-full text-sm font-medium bg-transparent border-none outline-none">
                      <option value="">¿Cuánto?</option>
                      <option value="2800000-3600000">$2.8M - $3.6M</option>
                      <option value="4000000+">$4.0M+</option>
                    </select>
                  </div>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} onClick={() => { const s = document.querySelector('[data-results-section]'); if (s) s.scrollIntoView({ behavior: 'smooth' }); }} className="w-full lg:w-auto px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold">Buscar</motion.button>
                </div>
              </motion.div>
            </div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative h-56 rounded-2xl overflow-hidden shadow-xl"><Image src="/zona-default.jpg" alt="Alojamiento 1" fill className="object-cover" /></div>
                <div className="relative h-56 rounded-2xl overflow-hidden shadow-xl"><Image src="/zona-default.jpg" alt="Alojamiento 2" fill className="object-cover" /></div>
                <div className="relative h-56 rounded-2xl overflow-hidden shadow-xl col-span-2"><Image src="/zona-default.jpg" alt="Alojamiento 3" fill className="object-cover" /></div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Hero Section con slider de banners y filtros estilo Airbnb */}
      <div className="hidden relative pt-24 sm:pt-20 lg:pt-24 pb-8 sm:pb-12 lg:pb-16 hero-gradient">
        
            {/* Overlay oscuro para legibilidad */}
            <div className="absolute inset-0 bg-black/30" />
          

        {/* Contenido del hero - Mejorado para móvil */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[45vh] sm:min-h-[50vh] px-4 sm:px-6 lg:px-8">
          {/* Título principal */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white/90 text-sm font-semibold mb-6">
              ✨ Encuentra tu hogar perfecto en Cali
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 leading-tight">
              {t('home.hero.title')} <span className="text-blue-300">{t('home.hero.highlight')}</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              {t('home.hero.subtitle')}
            </p>
          </motion.div>

          {/* Box de filtros estilo Airbnb */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative mx-auto max-w-4xl w-full"
          >
            {/* Backdrop con blur */}
            <div className="absolute inset-0 bg-white/20 backdrop-blur-md rounded-full shadow-2xl" />
            
            {/* Contenedor principal */}
            <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl lg:rounded-full shadow-2xl border border-gray-200/50 p-2">
              <div className="flex flex-col lg:flex-row items-center gap-2 lg:gap-0">
                
                {/* Campo Dónde */}
                <div className="flex-1 px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-50/80 rounded-xl lg:rounded-full transition-colors cursor-pointer group w-full lg:w-auto">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-900 uppercase tracking-wide bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                      {t('home.search.where')}
                    </label>
                                          <select
                        value={filters.search}
                        onChange={(e) => handleFilterChange("search", e.target.value)}
                        className="w-full text-sm font-medium text-gray-800 bg-transparent border-none outline-none cursor-pointer mobile-select"
                      >
                      <option value="">Explora destinos</option>
                      <option value="Cali">Cali</option>
                    </select>
                  </div>
                </div>

                {/* Separador */}
                <div className="hidden lg:block w-px h-8 bg-gray-300/70" />

                {/* Campo Habitaciones */}
                <div className="flex-1 px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-50/80 rounded-xl lg:rounded-full transition-colors cursor-pointer group w-full lg:w-auto">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-900 uppercase tracking-wide bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                      Habitaciones
                    </label>
                                          <select
                        value={filters.bedrooms || ""}
                        onChange={(e) => handleFilterChange("bedrooms", e.target.value ? parseInt(e.target.value) : undefined)}
                        className="w-full text-sm font-medium text-gray-800 bg-transparent border-none outline-none cursor-pointer mobile-select"
                      >
                      <option value="">¿Cuántas?</option>
                      <option value="1">1 habitación</option>
                      <option value="2">2 habitaciones</option>
                      <option value="3">3+ habitaciones</option>
                    </select>
                  </div>
                </div>

                {/* Separador */}
                <div className="hidden lg:block w-px h-8 bg-gray-300/70" />

                {/* Campo Presupuesto */}
                <div className="flex-1 px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-50/80 rounded-xl lg:rounded-full transition-colors cursor-pointer group w-full lg:w-auto">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-900 uppercase tracking-wide bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                      Presupuesto
                    </label>
                    <select
                      value={
                        filters.min_price === 2800000 && filters.max_price === 3600000 
                          ? "2800000-3600000" 
                          : filters.min_price === 4000000 
                          ? "4000000+" 
                          : ""
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "2800000-3600000") {
                          handleFilterChange("min_price", 2800000);
                          handleFilterChange("max_price", 3600000);
                        } else if (value === "4000000+") {
                          handleFilterChange("min_price", 4000000);
                          handleFilterChange("max_price", undefined);
                        } else {
                          handleFilterChange("min_price", undefined);
                          handleFilterChange("max_price", undefined);
                        }
                      }}
                      className="w-full text-sm font-medium text-gray-800 bg-transparent border-none outline-none cursor-pointer appearance-none"
                    >
                      <option value="">¿Cuánto?</option>
                      <option value="2800000-3600000">$2.8M - $3.6M</option>
                      <option value="4000000+">$4.0M+</option>
                    </select>
                  </div>
                </div>

                {/* Separador */}
                <div className="hidden lg:block w-px h-8 bg-gray-300/70" />

                {/* Botón de búsqueda */}
                <motion.button
                  onClick={() => {
                    // Scroll hacia los resultados
                    const resultsSection = document.querySelector('[data-results-section]');
                    if (resultsSection) {
                      resultsSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-3 lg:mt-0 lg:ml-2 w-full lg:w-auto bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white p-3 lg:p-4 rounded-xl lg:rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 32 32" 
                    className="w-4 h-4 lg:mr-0 sm:mr-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                  >
                    <path d="M13 24a11 11 0 1 0 0-22 11 11 0 0 0 0 22zm8-3 9 9" />
                  </svg>
                  <span className="lg:hidden sm:inline text-sm font-semibold">Buscar</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Explora destinos</h2>
            <Link href="/destinos" className="text-blue-600 font-semibold">Ver todos</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/destinos/apartamentos-en-el-sur-de-cali" className="group relative rounded-2xl overflow-hidden bg-gray-100 h-40">
              <DestinationCover slug="apartamentos-en-el-sur-de-cali" title="Sur de Cali" />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-3 left-3 text-white font-semibold">Sur de Cali</div>
            </Link>
            <Link href="/destinos/apartamentos-por-dias-en-cali" className="group relative rounded-2xl overflow-hidden bg-gray-100 h-40">
              <DestinationCover slug="apartamentos-por-dias-en-cali" title="Por días" />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-3 left-3 text-white font-semibold">Por días</div>
            </Link>
            <Link href="/destinos/apartamentos-en-bochalema" className="group relative rounded-2xl overflow-hidden bg-gray-100 h-40">
              <DestinationCover slug="apartamentos-en-bochalema" title="Bochalema" />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-3 left-3 text-white font-semibold">Bochalema</div>
            </Link>
            <Link href="/destinos/apartamentos-cerca-de-univalle" className="group relative rounded-2xl overflow-hidden bg-gray-100 h-40">
              <DestinationCover slug="apartamentos-cerca-de-univalle" title="Cerca de Univalle" />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-3 left-3 text-white font-semibold">Cerca de Univalle</div>
            </Link>
          </div>
        </div>
      </div>
      {/* Filter Bar Estilo Airbnb */}
      <div className="" style={{ top: '80px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            {/* Filter Tabs Mejorados */}
            <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-hide">
              <button
                onClick={() => {
                  handleFilterChange("for_rent", false);
                  handleFilterChange("for_sale", false);
                }}
                className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-full border-2 transition-all duration-200 whitespace-nowrap text-sm ${
                  !filters.for_rent && !filters.for_sale
                    ? "bg-gray-900 border-gray-900 text-white"
                    : "border-gray-300 text-gray-700 hover:border-gray-400 hover:shadow-md"
                }`}
              >
                <span className="font-medium">Todos</span>
              </button>

              <button
                onClick={() => {
                  handleFilterChange("for_rent", true);
                  handleFilterChange("for_sale", false);
                }}
                className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-full border-2 transition-all duration-200 whitespace-nowrap text-sm ${
                  filters.for_rent && !filters.for_sale
                    ? "bg-gray-900 border-gray-900 text-white"
                    : "border-gray-300 text-gray-700 hover:border-gray-400 hover:shadow-md"
                }`}
              >
                <svg
                  className="w-3 sm:w-4 h-3 sm:h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7zm0 0a2 2 0 012 0m14 0a2 2 0 012 0"
                  />
                </svg>
                <span className="font-medium hidden sm:inline">Para renta</span>
                <span className="font-medium sm:hidden">Renta</span>
              </button>

              <button
                onClick={() => {
                  handleFilterChange("for_sale", true);
                  handleFilterChange("for_rent", false);
                }}
                className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-full border-2 transition-all duration-200 whitespace-nowrap text-sm ${
                  filters.for_sale && !filters.for_rent
                    ? "bg-gray-900 border-gray-900 text-white"
                    : "border-gray-300 text-gray-700 hover:border-gray-400 hover:shadow-md"
                }`}
              >
                <svg
                  className="w-3 sm:w-4 h-3 sm:h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
                <span className="font-medium hidden sm:inline">En venta</span>
                <span className="font-medium sm:hidden">Venta</span>
              </button>
              
              {/* Botón para limpiar filtros principales */}
              {(filters.min_price || filters.max_price || filters.bedrooms || filters.for_rent || filters.for_sale) && (
                <button
                  onClick={clearFilters}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-full hover:border-gray-400 hover:shadow-md transition-all duration-200 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="font-medium">Limpiar</span>
                </button>
              )}
            </div>

            {/* Results count mejorado */}
            <div className="hidden sm:flex items-center space-x-4">
              <span className="text-xs sm:text-sm text-gray-600">
                <span className="hidden lg:inline">Mostrando </span>
                {sortedProperties.length} de {total} resultado{sortedProperties.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Advanced Filters Dropdown Mejorado */}
          {isFilterOpen && (
            <div className="mt-6 p-8 bg-white rounded-xl border border-gray-200 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Rango de precio */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Rango de precio
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">
                        Precio mínimo
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          $
                        </span>
                        <input
                          type="number"
                          value={filters.min_price || ""}
                          onChange={(e) =>
                            handleFilterChange(
                              "min_price",
                              e.target.value
                                ? parseInt(e.target.value)
                                : undefined
                            )
                          }
                          placeholder="500,000"
                          className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">
                        Precio máximo
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          $
                        </span>
                        <input
                          type="number"
                          value={filters.max_price || ""}
                          onChange={(e) =>
                            handleFilterChange(
                              "max_price",
                              e.target.value
                                ? parseInt(e.target.value)
                                : undefined
                            )
                          }
                          placeholder="5,000,000"
                          className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Habitaciones */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Habitaciones
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        onClick={() =>
                          handleFilterChange(
                            "bedrooms",
                            filters.bedrooms === num ? undefined : num
                          )
                        }
                        className={`px-6 py-3 rounded-lg border-2 transition-all duration-200 font-medium ${
                          filters.bedrooms === num
                            ? "bg-gray-900 border-gray-900 text-white"
                            : "border-gray-300 text-gray-700 hover:border-gray-400 hover:shadow-md"
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
      <div data-results-section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header con resultados */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            {total} {total === 1 ? "alojamiento" : "alojamientos"} en Cali
          </h2>
          <p className="text-gray-600">
            Descubre lugares únicos donde hospedarte
          </p>
        </div>

        {/* Loading skeleton mejorado */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[600px]">
            <div className="text-center">
              <HLoader size="large" className="mb-8" />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <p className="text-gray-600 text-xl mb-2">Cargando propiedades...</p>
                <p className="text-gray-500 text-sm">Esto puede tomar unos segundos</p>
              </motion.div>
            </div>
          </div>
        ) : sortedProperties.length > 0 ? (
          <>
            {/* Header de ordenamiento con botones de vista */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-8">
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 font-medium mr-3">Vista:</span>
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      viewMode === 'list'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    Lista
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      viewMode === 'grid'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Tarjetas
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-sm font-bold text-gray-900 hidden sm:inline">
                  {t('common.sort_by')}:
                </span>
                <div className="relative">
                  <select
                    value={filters.sorting}
                    onChange={(e) =>
                      handleFilterChange("sorting", e.target.value)
                    }
                    className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-bold text-gray-900 min-w-[180px] shadow-sm hover:shadow-md transition-all duration-200 appearance-none pr-10"
                  >
                    <option value="date_desc">Más recientes</option>
                    <option value="price_asc">Precio: menor a mayor</option>
                    <option value="price_desc">Precio: mayor a menor</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Propiedades en ambas vistas */}
            {viewMode === 'list' ? (
              <div className="space-y-8">
                {sortedProperties.map((property) => (
                  <PropertyListItem
                    key={property.id_property}
                    property={property}
                    isFavorite={favorites.has(property.id_property)}
                    onToggleFavorite={() =>
                      toggleFavorite(property.id_property)
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedProperties.map((property) => (
                  <PropertyCard
                    key={property.id_property}
                    property={property}
                    isFavorite={favorites.has(property.id_property)}
                    onToggleFavorite={() =>
                      toggleFavorite(property.id_property)
                    }
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex justify-center items-center min-h-[600px]">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <p className="text-gray-600 text-xl mb-2">No se encontraron propiedades</p>
                <p className="text-gray-500 text-sm">Por favor, ajusta los filtros</p>
              </motion.div>
            </div>
          </div>
        )}
      </div>
      
      {/* Trusted By Section */}
      <Suspense fallback={<LazyComponentLoader />}>
        <TrustedBy />
      </Suspense>

      {/* Inspired Section Rediseñada */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              ¿No encuentras lo que buscas?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nuestro equipo de expertos está aquí para ayudarte a encontrar el
              hogar perfecto. Contáctanos y encuentra exactamente lo que
              necesitas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Feature 1 */}
            <div className="text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Búsqueda personalizada
              </h3>
              <p className="text-gray-600">
                Te ayudamos a encontrar exactamente lo que necesitas según tus
                preferencias y presupuesto
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Propiedades verificadas
              </h3>
              <p className="text-gray-600">
                Todas nuestras propiedades están verificadas, actualizadas y
                listas para habitar
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Atención personalizada
              </h3>
              <p className="text-gray-600">
                Acompañamiento completo en todo el proceso, desde la búsqueda
                hasta la entrega
              </p>
            </div>
          </div>

          {/* CTA Buttons Mejorados */}
          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+573017546634"
                className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                Llamar ahora
              </a>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-white border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-200 hover:scale-105"
                onClick={(e) => {
                  e.preventDefault();
                  return trackWhatsAppConversion(whatsappLink);
                }}
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
      
      {/* Chatbot flotante */}
      <Suspense fallback={null}>
        <Chatbot />
      </Suspense>
    </div>
  );
}
