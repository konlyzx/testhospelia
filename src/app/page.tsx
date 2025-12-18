"use client";
import React, { useState, useEffect, useRef, useMemo, useCallback, lazy, Suspense } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { IoMdClose } from "react-icons/io";
import { FaWhatsapp, FaCheckCircle, FaShieldAlt, FaStar, FaSearch } from "react-icons/fa";
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
import PropertyCard from "@/components/PropertyCard";
import PropertyListItem from "@/components/PropertyListItem";
import { toDestProperty } from "@/utils/propertyUtils";

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

      <div className="relative w-full h-[90vh] min-h-[600px] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 pt-32 pb-12 overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop"
            alt="Luxury Stay in Cali"
            fill
            className="object-cover brightness-[0.4]"
            priority
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-semibold mb-8 backdrop-blur-md shadow-lg">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              #1 en Alojamientos Corporativos en Cali
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-8 tracking-tight">
              {t('home.hero.title')} <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
                {t('home.hero.highlight')}
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-200 mb-12 max-w-3xl leading-relaxed font-light">
              {t('home.hero.subtitle')}
            </p>

            {/* Search Bar - Centered & Clean */}
            <div className="w-full max-w-4xl bg-white rounded-full p-2 shadow-2xl flex flex-col sm:flex-row items-center gap-2 border border-gray-100">
              
              {/* Destino */}
              <div className="w-full sm:flex-1 px-6 py-3 border-b sm:border-b-0 sm:border-r border-gray-100 relative group text-left">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Destino</label>
                <div className="flex items-center">
                  <FaSearch className="text-gray-400 mr-3" />
                  <select 
                    id="destino" 
                    name="destino" 
                    value={filters.search} 
                    onChange={(e) => handleFilterChange('search', e.target.value)} 
                    className="w-full bg-transparent font-bold text-gray-900 outline-none cursor-pointer appearance-none text-base truncate"
                  >
                    <option value="">Cali, Colombia</option>
                    <option value="Cali">Cali - Zona Sur</option>
                    <option value="Cali">Cali - Zona Oeste</option>
                  </select>
                </div>
              </div>

              {/* Habitaciones */}
              <div className="w-full sm:flex-1 px-6 py-3 border-b sm:border-b-0 sm:border-r border-gray-100 relative group text-left">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Espacio</label>
                <select 
                  id="habitaciones" 
                  name="habitaciones" 
                  value={filters.bedrooms || ''} 
                  onChange={(e) => handleFilterChange('bedrooms', e.target.value ? parseInt(e.target.value) : undefined)} 
                  className="w-full bg-transparent font-bold text-gray-900 outline-none cursor-pointer appearance-none text-base"
                >
                  <option value="">Cualquier tamaño</option>
                  <option value="1">1 Habitación</option>
                  <option value="2">2 Habitaciones</option>
                  <option value="3">3+ Habitaciones</option>
                </select>
              </div>

              {/* Presupuesto */}
              <div className="w-full sm:flex-1 px-6 py-3 relative group text-left">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Presupuesto</label>
                <select 
                  id="presupuesto" 
                  name="presupuesto" 
                  value={filters.min_price === 2800000 && filters.max_price === 3600000 ? '2800000-3600000' : filters.min_price === 4000000 ? '4000000+' : ''} 
                  onChange={(e) => { const value = e.target.value; if (value === '2800000-3600000') { handleFilterChange('min_price', 2800000); handleFilterChange('max_price', 3600000); } else if (value === '4000000+') { handleFilterChange('min_price', 4000000); handleFilterChange('max_price', undefined); } else { handleFilterChange('min_price', undefined); handleFilterChange('max_price', undefined); } }} 
                  className="w-full bg-transparent font-bold text-gray-900 outline-none cursor-pointer appearance-none text-base"
                >
                  <option value="">Cualquier precio</option>
                  <option value="2800000-3600000">$2.8M - $3.6M</option>
                  <option value="4000000+">$4.0M+</option>
                </select>
              </div>

              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                onClick={() => { const s = document.querySelector('[data-results-section]'); if (s) s.scrollIntoView({ behavior: 'smooth' }); }} 
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold p-4 rounded-full transition-all shadow-lg flex items-center justify-center gap-2 min-w-[60px]"
              >
                <FaSearch className="text-xl" />
                <span className="sm:hidden">Buscar</span>
              </motion.button>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap justify-center gap-4 sm:gap-8 text-sm font-medium text-white/80">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <FaCheckCircle className="text-green-400" /> Propiedades Verificadas
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <FaShieldAlt className="text-blue-400" /> Pagos 100% Seguros
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <FaStar className="text-yellow-400" /> Calificación 4.9/5
              </div>
            </div>

          </motion.div>
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

      <div className="">
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
              <div className="space-y-6">
                {sortedProperties.map((property) => (
                  <PropertyListItem
                    key={property.id_property}
                    property={toDestProperty(property)}
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
                    property={toDestProperty(property)}
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

      {/* Concierge Section - Diseño Moderno y Humano */}
      <div className="relative py-24 bg-blue-500 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content */}
            <div className="text-left">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white text-sm font-semibold mb-6">
                <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                Servicio Concierge
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                ¿Buscas algo <span className="text-blue-100">único?</span>
              </h2>
              
              <p className="text-lg text-blue-50 mb-8 leading-relaxed max-w-xl">
                Sabemos que encontrar el alojamiento perfecto puede ser agotador. Deja que nuestro equipo de expertos haga el trabajo pesado por ti. Cuéntanos qué necesitas y te presentaremos opciones seleccionadas que se ajusten a tu estilo.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all duration-300 hover:scale-105 shadow-lg"
                  onClick={(e) => {
                    e.preventDefault();
                    return trackWhatsAppConversion(whatsappLink);
                  }}
                >
                  <svg className="w-5 h-5 mr-3 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                  </svg>
                  Iniciar Chat
                </a>
                
                <a
                  href="tel:+573017546634"
                  className="inline-flex items-center justify-center px-8 py-4 bg-transparent border border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-200"
                >
                  Llamar
                </a>
              </div>
            </div>

            {/* Right Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Feature Card 1 */}
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-colors duration-300">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 text-white">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">Búsqueda Dedicada</h3>
                <p className="text-blue-100 text-sm">Rastreamos el mercado para encontrar joyas ocultas que no están en la web.</p>
              </div>

              {/* Feature Card 2 */}
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-colors duration-300">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 text-white">
                   <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">Verificación Total</h3>
                <p className="text-blue-100 text-sm">Cada propiedad es inspeccionada personalmente para garantizar calidad.</p>
              </div>

              {/* Feature Card 3 - Spanning full width on mobile, auto on grid */}
              <div className="sm:col-span-2 bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 text-white">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Ahorra Tiempo</h3>
                  <p className="text-blue-100 text-sm">Recibe una lista curada en menos de 24 horas.</p>
                </div>
              </div>
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
