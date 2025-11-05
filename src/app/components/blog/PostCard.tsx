"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { WordPressBlogPost } from '@/services/wordpress';
import DummyImage from '../DummyImageLoader';

interface PostCardProps {
  post: WordPressBlogPost;
  className?: string;
  imageClassName?: string;
}

const PostCard: React.FC<PostCardProps> = ({ post, className = "", imageClassName = "" }) => {
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

  // Crear extracto personalizado si no existe o es muy corto
  const getExcerpt = () => {
    if (cleanExcerpt && cleanExcerpt.length > 50) {
      return cleanExcerpt.substring(0, 180) + '...';
    }
    
    // Si no hay extracto, crear uno del contenido
    const contentText = cleanWordPressContent(post.content?.rendered || '');
    if (contentText.length > 100) {
      return contentText.substring(0, 180) + '...';
    }
    
    return 'Descubre más sobre Cali y sus mejores experiencias en este artículo de Hospelia.';
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      className={`bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col group h-full border border-gray-200 ${className}`}
    >
      <Link href={`/blog/${post.slug}`} className="block h-full flex flex-col">
        {/* Imagen destacada */}
        <div className={`relative w-full h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 ${imageClassName}`}>
          {post.featured_media_url ? (
            <Image
              src={post.featured_media_url}
              alt={post.title.rendered}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="transform group-hover:scale-110 transition-transform duration-700 object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <svg className="w-20 h-20 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Badge de categoría */}
          <div className="absolute top-4 left-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white text-xs font-bold uppercase px-4 py-2 rounded-full shadow-lg backdrop-blur-sm border border-white/20">
              <span className="flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                </svg>
                Blog
              </span>
            </div>
          </div>

          {/* Time to read badge */}
          <div className="absolute top-4 right-4">
            <div className="bg-black/30 backdrop-blur-md text-white text-xs font-medium px-3 py-1 rounded-full border border-white/20">
              {readTime} min
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 sm:p-8 flex-grow flex flex-col">
          {/* Categoría superior */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Hospelia Guide
            </span>
            <span className="text-xs text-gray-500 font-medium">
              {formatDate(post.date)}
            </span>
          </div>
          
          {/* Título */}
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300 leading-tight line-clamp-2">
            {cleanWordPressContent(post.title.rendered)}
          </h3>
          
          {/* Excerpt */}
          <p className="text-gray-600 text-sm sm:text-base mb-6 flex-grow line-clamp-3 leading-relaxed">
            {getExcerpt()}
          </p>
          
          {/* Footer del card */}
          <div className="mt-auto">
            {/* CTA mejorado */}
            <div className="flex items-center justify-between mb-4">
              <motion.div 
                whileHover={{ x: 5 }}
                className="flex items-center text-blue-600 font-bold group-hover:text-blue-700 transition-colors text-sm"
              >
                <span>LEER ARTÍCULO</span>
                <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.div>
            </div>
            
            {/* Línea decorativa */}
            <div className="w-full h-px bg-gradient-to-r from-blue-200 via-blue-300 to-transparent mb-4"></div>
            
            {/* Autor y metadata */}
            <div className="flex items-center justify-between">
              {post.author_info && (
                <div className="flex items-center">
                  <div className="relative h-8 w-8 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 mr-3 border-2 border-white shadow-md">
                    {post.author_info.avatar_urls?.['48'] ? (
                      <Image
                        src={post.author_info.avatar_urls['48']}
                        alt={post.author_info.name}
                        fill
                        sizes="32px"
                        className="object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <svg className="h-full w-full text-white p-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-700">{post.author_info.name}</span>
                    <div className="text-xs text-gray-500">Autor</div>
                  </div>
                </div>
              )}
              
              <div className="text-right">
                <div className="flex items-center text-blue-600">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs font-medium">{readTime} min lectura</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default PostCard; 