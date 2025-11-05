"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import PostCard from '@/app/components/blog/PostCard';
import { motion } from 'framer-motion';
import { getAllBlogPosts, type WordPressBlogPost } from '@/services/wordpress';
import Link from 'next/link';

export default function CategoriaPage() {
  const params = useParams();
  const categoria = params.categoria as string;
  const [posts, setPosts] = useState<WordPressBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mapeo de categorías URL a nombres legibles
  const categoriaNames: { [key: string]: string } = {
    'lugares-cali': 'Lugares en Cali',
    'gastronomia': 'Gastronomía',
    'cultura-salsa': 'Cultura y Salsa',
    'hospedaje': 'Hospedaje',
    'transporte': 'Transporte',
    'turismo': 'Turismo',
    'eventos': 'Eventos',
    'vida-nocturna': 'Vida Nocturna'
  };

  const categoriaName = categoriaNames[categoria] || categoria.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());

  useEffect(() => {
    const fetchCategoryPosts = async () => {
      try {
        setLoading(true);
        // Simulamos filtrar por categoría (en un caso real, buscarías por categoria específica)
        const result = await getAllBlogPosts(1, 20);
        
        // Filtro simulado por categoría (en la implementación real usarías parámetros de categoría)
        const filteredPosts = result.posts.filter(post => {
          const postTitle = post.title.rendered.toLowerCase();
          const postContent = post.content.rendered.toLowerCase();
          
          switch(categoria) {
            case 'lugares-cali':
              return postTitle.includes('cali') || postTitle.includes('lugar') || postTitle.includes('sitio');
            case 'gastronomia':
              return postTitle.includes('comida') || postTitle.includes('restaurante') || postTitle.includes('gastronomía');
            case 'cultura-salsa':
              return postTitle.includes('salsa') || postTitle.includes('cultura') || postTitle.includes('música');
            case 'hospedaje':
              return postTitle.includes('hotel') || postTitle.includes('hospedaje') || postTitle.includes('alojamiento');
            case 'transporte':
              return postTitle.includes('transporte') || postTitle.includes('movilidad') || postTitle.includes('taxi');
            default:
              return true;
          }
        });

        setPosts(filteredPosts);
      } catch (err) {
        setError('Error al cargar los posts de la categoría');
        console.error('Error fetching category posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryPosts();
  }, [categoria]);

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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando artículos...</p>
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
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="text-center"
            >
              {/* Breadcrumb */}
              <nav className="flex justify-center items-center space-x-2 text-sm mb-8">
                <Link href="/" className="text-blue-200 hover:text-white transition-colors">
                  Inicio
                </Link>
                <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <Link href="/blog" className="text-blue-200 hover:text-white transition-colors">
                  Blog
                </Link>
                <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-white font-medium">Categorías</span>
                <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-white font-medium">{categoriaName}</span>
              </nav>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {categoriaName}
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Descubre todo sobre {categoriaName.toLowerCase()} en nuestro blog de Hospelia
              </p>
              <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-md mx-auto">
                <div className="text-3xl font-bold text-white mb-2">{posts.length}</div>
                <div className="text-white/80 text-sm">
                  {posts.length === 1 ? 'Artículo encontrado' : 'Artículos encontrados'}
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  No hay artículos en esta categoría
                </h3>
                <p className="text-gray-600 mb-8">
                  Pronto publicaremos contenido sobre {categoriaName.toLowerCase()}. 
                  Mientras tanto, explore otras categorías.
                </p>
                <Link 
                  href="/blog"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Volver al blog
                </Link>
              </motion.div>
            ) : (
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
            )}

            {/* CTA Section */}
            {posts.length > 0 && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                variants={fadeIn}
                viewport={{ once: true }}
                className="mt-16 text-center bg-gray-50 rounded-2xl p-8"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  ¿Te gustó nuestro contenido sobre {categoriaName}?
                </h3>
                <p className="text-gray-600 mb-6">
                  Descubre nuestros apartamentos amoblados en Cali y vive la experiencia completa
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/propiedades"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Ver Propiedades
                  </Link>
                  <Link
                    href="/blog"
                    className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold rounded-lg transition-colors"
                  >
                    Más Artículos
                  </Link>
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