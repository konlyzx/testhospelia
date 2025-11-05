import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const navigationLinks = [
  { name: 'Inicio', href: '/' },
  { name: 'Alojamientos', href: '/alojamientos' },
  { name: 'Hazte anfitrión', href: '/hazte-anfitrion' },
  { name: 'Blog', href: '/blog' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Controlar el scroll para el efecto flotante
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <motion.nav 
      className={`fixed w-full z-50 transition-all duration-300`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
    >
      <div className={`backdrop-blur-md transition-all duration-500 ${
        scrolled 
          ? 'bg-white/95 shadow-lg py-3' 
          : 'bg-white/50 py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <motion.div 
              className="flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <Link href="/" className="text-blue-600 font-bold text-2xl">
                <span className="text-blue-700">hospe</span>
                <span className="text-blue-500">lia</span>
              </Link>
            </motion.div>
            
            {/* Enlaces de navegación - Escritorio */}
            <div className="hidden md:flex items-center space-x-8">
              {navigationLinks.map((link) => (
                <motion.div
                  key={link.href}
                  whileHover={{ y: -2 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Link 
                    href={link.href} 
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
                  >
                    <span className="relative">
                      {link.name}
                      <motion.span 
                        className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500"
                        whileHover={{ width: '100%' }}
                        transition={{ duration: 0.3 }}
                      />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
            
            {/* Botón CTA */}
            <div className="hidden md:flex items-center">
              <motion.button 
                className="px-5 py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 shadow-md transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Reserva ahora
              </motion.button>
            </div>
            
            {/* Botón hamburguesa - Móvil */}
            <div className="md:hidden">
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-md focus:outline-none text-gray-700"
                whileTap={{ scale: 0.9 }}
              >
                <div className="relative w-6 h-5">
                  <motion.span
                    className="absolute h-0.5 w-6 bg-gray-700 transform transition-all duration-300"
                    animate={{ 
                      top: isOpen ? '10px' : '0px', 
                      rotate: isOpen ? '45deg' : '0deg' 
                    }}
                  />
                  <motion.span
                    className="absolute h-0.5 w-6 bg-gray-700 top-[10px]"
                    animate={{ 
                      opacity: isOpen ? 0 : 1
                    }}
                    transition={{ duration: 0.1 }}
                  />
                  <motion.span
                    className="absolute h-0.5 w-6 bg-gray-700 transform transition-all duration-300"
                    animate={{ 
                      top: isOpen ? '10px' : '20px',
                      rotate: isOpen ? '-45deg' : '0deg'
                    }}
                  />
                </div>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Menú móvil */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <motion.div 
              className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg rounded-b-xl mx-4 mt-2"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, staggerChildren: 0.1, delayChildren: 0.1 }}
            >
              {navigationLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link 
                    href={link.href} 
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.button 
                className="w-full mt-3 px-4 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
                onClick={() => setIsOpen(false)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Reserva ahora
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
} 