"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getBlogPostBySlug, getRecentBlogPosts, WordPressBlogPost } from '@/services/wordpress';
import DummyImage from '@/app/components/DummyImageLoader';
import BlogSidebar from '@/app/components/blog/BlogSidebar';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import HLoader from '@/app/components/HLoader';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [post, setPost] = useState<WordPressBlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<WordPressBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const postData = await getBlogPostBySlug(slug);
        if (postData) {
          setPost(postData);
          
          // Obtener posts relacionados
          const recent = await getRecentBlogPosts(4);
          setRelatedPosts(recent.filter(p => p.id !== postData.id).slice(0, 3));
        } else {
          setError('Post no encontrado');
        }
      } catch (err) {
        console.error('❌ Error fetching post:', err);
        setError('Error al cargar el post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

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

  // Extraer imágenes del contenido HTML
  const extractImagesFromContent = (htmlContent: string): string[] => {
    if (!htmlContent) return [];
    
    const images: string[] = [];
    const imageRegex = /<img[^>]+src="([^"]+)"/gi;
    let match;
    
    while ((match = imageRegex.exec(htmlContent)) !== null) {
      const imageUrl = match[1];
              if ((imageUrl.includes('hospelia.co') || imageUrl.includes('wp.hospelia.co')) && 
          !imageUrl.includes('logo') && 
          !imageUrl.includes('icon') &&
          !imageUrl.includes('favicon')) {
        images.push(imageUrl);
      }
    }
    
    return images;
  };

  // Dividir contenido en párrafos
  const createParagraphs = (content: string): string[] => {
    return content
      .split(/\n\s*\n/)
      .filter(paragraph => paragraph.trim().length > 20)
      .map(paragraph => paragraph.trim());
  };

  // Calcular tiempo de lectura
  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const cleanContent = cleanWordPressContent(content);
    const words = cleanContent.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        
        {/* Hero Loading con HLoader */}
        <div className="relative pt-20 sm:pt-24 pb-12 sm:pb-16 bg-gradient-to-r from-blue-600 via-white to-blue-600">
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <HLoader size="large" className="mb-8" />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Cargando Artículo
                </h2>
                <p className="text-gray-600">
                  Preparando el contenido para ti...
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Content Loading con skeleton más elegante */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-3/4">
              <div className="animate-pulse space-y-8">
                <div className="h-64 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-2xl"></div>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-4/6"></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/4">
              <div className="animate-pulse space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-2xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        
        <div className="relative pt-20 sm:pt-24 pb-12 sm:pb-16 bg-gradient-to-r from-blue-600 via-white to-blue-600">
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {error || 'Post no encontrado'}
            </h1>
            <p className="text-gray-600 mb-8">
              El artículo que buscas no existe o ha sido movido.
            </p>
            <Link 
              href="/blog"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full hover:from-blue-600 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl font-bold"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver al blog
            </Link>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  const cleanTitle = cleanWordPressContent(post.title.rendered);
  const cleanContent = cleanWordPressContent(post.content.rendered);
  const cleanExcerpt = cleanWordPressContent(post.excerpt?.rendered || '');
  const contentImages = extractImagesFromContent(post.content.rendered);
  const contentParagraphs = createParagraphs(cleanContent);
  const readTime = calculateReadTime(cleanContent);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section del Post */}
      <div className="relative pt-20 sm:pt-24 pb-12 sm:pb-16 bg-gradient-to-r from-blue-600 via-white to-blue-600">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <motion.nav 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 text-sm mb-8"
          >
            <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
              Inicio
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/blog" className="text-gray-600 hover:text-blue-600 transition-colors">
              Blog
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">Artículo</span>
          </motion.nav>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white/90 text-sm font-semibold mb-6"
          >
            <svg className="w-5 h-5 mr-2 text-blue-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
            </svg>
            Blog de Hospelia
          </motion.div>

          {/* Título */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight"
          >
            {cleanTitle}
          </motion.h1>

          {/* Metadatos */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center gap-6 text-gray-600"
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">{formatDate(post.date)}</span>
            </div>
            
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{readTime} min de lectura</span>
            </div>

            {post.author_info && (
              <div className="flex items-center">
                <div className="relative h-8 w-8 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 mr-3 border-2 border-white shadow-md">
                  {post.author_info.avatar_urls?.['48'] ? (
                    <DummyImage
                      src={post.author_info.avatar_urls['48']}
                      alt={post.author_info.name}
                      layout="fill"
                      objectFit="cover"
                    />
                  ) : (
                    <svg className="h-full w-full text-white p-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  )}
                </div>
                <span className="font-medium">Por {post.author_info.name}</span>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Imagen destacada */}
      {(post.featured_media_url || contentImages.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-12"
        >
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200">
            <DummyImage
              src={post.featured_media_url || contentImages[0]}
              alt={cleanTitle}
              layout="fill"
              objectFit="cover"
              className="hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </motion.div>
      )}

      {/* Contenido principal */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          {/* Extracto/Introducción */}
          {cleanExcerpt && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-blue-50 border-l-4 border-blue-500 p-8 rounded-r-2xl mb-12"
            >
              <p className="text-xl text-gray-700 leading-relaxed font-medium italic">
                {cleanExcerpt}
              </p>
            </motion.div>
          )}

          {/* Contenido por párrafos */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            {contentParagraphs.map((paragraph, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  {paragraph}
                </p>
                
                {/* Insertar imágenes del contenido entre párrafos */}
                {contentImages[index + 1] && (
                  <div className="my-12">
                    <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg">
                      <DummyImage
                        src={contentImages[index + 1]}
                        alt={`Imagen ${index + 2} del artículo`}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Galería de imágenes restantes */}
          {contentImages.length > 2 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-16"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Galería de imágenes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contentImages.slice(2).map((image, index) => (
                  <div key={index} className="relative aspect-video rounded-xl overflow-hidden shadow-md">
                    <DummyImage
                      src={image}
                      alt={`Galería imagen ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                      className="hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-16 bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl p-8 sm:p-12 text-center text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          
          <div className="relative z-10">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              ¿Te gustó este artículo?
            </h3>
            <p className="text-blue-100 mb-8 text-lg">
              Descubre los mejores alojamientos en Cali y vive experiencias únicas
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-blue-700 font-bold py-4 px-8 rounded-full hover:bg-blue-50 transition-colors duration-300 shadow-lg"
                >
                  Ver Propiedades
                </motion.button>
              </Link>
              <Link href="/blog">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white font-bold py-4 px-8 rounded-full hover:bg-white hover:text-blue-700 transition-colors duration-300"
                >
                  Más Artículos
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Posts relacionados */}
        {relatedPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-20"
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
              Te puede interesar
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost, index) => (
                <motion.div
                  key={relatedPost.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Link href={`/blog/${relatedPost.slug}`}>
                    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 h-full flex flex-col">
                      <div className="relative aspect-video">
                        <DummyImage
                          src={relatedPost.featured_media_url || '/placeholder-blog.jpg'}
                          alt={cleanWordPressContent(relatedPost.title.rendered)}
                          layout="fill"
                          objectFit="cover"
                          className="hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-6 flex-grow flex flex-col">
                        <h4 className="font-bold text-gray-900 mb-3 line-clamp-2 text-lg leading-tight">
                          {cleanWordPressContent(relatedPost.title.rendered)}
                        </h4>
                        <p className="text-gray-600 text-sm flex-grow line-clamp-3 mb-4">
                          {cleanWordPressContent(relatedPost.excerpt?.rendered || '').substring(0, 120)}...
                        </p>
                        <div className="flex items-center text-blue-600 font-medium text-sm mt-auto">
                          <span>Leer artículo</span>
                          <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}