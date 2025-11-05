"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import PostCard from '@/app/components/blog/PostCard';
import { motion } from 'framer-motion';
import { getAllBlogPosts, type WordPressBlogPost } from '@/services/wordpress';
import Link from 'next/link';

export default function ArchivoPage() {
  const params = useParams();
  const year = params.year as string;
  const month = params.month as string;
  const [posts, setPosts] = useState<WordPressBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mapeo de meses
  const monthNames: { [key: string]: string } = {
    'enero': 'Enero',
    'febrero': 'Febrero', 
    'marzo': 'Marzo',
    'abril': 'Abril',
    'mayo': 'Mayo',
    'junio': 'Junio',
    'julio': 'Julio',
    'agosto': 'Agosto',
    'septiembre': 'Septiembre',
    'octubre': 'Octubre',
    'noviembre': 'Noviembre',
    'diciembre': 'Diciembre'
  };

  const monthName = monthNames[month] || month.charAt(0).toUpperCase() + month.slice(1);

  useEffect(() => {
    const fetchArchivePosts = async () => {
      try {
        setLoading(true);
        const result = await getAllBlogPosts(1, 50);
        
        // Filtrar posts por año y mes
        const filteredPosts = result.posts.filter(post => {
          const postDate = new Date(post.date);
          const postYear = postDate.getFullYear().toString();
          const postMonth = postDate.getMonth(); // 0-11
          
          // Convertir el mes en español a número
          const monthNumber = Object.keys(monthNames).indexOf(month);
          
          return postYear === year && postMonth === monthNumber;
        });

        setPosts(filteredPosts);
      } catch (err) {
        setError('Error al cargar los posts del archivo');
        console.error('Error fetching archive posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArchivePosts();
  }, [year, month]);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando archivo...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-600 to-green-800 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="text-center"
            >
              {/* Breadcrumb */}
              <nav className="flex justify-center items-center space-x-2 text-sm mb-8">
                <Link href="/" className="text-green-200 hover:text-white transition-colors">
                  Inicio
                </Link>
                <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <Link href="/blog" className="text-green-200 hover:text-white transition-colors">
                  Blog
                </Link>
                <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-white font-medium">Archivo</span>
                <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-white font-medium">{monthName} {year}</span>
              </nav>

              <div className="flex items-center justify-center mb-6">
                <svg className="w-16 h-16 text-white mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  Archivo de {monthName} {year}
                </h1>
              </div>
              
              <p className="text-xl text-green-100 max-w-3xl mx-auto">
                Todos los artículos publicados en {monthName} de {year}
              </p>
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                  <div className="text-3xl font-bold text-white mb-2">{posts.length}</div>
                  <div className="text-white/80 text-sm">
                    {posts.length === 1 ? 'Artículo' : 'Artículos'}
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                  <div className="text-3xl font-bold text-white mb-2">{monthName}</div>
                  <div className="text-white/80 text-sm">Mes</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                  <div className="text-3xl font-bold text-white mb-2">{year}</div>
                  <div className="text-white/80 text-sm">Año</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Posts Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
                {error}
              </div>
            )}

            {posts.length === 0 && !loading && !error ? (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="text-center py-16"
              >
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  No hay artículos en {monthName} {year}
                </h3>
                <p className="text-gray-600 mb-8">
                  No se publicaron artículos durante este período. 
                  Explore otros meses o visite nuestro blog principal.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href="/blog"
                    className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Volver al blog
                  </Link>
                  <Link 
                    href="/"
                    className="inline-flex items-center px-6 py-3 border border-green-600 text-green-600 hover:bg-green-50 font-semibold rounded-lg transition-colors"
                  >
                    Ver Propiedades
                  </Link>
                </div>
              </motion.div>
            ) : (
              <>
                {/* Timeline Header */}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  className="mb-12"
                >
                  <div className="flex items-center">
                    <div className="h-px bg-gray-300 flex-1"></div>
                    <div className="px-6 py-3 bg-green-100 text-green-800 rounded-full font-semibold">
                      {monthName} {year}
                    </div>
                    <div className="h-px bg-gray-300 flex-1"></div>
                  </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {posts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <PostCard post={post} />
                    </motion.div>
                  ))}
                </div>
              </>
            )}

            {/* Navigation Section */}
            {posts.length > 0 && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                variants={fadeIn}
                viewport={{ once: true }}
                className="mt-16 bg-gray-50 rounded-2xl p-8"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Explorar más contenido
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Más Artículos</h4>
                    <p className="text-gray-600 text-sm mb-4">Descubre todos nuestros artículos</p>
                    <Link 
                      href="/blog"
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      Ver Blog →
                    </Link>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2v0a2 2 0 002-2h10" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Categorías</h4>
                    <p className="text-gray-600 text-sm mb-4">Explora por temas de interés</p>
                    <Link 
                      href="/blog"
                      className="text-green-600 hover:text-green-700 font-medium text-sm"
                    >
                      Ver Categorías →
                    </Link>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Propiedades</h4>
                    <p className="text-gray-600 text-sm mb-4">Encuentra tu alojamiento ideal</p>
                    <Link 
                      href="/propiedades"
                      className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                    >
                      Ver Propiedades →
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}