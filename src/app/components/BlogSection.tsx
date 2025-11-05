import React, { useEffect, useState } from 'react';
import { getRecentBlogPosts, WordPressBlogPost, getBlogCacheInfo, getTimeUntilNextBlogRefresh } from '@/services/wordpress';
import DummyImage from './DummyImageLoader';
import HLoader from './HLoader';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Hook personalizado para manejar el estado del blog
const useBlogCache = () => {
  const [cacheInfo, setCacheInfo] = useState({
    hasCache: false,
    cacheExpired: false,
    timeUntilExpiry: 0,
    lastFetched: null as Date | null,
  });

  useEffect(() => {
    // Actualizar información del caché cada minuto
    const updateCacheInfo = () => {
      const info = getBlogCacheInfo();
      setCacheInfo(info);
    };

    updateCacheInfo();
    const interval = setInterval(updateCacheInfo, 60000); // Cada minuto

    return () => clearInterval(interval);
  }, []);

  return cacheInfo;
};

export default function BlogSection() {
  const [posts, setPosts] = useState<WordPressBlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const cacheInfo = useBlogCache();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Cargar desde caché primero (más rápido)
        const recentPosts = await getRecentBlogPosts(3);
        setPosts(recentPosts);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        // Si hay error, mostrar contenido por defecto sin loader
        setPosts([]);
      }
    };

    // Cargar inmediatamente sin loader
    fetchPosts();
  }, []);

  // Log de información de caché en desarrollo
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && cacheInfo.hasCache) {
      console.log('📰 Blog Cache Info:', {
        hasCache: cacheInfo.hasCache,
        expired: cacheInfo.cacheExpired,
        lastFetched: cacheInfo.lastFetched,
        nextRefresh: getTimeUntilNextBlogRefresh(),
      });
    }
  }, [cacheInfo]);

  // Calcular tiempo de lectura
  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Últimas noticias del blog
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Mantente al día con consejos de viaje, guías de Cali y novedades de Hospelia
          </p>
        </motion.div>

        {posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center py-12"
          >
            <div className="max-w-md mx-auto">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay posts disponibles
              </h3>
              <p className="text-gray-500">
                Estamos trabajando en traerte el mejor contenido sobre Cali y turismo.
              </p>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Grid de posts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {posts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group h-full flex flex-col"
                >
                  <Link href={`/blog/${post.slug}`} className="block h-full flex flex-col">
                    {/* Imagen destacada */}
                    <div className="relative h-48 bg-gray-200 overflow-hidden">
                      {post.featured_media_url ? (
                        <DummyImage
                          src={post.featured_media_url}
                          alt={post.title.rendered}
                          layout="fill"
                          objectFit="cover"
                          className="transform group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                        </div>
                      )}
                      
                      {/* Badge */}
                      <div className="absolute top-4 left-4 bg-teal-500 text-white text-xs font-bold uppercase px-3 py-1 rounded shadow-md">
                        Blog
                      </div>
                    </div>

                    {/* Contenido */}
                    <div className="p-6 flex-grow flex flex-col">
                      {/* Fecha */}
                      <div className="text-sm text-gray-500 mb-2">
                        {formatDate(post.date)}
                      </div>

                      {/* Título */}
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                        {post.title.rendered}
                      </h3>

                      {/* Excerpt */}
                      <div 
                        className="text-gray-600 mb-4 line-clamp-3 flex-grow"
                        dangerouslySetInnerHTML={{ 
                          __html: post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
                        }}
                      />

                      {/* Footer del card */}
                      <div className="mt-auto">
                        {/* Metadatos */}
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                          <span>{calculateReadTime(post.content.rendered)} min de lectura</span>
                          {post.author_info && (
                            <span>Por {post.author_info.name}</span>
                          )}
                        </div>

                        {/* Botón leer más */}
                        <div className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
                          Leer más
                          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>

            {/* Botón ver todos los posts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Link
                href="/blog"
                className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Ver todos los artículos
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            </motion.div>

            {/* Información de caché (solo en desarrollo) */}
            {process.env.NODE_ENV === 'development' && cacheInfo.hasCache && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
                className="mt-8 text-center"
              >
                <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-600 text-xs rounded-full">
                  <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {cacheInfo.cacheExpired ? (
                    'Blog: Actualización disponible'
                  ) : (
                    `Blog: Próxima actualización en ${getTimeUntilNextBlogRefresh()}`
                  )}
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
} 