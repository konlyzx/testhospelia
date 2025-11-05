"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import PostCard from '@/app/components/blog/PostCard';
import { motion } from 'framer-motion';
import { getAllBlogPosts, type WordPressBlogPost } from '@/services/wordpress';
import Link from 'next/link';

export default function DestinoPage() {
  const params = useParams();
  const destino = params.destino as string;
  const [posts, setPosts] = useState<WordPressBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mapeo de destinos URL a nombres legibles
  const destinoNames: { [key: string]: string } = {
    'centro-historico': 'Centro Histórico',
    'san-antonio': 'San Antonio',
    'granada': 'Granada',
    'el-peñon': 'El Peñón',
    'zona-rosa': 'Zona Rosa',
    'ciudad-jardin': 'Ciudad Jardín',
    'valle-del-lili': 'Valle del Lilí',
    'unicentro': 'Unicentro',
    'chipichape': 'Chipichape',
    'la-flora': 'La Flora'
  };

  const destinoName = destinoNames[destino] || destino.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());

  // Descripción de cada destino
  const destinoDescriptions: { [key: string]: string } = {
    'centro-historico': 'El corazón colonial de Cali, lleno de historia, cultura y arquitectura tradicional',
    'san-antonio': 'Barrio bohemio con iglesias históricas, galerías de arte y vida nocturna vibrante',
    'granada': 'Zona comercial y gastronómica, perfecta para shopping y experiencias culinarias',
    'el-peñon': 'Zona residencial y comercial con centros comerciales y fácil acceso a servicios',
    'zona-rosa': 'Área de entretenimiento nocturno, bares, discotecas y restaurantes',
    'ciudad-jardin': 'Sector residencial exclusivo con parques, centros comerciales y restaurantes',
    'valle-del-lili': 'Zona moderna con centros médicos, empresariales y comerciales',
    'unicentro': 'Área comercial con uno de los centros comerciales más grandes de la ciudad',
    'chipichape': 'Zona comercial norte con mall, restaurantes y fácil acceso al aeropuerto',
    'la-flora': 'Barrio tradicional con parques, iglesias y ambiente familiar'
  };

  const destinoDescription = destinoDescriptions[destino] || `Descubre todo sobre ${destinoName} en Cali`;

  useEffect(() => {
    const fetchDestinationPosts = async () => {
      try {
        setLoading(true);
        const result = await getAllBlogPosts(1, 20);
        
        // Filtro simulado por destino (en la implementación real usarías parámetros específicos)
        const filteredPosts = result.posts.filter(post => {
          const postTitle = post.title.rendered.toLowerCase();
          const postContent = post.content.rendered.toLowerCase();
          const destinoKey = destino.toLowerCase().replace('-', ' ');
          
          return postTitle.includes(destinoKey) || 
                 postContent.includes(destinoKey) ||
                 postTitle.includes('cali') ||
                 postTitle.includes('destino') ||
                 postTitle.includes('lugar');
        });

        setPosts(filteredPosts);
      } catch (err) {
        setError('Error al cargar los posts del destino');
        console.error('Error fetching destination posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinationPosts();
  }, [destino]);

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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando destino...</p>
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
        <section className="bg-gradient-to-r from-purple-600 to-purple-800 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="text-center"
            >
              {/* Breadcrumb */}
              <nav className="flex justify-center items-center space-x-2 text-sm mb-8">
                <Link href="/" className="text-purple-200 hover:text-white transition-colors">
                  Inicio
                </Link>
                <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <Link href="/blog" className="text-purple-200 hover:text-white transition-colors">
                  Blog
                </Link>
                <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-white font-medium">Destinos</span>
                <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-white font-medium">{destinoName}</span>
              </nav>

              <div className="flex items-center justify-center mb-6">
                <svg className="w-16 h-16 text-white mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  {destinoName}
                </h1>
              </div>
              
              <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
                {destinoDescription}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                  <div className="text-3xl font-bold text-white mb-2">{posts.length}</div>
                  <div className="text-white/80 text-sm">
                    {posts.length === 1 ? 'Artículo' : 'Artículos'}
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                  <div className="text-3xl font-bold text-white mb-2">
                    <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                  <div className="text-white/80 text-sm">Destino</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                  <div className="text-3xl font-bold text-white mb-2">
                    <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <div className="text-white/80 text-sm">Hospedaje</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                  <div className="text-3xl font-bold text-white mb-2">
                    <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div className="text-white/80 text-sm">Recomendado</div>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Próximamente contenido sobre {destinoName}
                </h3>
                <p className="text-gray-600 mb-8">
                  Estamos preparando artículos detallados sobre {destinoName}. 
                  Mientras tanto, descubre nuestras propiedades en esta zona.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href="/propiedades"
                    className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Ver Propiedades en {destinoName}
                  </Link>
                  <Link 
                    href="/blog"
                    className="inline-flex items-center px-6 py-3 border border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Volver al blog
                  </Link>
                </div>
              </motion.div>
            ) : (
              <>
                {/* Destination Info */}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  className="mb-12 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-8"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Descubre {destinoName}
                      </h2>
                      <p className="text-gray-700 leading-relaxed mb-6">
                        {destinoDescription}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-sm font-medium">
                          Zona Popular
                        </span>
                        <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm font-medium">
                          Bien Conectado
                        </span>
                        <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm font-medium">
                          Hospedaje Disponible
                        </span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="w-32 h-32 bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-16 h-16 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <Link
                        href="/propiedades"
                        className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
                      >
                        Ver Alojamientos
                      </Link>
                    </div>
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

            {/* Related Destinations */}
            {posts.length > 0 && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                variants={fadeIn}
                viewport={{ once: true }}
                className="mt-16 bg-gray-50 rounded-2xl p-8"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Otros destinos populares en Cali
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(destinoNames)
                    .filter(([key]) => key !== destino)
                    .slice(0, 4)
                    .map(([key, name]) => (
                      <Link
                        key={key}
                        href={`/blog/destino/${key}`}
                        className="block p-4 bg-white rounded-lg hover:bg-purple-50 transition-colors border border-gray-200 hover:border-purple-300"
                      >
                        <div className="text-center">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <p className="font-medium text-gray-900 text-sm">{name}</p>
                        </div>
                      </Link>
                    ))}
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