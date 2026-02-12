'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import PopupReserva from './PopupReserva';
import { trackReservationButtonClick } from '@/utils/googleAds';
import LanguageCurrencySelector from './LanguageCurrencySelector';
import { usePathname } from 'next/navigation';
import { FaBars, FaUserCircle, FaGlobe, FaTimes, FaWhatsapp, FaTh, FaHome, FaInfoCircle, FaEnvelope, FaPhone, FaStar } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';

// Componente de contador de favoritos
const FavoritesCounter = () => {
  const [favoritesCount, setFavoritesCount] = useState(0);

  useEffect(() => {
    const updateFavoritesCount = () => {
      const savedFavorites = localStorage.getItem('hospelia-favorites');
      if (savedFavorites) {
        const favorites = JSON.parse(savedFavorites);
        setFavoritesCount(favorites.length);
      } else {
        setFavoritesCount(0);
      }
    };

    updateFavoritesCount();
    window.addEventListener('storage', updateFavoritesCount);
    window.addEventListener('favoritesUpdated', updateFavoritesCount);

    return () => {
      window.removeEventListener('storage', updateFavoritesCount);
      window.removeEventListener('favoritesUpdated', updateFavoritesCount);
    };
  }, []);

  if (favoritesCount === 0) {
    return null;
  }

  return (
    <Link href="/favoritos">
      <motion.button 
        className="relative flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        {favoritesCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold min-w-5">
            {favoritesCount > 99 ? '99+' : favoritesCount}
          </span>
        )}
      </motion.button>
    </Link>
  );
};

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();

  const isHomePage = pathname === '/';

  // Controlar el scroll para efectos visuales y comportamiento flotante
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevenir scroll del body cuando el menú está abierto
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

  const handleReservaClick = () => {
    trackReservationButtonClick();
    setShowPopup(true);
    setIsSidebarOpen(false);
  };

  const useDarkStyle = isScrolled || !isHomePage;
  const textColorClass = useDarkStyle ? 'text-gray-800 hover:text-blue-600' : 'text-white/95 hover:text-white';
  const languageButtonClass = useDarkStyle ? 'hover:bg-gray-100' : 'hover:bg-white/10';

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[100] bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg font-bold transition-transform">
        Saltar al contenido principal
      </a>
      <header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out border-b ${ 
          isScrolled 
            ? 'bg-white/70 backdrop-blur-2xl border-gray-200/50 shadow-[0_8px_32px_rgba(0,0,0,0.04)] py-3 supports-[backdrop-filter]:bg-white/60' 
            : !isHomePage  
              ? 'bg-white/70 backdrop-blur-md border-gray-200/50 py-4 shadow-sm' 
              : 'bg-transparent border-transparent py-5' 
        }`}
      >
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-2 z-50 group">
              <div className="relative h-10 w-32 transition-transform duration-300 group-hover:scale-105">
                <img 
                  src="/img/logo-hospelia.webp" 
                  alt="Hospelia Logo" 
                  className={`w-full h-full object-contain object-left transition-all duration-500 ${!useDarkStyle ? 'brightness-0 invert' : ''}`} 
                  loading="eager"
                  decoding="async"
                />
              </div>
            </Link>
            
            {/* Right Menu */}
            <div className="flex items-center gap-4 md:gap-8">
              <nav role="navigation" className="hidden md:flex items-center gap-8">
                <Link 
                  href="/blog" 
                  className={`text-sm font-medium transition-colors duration-300 ${textColorClass}`}
                >
                  {t('nav.blog')}
                </Link>
                <Link 
                  href="/hazte-anfitrion" 
                  className={`text-sm font-medium transition-colors duration-300 ${textColorClass}`}
                >
                  {t('Hazte Anfitrión')}
                </Link>
              </nav>
              
              <div className="flex items-center gap-3">
                {/* Favorites Counter (Original Button) */}
                <div className={`${useDarkStyle ? '' : 'text-white'}`}>
                  <FavoritesCounter />
                </div>
                
                {/* Desktop CTA (Original Button Logic) */}
                <motion.button 
                  className="hidden md:inline-flex px-4 lg:px-6 py-2 lg:py-3 border border-transparent rounded-full shadow-md text-sm lg:text-base font-medium text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReservaClick}
                >
                  <span className="hidden lg:inline">{t('Reserva Ahora')}</span>
                  <span className="lg:hidden">Reservar</span>
                </motion.button>
                
                {/* Mobile Menu Toggle */}
                <button 
                  className={`md:hidden flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200/50 backdrop-blur-md bg-white/10 hover:bg-white/20 transition-all duration-300 ${textColorClass}`}
                  onClick={() => setIsSidebarOpen(true)}
                >
                  <FaTh size={16} />
                  <span className="text-sm font-semibold">Menú</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Fixed Contact Bar - REMOVED to avoid duplication */}
      {/* 
      <div className="fixed bottom-0 left-0 w-full z-[55] md:hidden bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] pb-4">
        <div className="grid grid-cols-2 divide-x divide-gray-100">
          <a 
            href="tel:+573017546634"
            className="flex items-center justify-center gap-2 py-4 active:bg-gray-50 transition-colors"
          >
            <FaPhone className="text-blue-600" />
            <span className="font-bold text-gray-800 text-sm">Llama ahora</span>
          </a>
          <a 
            href="https://wa.me/573017546634"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-4 active:bg-gray-50 transition-colors"
          >
            <FaWhatsapp className="text-green-500 text-lg" />
            <span className="font-bold text-gray-800 text-sm">WhatsApp</span>
          </a>
        </div>
      </div>
      */}

      {/* Mobile Full Screen Menu */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[2000] md:hidden bg-white flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
               <Link href="/" onClick={() => setIsSidebarOpen(false)} className="relative h-8 w-28">
                  <img
                    src="/img/logo-hospelia.webp"
                    alt="Hospelia"
                    className="w-full h-full object-contain object-left"
                    loading="eager"
                    decoding="async"
                  />
               </Link>
               <button 
                 onClick={() => setIsSidebarOpen(false)}
                 className="p-2 -mr-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors"
               >
                 <FaTimes size={24} />
               </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
               <div className="space-y-8">
                  {/* Navigation Links */}
                  <nav className="flex flex-col space-y-6">
                     <Link href="/" onClick={() => setIsSidebarOpen(false)} className="flex items-center space-x-4 text-gray-900 font-bold text-xl group">
                        <span className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100 transition-colors"><FaHome size={20} /></span>
                        <span>Inicio</span>
                     </Link>
                     <Link href="/blog" onClick={() => setIsSidebarOpen(false)} className="flex items-center space-x-4 text-gray-900 font-bold text-xl group">
                        <span className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-100 transition-colors"><FaInfoCircle size={20} /></span>
                        <span>{t('nav.blog')}</span>
                     </Link>
                     <Link href="/hazte-anfitrion" onClick={() => setIsSidebarOpen(false)} className="flex items-center space-x-4 text-gray-900 font-bold text-xl group">
                        <span className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center group-hover:bg-green-100 transition-colors"><FaHome size={20} /></span>
                        <span>{t('nav.host')}</span>
                     </Link>
                     <Link href="/favoritos" onClick={() => setIsSidebarOpen(false)} className="flex items-center space-x-4 text-gray-900 font-bold text-xl group">
                        <span className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center group-hover:bg-red-100 transition-colors"><FaStar size={20} /></span>
                        <span>{t('nav.favorites')}</span>
                     </Link>
                  </nav>
               </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-100 bg-transparent-50/50 pb-8">
               <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={handleReservaClick}
                    className="flex flex-col items-center justify-center p-4 bg-green-500 text-white rounded-2xl shadow-lg shadow-blue-200 active:scale-95 transition-all"
                  >
                    <FaWhatsapp size={24} className="mb-2" />
                    <span className="font-bold text-sm">{t('nav.bookNow')}</span>
                  </button>
                  <a 
                    href="tel:+573017546634"
                    className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 text-gray-900 rounded-2xl shadow-sm active:bg-gray-50 transition-all"
                  >
                    <FaPhone size={24} className="mb-2 text-gray-900" />
                    <span className="font-bold text-sm">Llamar</span>
                  </a>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popup de reserva (Original Component Logic) */}
      <React.Suspense fallback={null}>
        <PopupReserva isOpen={showPopup} onClose={() => setShowPopup(false)} popupId={22494} />
      </React.Suspense>
    </>
  );
}
