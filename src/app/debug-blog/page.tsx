"use client";

import { useEffect, useState } from 'react';
import { getAllBlogPosts, getBlogPostBySlug } from '@/services/wordpress';
import { transformDomainUrl } from '@/utils/urlTransformer';

export default function DebugBlog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [specificPost, setSpecificPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDebugData = async () => {
      try {
        // Obtener primeros 5 posts para debug
        const blogPosts = await getAllBlogPosts(1, 5);
        setPosts(blogPosts.posts);
        
        // Buscar el post específico por diferentes variaciones del slug
        const possibleSlugs = [
          'descubre-cali-colombia-5-razones-irresistibles-para-visitar-la-ciudad-de-la-salsa',
          'descubre-cali-colombia',
          'cali-colombia-5-razones',
          'razones-visitar-cali'
        ];
        
        for (const slug of possibleSlugs) {
          try {
            const post = await getBlogPostBySlug(slug);
            if (post) {
              setSpecificPost(post);
              break;
            }
          } catch (e) {
            console.warn(`No se encontró post con slug: ${slug}`);
          }
        }
        
      } catch (err) {
        setError(`Error: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDebugData();
  }, []);

  const testUrlTransformation = (url: string) => {
    return transformDomainUrl(url);
  };

  if (loading) return <div className="p-8">Cargando debug...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug del Blog</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {/* Test de transformación de URLs */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test de Transformación de URLs</h2>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Original:</strong> https://hospelia.co/wp-content/uploads/imagen.jpg<br/>
              <strong>Transformado:</strong> {testUrlTransformation('https://hospelia.co/wp-content/uploads/imagen.jpg')}
            </div>
            <div>
              <strong>Original:</strong> http://hospelia.co/wp-content/uploads/imagen.jpg<br/>
              <strong>Transformado:</strong> {testUrlTransformation('http://hospelia.co/wp-content/uploads/imagen.jpg')}
            </div>
            <div>
              <strong>Original:</strong> https://wp.hospelia.co/wp-content/uploads/imagen.jpg<br/>
              <strong>Transformado:</strong> {testUrlTransformation('https://wp.hospelia.co/wp-content/uploads/imagen.jpg')}
            </div>
          </div>
        </div>
        
        {/* Post específico */}
        {specificPost ? (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Post Específico Encontrado</h2>
            <div className="space-y-2">
              <p><strong>ID:</strong> {specificPost.id}</p>
              <p><strong>Título:</strong> {specificPost.title?.rendered}</p>
              <p><strong>Slug:</strong> {specificPost.slug}</p>
              <p><strong>Imagen destacada:</strong> {specificPost.featured_media_url || 'No tiene'}</p>
              <p><strong>Fecha:</strong> {specificPost.date}</p>
              {specificPost.featured_media_url && (
                <div>
                  <p><strong>Imagen de prueba:</strong></p>
                  <img 
                    src={specificPost.featured_media_url} 
                    alt="Test" 
                    className="w-32 h-32 object-cover rounded mt-2"
                    onError={(e) => {
                      console.error('Error cargando imagen:', specificPost.featured_media_url);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
            No se encontró el post específico de "Descubre Cali"
          </div>
        )}
        
        {/* Lista de posts actuales */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Posts Actuales del Blog ({posts.length})</h2>
          <div className="space-y-4">
            {posts.map((post, index) => (
              <div key={post.id} className="border-b pb-4 last:border-b-0">
                <p><strong>#{index + 1} - ID {post.id}:</strong> {post.title?.rendered}</p>
                <p><strong>Slug:</strong> {post.slug}</p>
                <p><strong>Imagen:</strong> {post.featured_media_url || 'No tiene'}</p>
                <p><strong>Fecha:</strong> {new Date(post.date).toLocaleDateString()}</p>
                {post.featured_media_url && (
                  <img 
                    src={post.featured_media_url} 
                    alt="Imagen del post" 
                    className="w-20 h-20 object-cover rounded mt-1"
                    onError={(e) => {
                      console.error('Error cargando imagen:', post.featured_media_url);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Test de APIs directas */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">URLs de API</h2>
          <div className="text-sm space-y-1">
            <p><strong>API Principal:</strong> https://wp.hospelia.co/wp-json/wp/v2/posts</p>
            <p><strong>API ACF:</strong> https://wp.hospelia.co/wp-json/acf/v3</p>
            <p><strong>API Menús:</strong> https://wp.hospelia.co/wp-json/menus/v1</p>
            <p><strong>Site URL:</strong> {window.location.origin}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 