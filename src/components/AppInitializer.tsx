'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AppInitializer() {
  const { language } = useLanguage();

  useEffect(() => {
    if (document.documentElement.lang !== language) {
      document.documentElement.lang = language;
    }
  }, [language]);

  return null; // Este componente no renderiza nada
} 