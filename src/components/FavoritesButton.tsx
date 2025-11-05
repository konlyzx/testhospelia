'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface FavoritesButtonProps {
  className?: string;
}

export default function FavoritesButton({ className = '' }: FavoritesButtonProps) {
  const [favoritesCount, setFavoritesCount] = useState(0);

  useEffect(() => {
    // Función para actualizar el contador de favoritos
    const updateFavoritesCount = () => {
      const savedFavorites = localStorage.getItem('hospelia-favorites');
      if (savedFavorites) {
        const favorites = JSON.parse(savedFavorites);
        setFavoritesCount(favorites.length);
      } else {
        setFavoritesCount(0);
      }
    };

    // Actualizar al cargar
    updateFavoritesCount();

    // Escuchar cambios en localStorage
    window.addEventListener('storage', updateFavoritesCount);
    
    // También escuchar eventos customizados para cambios locales
    window.addEventListener('favoritesUpdated', updateFavoritesCount);

    return () => {
      window.removeEventListener('storage', updateFavoritesCount);
      window.removeEventListener('favoritesUpdated', updateFavoritesCount);
    };
  }, []);

  if (favoritesCount === 0) {
    return null; // No mostrar si no hay favoritos
  }

  return (
    <Link href="/favoritos" className={className}>
      <button className="relative flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-full hover:border-gray-400 hover:shadow-md transition-all duration-200">
        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <span className="text-sm font-medium text-gray-700">Favoritos</span>
        {favoritesCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {favoritesCount}
          </span>
        )}
      </button>
    </Link>
  );
} 