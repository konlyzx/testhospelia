"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { getReviewsByPropertyId, WordPressReview } from '@/services/wordpress';

interface ReviewsSectionProps {
  propertyId: number;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ propertyId }) => {
  const [reviews, setReviews] = useState<WordPressReview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllReviews, setShowAllReviews] = useState<boolean>(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const reviewsData = await getReviewsByPropertyId(propertyId);
        setReviews(reviewsData);
        setError(null);
      } catch (err) {
        console.error('Error al cargar reseñas:', err);
        setError('No se pudieron cargar las reseñas. Por favor, inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [propertyId]);

  // Calcular promedio de calificaciones
  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    
    const totalRating = reviews.reduce((acc, review) => {
      return acc + (review.acf?.rating || 0);
    }, 0);
    
    return totalRating / reviews.length;
  };

  const averageRating = calculateAverageRating();

  // Renderizar estrellas para la calificación
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg 
          key={`star-${i}`} 
          className="w-5 h-5 text-yellow-500" 
          fill="currentColor" 
          viewBox="0 0 20 20" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg 
          key="half-star" 
          className="w-5 h-5 text-yellow-500" 
          fill="currentColor" 
          viewBox="0 0 20 20" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="halfStarGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#D1D5DB" />
            </linearGradient>
          </defs>
          <path fill="url(#halfStarGradient)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
        </svg>
      );
    }

    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <svg 
          key={`empty-star-${i}`} 
          className="w-5 h-5 text-gray-300" 
          fill="currentColor" 
          viewBox="0 0 20 20" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
        </svg>
      );
    }

    return stars;
  };

  // Obtener avatar de una reseña
  const getAvatarUrl = (review: WordPressReview) => {
    // Primero intentar con ACF
    if (review.acf?.avatar_url) {
      return review.acf.avatar_url;
    }
    
    // Luego con avatar URLs estándar de WordPress
    if (review.author_avatar_urls?.['96']) {
      return review.author_avatar_urls['96'];
    }
    
    // Finalmente recurrir a avatar por defecto
    return "/default-avatar.png";
  };
  
  // Obtener nombre del autor
  const getAuthorName = (review: WordPressReview) => {
    return review.acf?.nombre || review.author_name || 'Anónimo';
  };

  // Visualizaciones animadas para elementos
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  if (loading) {
    return (
      <div className="my-8">
        <h2 className="text-2xl font-semibold mb-4">Reseñas</h2>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-20 bg-gray-200 rounded mb-4"></div>
          <div className="h-20 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-8">
        <h2 className="text-2xl font-semibold mb-4">Reseñas</h2>
        <div className="p-4 border border-red-300 bg-red-50 rounded-md">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="my-8">
        <h2 className="text-2xl font-semibold mb-4">Reseñas</h2>
        <p className="text-gray-500">
          Este alojamiento aún no tiene reseñas. ¡Sé el primero en dejar tu opinión!
        </p>
      </div>
    );
  }

  // Mostrar solo 3 reseñas a menos que se haya clickeado "Ver todas"
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  return (
    <div className="my-8">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-2xl font-semibold">Reseñas</h2>
        <div className="flex items-center ml-2">
          <div className="flex">{renderStars(averageRating)}</div>
          <span className="ml-2 text-gray-700">
            ({averageRating.toFixed(1)}) · {reviews.length} reseñas
          </span>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {displayedReviews.map((review) => (
          <motion.div
            key={review.id}
            variants={itemVariants}
            className="p-6 bg-white rounded-lg shadow-sm border border-gray-100"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                <img
                  src={getAvatarUrl(review)}
                  alt={`Avatar de ${getAuthorName(review)}`}
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <h3 className="font-medium">{getAuthorName(review)}</h3>
                  <span className="text-gray-400 text-sm ml-2">
                    {new Date(review.date).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long'
                    })}
                  </span>
                </div>
                <div className="flex mb-2">{renderStars(review.acf?.rating || 0)}</div>
                <div 
                  className="text-gray-700"
                  dangerouslySetInnerHTML={{ __html: review.content.rendered }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {reviews.length > 3 && (
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowAllReviews(!showAllReviews)}
          className="mt-6 px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md font-medium transition duration-200"
        >
          {showAllReviews ? 'Mostrar menos reseñas' : `Ver todas las ${reviews.length} reseñas`}
        </motion.button>
      )}
    </div>
  );
};

export default ReviewsSection; 