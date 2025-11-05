"use client";

import React, { useState } from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Importa los estilos de react-slick
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const banners = [
  { id: 1, src: '/img/banners/banner-apartamentos-amoblados.png', alt: 'Banner Apartamentos Amoblados' },
  { id: 2, src: '/img/banners/banner-encuentra-cali.png', alt: 'Banner Encuentra tu lugar ideal en Cali' },
  { id: 3, src: '/img/banners/banner-sientete-casa.png', alt: 'Banner Siéntete como en casa' },
];

// Componente de filtros estilo Airbnb
const SearchFiltersBox = () => {
  const [location, setLocation] = useState('');
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');
  const [guests, setGuests] = useState('');

  const handleSearch = () => {
    // Función de búsqueda
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="relative mx-auto max-w-4xl"
    >
      {/* Backdrop con blur */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-md rounded-full shadow-2xl" />
      
      {/* Contenedor principal */}
      <div className="relative bg-white/95 backdrop-blur-sm rounded-full shadow-2xl border border-gray-200/50 p-2">
        <div className="flex items-center">
          
          {/* Campo Dónde */}
          <div className="flex-1 px-6 py-4 hover:bg-gray-50/80 rounded-full transition-colors cursor-pointer group">
            <div className="space-y-1">
              <label htmlFor="location-input" className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Dónde
              </label>
              <input
                id="location-input"
                type="text"
                placeholder="Explora destinos"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-sm font-medium text-gray-800 bg-transparent border-none outline-none placeholder-gray-500 group-hover:placeholder-gray-600"
                aria-label="Ubicación de destino"
              />
            </div>
          </div>

          {/* Separador */}
          <div className="w-px h-8 bg-gray-300/70" />

          {/* Campo Check-in */}
          <div className="flex-1 px-6 py-4 hover:bg-gray-50/80 rounded-full transition-colors cursor-pointer group">
            <div className="space-y-1">
              <label htmlFor="checkin-input" className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Check-in
              </label>
              <input
                id="checkin-input"
                type="date"
                value={checkin}
                onChange={(e) => setCheckin(e.target.value)}
                className="w-full text-sm font-medium text-gray-800 bg-transparent border-none outline-none cursor-pointer"
                placeholder="Agrega fechas"
                aria-label="Fecha de check-in"
              />
              {!checkin && (
                <div className="text-sm text-gray-500 font-normal">Agrega fechas</div>
              )}
            </div>
          </div>

          {/* Separador */}
          <div className="w-px h-8 bg-gray-300/70" />

          {/* Campo Check-out */}
          <div className="flex-1 px-6 py-4 hover:bg-gray-50/80 rounded-full transition-colors cursor-pointer group">
            <div className="space-y-1">
              <label htmlFor="checkout-input" className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Check-out
              </label>
              <input
                id="checkout-input"
                type="date"
                value={checkout}
                onChange={(e) => setCheckout(e.target.value)}
                className="w-full text-sm font-medium text-gray-800 bg-transparent border-none outline-none cursor-pointer"
                placeholder="Agrega fechas"
                aria-label="Fecha de check-out"
              />
              {!checkout && (
                <div className="text-sm text-gray-500 font-normal">Agrega fechas</div>
              )}
            </div>
          </div>

          {/* Separador */}
          <div className="w-px h-8 bg-gray-300/70" />

          {/* Campo Quién */}
          <div className="flex-1 px-6 py-4 hover:bg-gray-50/80 rounded-full transition-colors cursor-pointer group">
            <div className="space-y-1">
              <label htmlFor="guests-select" className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Quién
              </label>
              <select
                id="guests-select"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full text-sm font-medium text-gray-800 bg-transparent border-none outline-none cursor-pointer appearance-none"
                aria-label="Número de huéspedes"
              >
                <option value="">¿Cuántos?</option>
                <option value="1">1 huésped</option>
                <option value="2">2 huéspedes</option>
                <option value="3">3 huéspedes</option>
                <option value="4">4 huéspedes</option>
                <option value="5">5+ huéspedes</option>
              </select>
              {!guests && (
                <div className="text-sm text-gray-500 font-normal pointer-events-none">¿Cuántos?</div>
              )}
            </div>
          </div>

          {/* Botón de búsqueda */}
          <motion.button
            onClick={handleSearch}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="ml-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white p-5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 min-w-[60px] min-h-[60px] flex items-center justify-center"
            aria-label="Buscar alojamientos"
            type="button"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 32 32" 
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              aria-hidden="true"
            >
              <path d="M13 24a11 11 0 1 0 0-22 11 11 0 0 0 0 22zm8-3 9 9" />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default function Hero() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000, 
    fade: true, 
    cssEase: 'linear',
    arrows: false, 
    pauseOnHover: true,
  };

  // Variantes de animación
  const containerVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8
    },
    visible: { 
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2
      }
    }
  };

  const slideVariants = {
    hidden: { 
      opacity: 0,
      y: 30
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className="relative w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Backdrop blur overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] z-10 pointer-events-none" />
      
      {/* Hero Content Overlay con el nuevo box de filtros */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4">
        {/* Título */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.6, delay: 0.2 }} 
          className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white/90 text-sm font-semibold mb-8"
        >
          ✨ Encuentra tu hogar perfecto en Cali
        </motion.div>

        {/* Box de filtros */}
        <SearchFiltersBox />
      </div>
      
      <Slider {...settings}>
        {banners.map((banner, index) => (
          <motion.div 
            key={banner.id} 
            className="relative w-full"
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.1 }}
          >
            <div className="relative h-[600px] overflow-hidden">
              <Image
                src={banner.src}
                alt={banner.alt}
                width={1920}
                height={600}
                priority={index === 0}
                className="w-full h-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
              />
              
              {/* Overlay con gradiente suave */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
              
              {/* Contenido centrado */}
              <div className="absolute inset-0 flex items-center justify-center px-4">
                <div className="text-center text-white max-w-4xl mx-auto">
                  <motion.h1
                    variants={slideVariants}
                    className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
                  >
                    Hospelia.co
                  </motion.h1>
                  
                  <motion.p
                    variants={slideVariants}
                    className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-light leading-relaxed"
                  >
                    Encuentra apartamentos amoblados, céntricos y con todas las comodidades en Cali
                  </motion.p>
                  
                  <motion.div variants={slideVariants}>
                    <SearchFiltersBox />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </Slider>
      
      {/* Elementos decorativos animados */}
      <motion.div 
        className="absolute top-10 left-10 w-4 h-4 bg-blue-400 rounded-full opacity-70"
        animate={{ 
          y: [0, -20, 0],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute bottom-20 right-20 w-6 h-6 bg-blue-300 rounded-full opacity-60"
        animate={{ 
          y: [0, 15, 0],
          x: [0, 10, 0],
          opacity: [0.6, 0.9, 0.6]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
    </motion.div>
  );
} 
