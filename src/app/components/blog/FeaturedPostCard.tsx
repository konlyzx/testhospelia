"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { WordPressBlogPost } from '@/services/wordpress';
import DummyImage from '../DummyImageLoader';

interface FeaturedPostCardProps {
  post: WordPressBlogPost;
  priority?: boolean;
  className?: string;
}

const FeaturedPostCard: React.FC<FeaturedPostCardProps> = ({ post, priority = false, className = "" }) => {
  // Limpiar completamente el contenido de WordPress
  const cleanWordPressContent = (content: string): string => {
    if (!content) return '';
    
    return content
      // Remover todas las etiquetas HTML
      .replace(/<[^>]*>/g, '')
      // Remover entidades HTML
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
      // Remover texto de continuación que viene de WP
      .replace(/\[&hellip;\]/g, '...')
      .replace(/\[…\]/g, '...')
      .replace(/Continue reading.*$/i, '')
      .replace(/Read more.*$/i, '')
      .replace(/Leer más.*$/i, '')
      // Remover caracteres especiales y espacios extra
      .replace(/ㅤ-ㅤ/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Calcular tiempo de lectura estimado
  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const cleanContent = cleanWordPressContent(content);
    const words = cleanContent.split(/\s+/).length;
    // Estimar que el extracto es aproximadamente 1/5 del artículo completo
    const estimatedWords = words * 5;
    return Math.max(1, Math.ceil(estimatedWords / wordsPerMinute));
  };

  // Limpiar excerpt de HTML
  const cleanExcerpt = cleanWordPressContent(post.excerpt?.rendered || '');
  const readTime = calculateReadTime(cleanExcerpt);

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Crear extracto personalizado para el featured post
  const getExcerpt = () => {
    if (cleanExcerpt && cleanExcerpt.length > 100) {
      return cleanExcerpt.substring(0, 300) + '...';
    }
    
    // Si no hay extracto, crear uno del contenido
    const contentText = cleanWordPressContent(post.content?.rendered || '');
    if (contentText.length > 200) {
      return contentText.substring(0, 300) + '...';
    }
    
    return 'Descubre los mejores secretos de Cali y vive experiencias únicas en la Capital de la Salsa con esta guía completa de Hospelia.';
  };

  return (
    <motion.article 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "circOut" }}
      whileHover={{ y: -5 }}
      className={`bg-white rounded-2xl shadow-xl overflow-hidden md:flex group mb-10 md:mb-16 relative border border-gray-200 hover:shadow-2xl transition-all duration-700 ${className}`}
    >
      <Link href={`/blog/${post.slug}`} className="block h-full flex md:flex-row flex-col">
        {/* Imagen destacada */}
        <div className="md:w-1/2 relative min-h-[320px] md:min-h-[480px] overflow-hidden">
          {post.featured_media_url ? (
            <DummyImage
              src={post.featured_media_url} 
              alt={cleanWordPressContent(post.title.rendered)}
              layout="fill"
              objectFit="cover"
              className="transform group-hover:scale-110 transition-transform duration-1000"
              priority={priority}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <svg className="w-32 h-32 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-black/10 opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
          
          {/* Badges superpuestos */}
          <div className="absolute top-6 left-6 flex flex-col space-y-3">
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm font-bold uppercase px-6 py-3 rounded-full shadow-xl backdrop-blur-sm border border-white/30">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Destacado
              </span>
            </div>
          </div>

          {/* Reading time badge */}
          <div className="absolute top-6 right-6">
            <div className="bg-black/40 backdrop-blur-md text-white text-sm font-medium px-4 py-2 rounded-full border border-white/30">
              {readTime} min de lectura
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>

        {/* Contenido */}
        <div className="md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative">
          {/* Background decoration */}
          <div className="absolute top-8 right-8 w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full opacity-20"></div>
          
          {/* Categoría y fecha */}
          <div className="flex items-center mb-6 relative z-10">
            <span className="text-sm font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
              Blog de Hospelia
            </span>
            <span className="ml-4 text-sm text-gray-500 font-medium">
              {formatDate(post.date)}
            </span>
          </div>
          
          {/* Título */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight group-hover:text-blue-700 transition-colors duration-300 relative z-10">
            {cleanWordPressContent(post.title.rendered)}
          </h2>
          
          {/* Excerpt */}
          <p className="text-gray-700 mb-8 md:text-lg lg:text-xl leading-relaxed relative z-10">
            {getExcerpt()}
          </p>
          
          {/* Metadatos mejorados */}
          <div className="flex items-center text-sm text-gray-500 mb-8 relative z-10">
            {post.author_info && (
              <div className="flex items-center mr-6">
                <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 mr-3 border-2 border-white shadow-lg">
                  {post.author_info.avatar_urls?.['48'] ? (
                    <DummyImage
                      src={post.author_info.avatar_urls['48']}
                      alt={post.author_info.name}
                      layout="fill"
                      objectFit="cover"
                    />
                  ) : (
                    <svg className="h-full w-full text-white p-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  )}
                </div>
                <div>
                  <div className="font-semibold text-gray-700">{post.author_info.name}</div>
                  <div className="text-xs text-gray-500">Autor</div>
                </div>
              </div>
            )}
            
            <div className="flex items-center text-blue-600">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{readTime} minutos</span>
            </div>
          </div>
          
          {/* Botón CTA mejorado */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative z-10"
          >
            <div className="inline-flex items-center bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-4 px-10 rounded-full shadow-xl hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all duration-300 group-hover:shadow-2xl">
              <span className="mr-3">LEER ARTÍCULO COMPLETO</span>
              <motion.svg 
                whileHover={{ x: 5 }}
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </motion.svg>
            </div>
          </motion.div>
          
          {/* Decorative line */}
          <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-blue-200 via-blue-300 to-transparent"></div>
        </div>
      </Link>
    </motion.article>
  );
};

export default FeaturedPostCard; 