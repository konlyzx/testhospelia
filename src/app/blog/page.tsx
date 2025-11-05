"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllBlogPosts, BlogPostsResponse, clearBlogCache } from '@/services/wordpress';
import PostCard from '@/app/components/blog/PostCard';
import FeaturedPostCard from '@/app/components/blog/FeaturedPostCard';
import BlogSidebar from '@/app/components/blog/BlogSidebar';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import HLoader from '@/app/components/HLoader';
import { FaSync, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

// Skeleton optimizado para mejor CLS
const BlogSkeleton = () => (
  <div className="animate-pulse">
    {/* Featured post skeleton */}
    <div className="mb-16">
      <div className="h-8 bg-gray-300 rounded w-64 mb-8 mx-auto"></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="aspect-[16/10] bg-gray-300 rounded-2xl"></div>
        <div className="space-y-4 flex flex-col justify-center">
          <div className="h-4 bg-gray-300 rounded w-24"></div>
          <div className="h-8 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-10 bg-gray-300 rounded w-32 mt-6"></div>
        </div>
      </div>
    </div>

    {/* Regular posts skeleton */}
    <div className="mb-16">
      <div className="h-8 bg-gray-300 rounded w-48 mb-8 mx-auto"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="aspect-[16/10] bg-gray-300 rounded-xl"></div>
            <div className="h-4 bg-gray-300 rounded w-20"></div>
            <div className="h-6 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default function BlogPage() {
  const [blogData, setBlogData] = useState<BlogPostsResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const postsPerPage = 9; // Aumentado para mejor UX

  const fetchPosts = useCallback(async (page: number, showLoading = true, forceRefresh = false) => {
    if (showLoading) setLoading(true);
    try {
      const data = await getAllBlogPosts(page, postsPerPage, forceRefresh);
      setBlogData(data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, [postsPerPage]);

  // Función para refrescar el contenido manualmente
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      clearBlogCache();
      await fetchPosts(currentPage, false, true);
    } catch (error) {
      console.error('Error al actualizar el blog:', error);
    } finally {
      setRefreshing(false);
    }
  }, [currentPage, fetchPosts]);

  useEffect(() => {
    fetchPosts(currentPage, initialLoad);
  }, [currentPage, fetchPosts, initialLoad]);

  const handlePageChange = (newPage: number) => {
    if (newPage === currentPage || loading) return;
    setCurrentPage(newPage);
    // Scroll suave al contenido principal
    const mainContent = document.querySelector('#blog-content');
    if (mainContent) {
      mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Memoizar cálculos de paginación
  const paginationInfo = useMemo(() => {
    if (!blogData) return { totalPages: 0, hasNext: false, hasPrev: false };
    
    const totalPages = Math.ceil(blogData.totalPosts / postsPerPage);
    return {
      totalPages,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1
    };
  }, [blogData, currentPage, postsPerPage]);

  // Separar posts por tipo para mejor layout
  const postsLayout = useMemo(() => {
    if (!blogData?.posts || blogData.posts.length === 0) {
      return { featuredPost: null, mainPosts: [], remainingPosts: [] };
    }

    const [featuredPost, ...otherPosts] = blogData.posts;
    const mainPosts = otherPosts.slice(0, 2); // Siguientes 2 posts principales
    const remainingPosts = otherPosts.slice(2); // Resto de posts

    return { featuredPost, mainPosts, remainingPosts };
  }, [blogData]);

  if (initialLoad && loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        
        {/* Hero Loading optimizado */}
        <div className="relative pt-24 pb-16 hero-gradient">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              <HLoader size="large" className="mb-6" />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <h2 className="text-2xl font-bold text-white mb-2">
                  Cargando Blog de Hospelia
                </h2>
                <p className="text-white/80">
                  Preparando los mejores artículos para ti...
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Content Loading optimizado */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <BlogSkeleton />
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section optimizado */}
      <div className="relative pt-24 pb-16 hero-gradient">
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge optimizado */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white/90 text-sm font-medium mb-6"
            >
              <svg className="w-4 h-4 mr-2 text-blue-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
              </svg>
              Tu guía completa para Cali
            </motion.div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Blog de <span className="text-blue-300">Hospelia</span>
            </h1>
            
            <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
              Descubre los secretos de Cali, encuentra los mejores lugares para visitar 
              y vive experiencias únicas en la Capital de la Salsa
            </p>

            {/* Stats optimizados */}
            {blogData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-wrap justify-center gap-4 mb-6"
              >
                <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20">
                  <div className="text-2xl font-bold text-white">{blogData.totalPosts}</div>
                  <div className="text-white/80 text-xs">Artículos</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20">
                  <div className="text-2xl font-bold text-white">5+</div>
                  <div className="text-white/80 text-xs">Categorías</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20">
                  <div className="text-2xl font-bold text-white">2025</div>
                  <div className="text-white/80 text-xs">Actualizado</div>
                </div>
              </motion.div>
            )}
            
            {/* Botón de actualización optimizado */}
            <motion.button
              onClick={handleRefresh}
              disabled={refreshing || loading}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                inline-flex items-center px-6 py-3 rounded-full font-medium text-sm transition-all duration-200
                ${refreshing || loading 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl'
                }
              `}
            >
              <FaSync className={`mr-2 w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Actualizando...' : 'Actualizar contenido'}
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Main Content optimizado */}
      <main id="blog-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <BlogSkeleton />
            </motion.div>
          ) : blogData?.posts && blogData.posts.length > 0 ? (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >

              {/* Posts Principales (siguientes 2) */}
              {postsLayout.mainPosts.length > 0 && (
                <section className="mb-20">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <div className="text-center mb-12">
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Artículos Principales
                      </h2>
                      <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-600 mx-auto rounded-full"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {postsLayout.mainPosts.map((post, index) => (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 group"
                        >
                          <PostCard 
                            post={post} 
                            className="h-full"
                            imageClassName="aspect-[16/10]"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </section>
              )}

              {/* Divisor decorativo */}
              {postsLayout.remainingPosts.length > 0 && (
                <div className="flex items-center justify-center mb-20">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-px bg-gradient-to-r from-transparent to-gray-300"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="w-8 h-px bg-gray-300"></div>
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <div className="w-16 h-px bg-gradient-to-l from-transparent to-gray-300"></div>
                  </div>
                </div>
              )}

              {/* Posts Restantes */}
              {postsLayout.remainingPosts.length > 0 && (
                <section className="mb-20">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <div className="text-center mb-12">
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Más Artículos
                      </h2>
                      <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-red-500 mx-auto rounded-full"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {postsLayout.remainingPosts.map((post, index) => (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                          className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group"
                        >
                          <PostCard 
                            post={post} 
                            className="h-full"
                            imageClassName="aspect-[16/10]"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </section>
              )}

              {/* Paginación optimizada */}
              {paginationInfo.totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex items-center justify-center space-x-2 mt-16"
                >
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!paginationInfo.hasPrev || loading}
                    className={`
                      flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200
                      ${!paginationInfo.hasPrev || loading
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md'
                      }
                    `}
                  >
                    <FaArrowLeft className="w-4 h-4 mr-2" />
                    Anterior
                  </button>

                  <div className="flex items-center space-x-1">
                    {[...Array(paginationInfo.totalPages)].map((_, index) => {
                      const pageNum = index + 1;
                      const isCurrentPage = pageNum === currentPage;
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          disabled={loading}
                          className={`
                            w-10 h-10 rounded-lg font-medium transition-all duration-200
                            ${isCurrentPage
                              ? 'bg-blue-600 text-white shadow-lg'
                              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                            }
                            ${loading ? 'cursor-not-allowed opacity-50' : 'hover:shadow-md'}
                          `}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!paginationInfo.hasNext || loading}
                    className={`
                      flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200
                      ${!paginationInfo.hasNext || loading
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md'
                      }
                    `}
                  >
                    Siguiente
                    <FaArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 mx-auto mb-6 text-gray-400">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No hay artículos disponibles</h3>
              <p className="text-gray-600 mb-8">
                Parece que no hay contenido disponible en este momento.
              </p>
              <button
                onClick={handleRefresh}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaSync className="mr-2" />
                Intentar de nuevo
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
} 
