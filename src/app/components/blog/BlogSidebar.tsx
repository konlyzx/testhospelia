"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaRegNewspaper, FaArchive, FaTags, FaBullhorn, FaCalendar, FaSearch } from 'react-icons/fa';
import { getRecentBlogPosts, WordPressBlogPost } from '@/services/wordpress';
import HLoader from '../HLoader';

interface Archive {
  month: string;
  year: number;
  count: number;
}

interface Category {
  name: string;
  slug: string;
  count: number;
}

const BlogSidebar: React.FC = () => {
  const [recentPosts, setRecentPosts] = useState<WordPressBlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const posts = await getRecentBlogPosts(5);
        setRecentPosts(posts);
      } catch (error) {
        console.error('Error fetching recent posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPosts();

    const interval = setInterval(fetchRecentPosts, 45000);

    return () => clearInterval(interval);
  }, []);

  // Limpiar contenido de WordPress
  const cleanWordPressContent = (content: string): string => {
    if (!content) return '';
    
    return content
      .replace(/<[^>]*>/g, '')
      .replace(/&hellip;/g, '...')
      .replace(/&nbsp;/g, ' ')
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&#8220;/g, '"')
      .replace(/&#8221;/g, '"')
      .replace(/&#8211;/g, '-')
      .replace(/&#8212;/g, '--')
      .replace(/&ldquo;/g, '"')
      .replace(/&rdquo;/g, '"')
      .replace(/&lsquo;/g, "'")
      .replace(/&rsquo;/g, "'")
      .replace(/ㅤ-ㅤ/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Datos simulados para mostrar
  const archives: Archive[] = [
    { month: 'Diciembre', year: 2024, count: 8 },
    { month: 'Noviembre', year: 2024, count: 12 },
    { month: 'Octubre', year: 2024, count: 15 },
    { month: 'Septiembre', year: 2024, count: 10 },
    { month: 'Agosto', year: 2024, count: 7 }
  ];

  const categories: Category[] = [
    { name: 'Lugares en Cali', slug: 'lugares-cali', count: 28 },
    { name: 'Gastronomía', slug: 'gastronomia', count: 15 },
    { name: 'Cultura y Salsa', slug: 'cultura-salsa', count: 22 },
    { name: 'Hospedaje', slug: 'hospedaje', count: 12 },
    { name: 'Transporte', slug: 'transporte', count: 8 }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric'
    });
  };

  const sidebarItems = [
    {
      title: "Acerca de Hospelia",
      icon: <FaBullhorn className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed text-sm">
            Somos tu guía confiable para descubrir lo mejor de Cali. Desde alojamientos únicos hasta experiencias auténticas en la Capital de la Salsa.
          </p>
          <Link href="/hazte-anfitrion">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-3 px-4 rounded-full hover:from-blue-600 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
            >
              Hazte Anfitrión
            </motion.button>
          </Link>
        </div>
      )
    },
    {
      title: "Buscador",
      icon: <FaSearch className="w-5 h-5" />,
      content: (
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar artículos..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>
      )
    },
    {
      title: "Artículos Recientes",
      icon: <FaRegNewspaper className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <HLoader size="small" className="mb-4" />
              <p className="text-gray-500 text-sm">Cargando artículos...</p>
            </div>
          ) : recentPosts.length > 0 ? (
            recentPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="group"
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className="block p-3 rounded-xl hover:bg-blue-50 transition-colors duration-300 border border-gray-100 hover:border-blue-200">
                    <h4 className="font-semibold text-sm text-gray-900 group-hover:text-blue-700 transition-colors leading-tight mb-2 line-clamp-2">
                      {cleanWordPressContent(post.title.rendered)}
                    </h4>
                    <div className="flex items-center text-xs text-gray-500">
                      <span>{formatDate(post.date)}</span>
                      <span className="mx-2">•</span>
                      <span className="text-blue-600 font-medium">Leer más</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No hay artículos recientes disponibles</p>
          )}
        </div>
      )
    },
    {
      title: "Categorías Populares",
      icon: <FaTags className="w-5 h-5" />,
      content: (
        <div className="space-y-2">
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/blog/categoria/${category.slug}`}>
                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50 transition-colors duration-300 group border border-gray-100 hover:border-blue-200">
                  <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 transition-colors">
                    {category.name}
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-bold group-hover:bg-blue-200 transition-colors">
                    {category.count}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )
    },
    {
      title: "Archivo",
      icon: <FaArchive className="w-5 h-5" />,
      content: (
        <div className="space-y-2">
          {archives.map((archive, index) => (
            <motion.div
              key={`${archive.month}-${archive.year}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/blog/archivo/${archive.year}/${archive.month.toLowerCase()}`}>
                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50 transition-colors duration-300 group border border-gray-100 hover:border-blue-200">
                  <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 transition-colors">
                    {archive.month} {archive.year}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-bold group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                    {archive.count}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )
    },
    {
      title: "Destinos Populares",
      icon: <FaMapMarkerAlt className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          {[
            { name: 'Centro Histórico', count: 25 },
            { name: 'Ciudad Jardín', count: 18 },
            { name: 'Granada', count: 15 },
            { name: 'San Antonio', count: 12 },
            { name: 'El Peñón', count: 8 }
          ].map((destination, index) => (
            <motion.div
              key={destination.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/blog/destino/${destination.name.toLowerCase().replace(/\s+/g, '-')}`}>
                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50 transition-colors duration-300 group border border-gray-100 hover:border-blue-200">
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="w-3 h-3 text-blue-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 transition-colors">
                      {destination.name}
                    </span>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-bold group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                    {destination.count}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )
    }
  ];

  return (
    <aside className="space-y-8">
      {sidebarItems.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold">{item.title}</h3>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6">
            {item.content}
          </div>
        </motion.div>
      ))}
      
      {/* Newsletter Signup */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-xl text-white p-8 relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">¡Mantente al día!</h3>
            <p className="text-blue-100 text-sm">
              Recibe nuestras mejores guías y consejos sobre Cali directo en tu email
            </p>
          </div>
          
          <div className="space-y-4">
            <input
              type="email"
              placeholder="tu@email.com"
              className="w-full px-4 py-3 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/50 text-sm"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-white text-blue-700 font-bold py-3 px-4 rounded-full hover:bg-blue-50 transition-colors duration-300 shadow-lg text-sm"
            >
              Suscribirse
            </motion.button>
          </div>
        </div>
      </motion.div>
    </aside>
  );
};

export default BlogSidebar; 