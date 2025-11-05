'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Traducciones
const translations = {
  es: {
    // Header
    'nav.properties': 'Propiedades',
    'nav.experiences': 'Experiencias', 
    'nav.blog': 'Blog',
    'nav.help': 'Ayuda',
    'nav.favorites': 'Favoritos',
    'nav.login': 'Iniciar Sesión',
    'nav.signup': 'Registrarse',
    
    // Home
    'home.hero.title': 'Encuentra tu próximo',
    'home.hero.highlight': 'hogar',
    'home.hero.subtitle': 'Descubre apartamentos únicos, completamente equipados y verificados en las mejores zonas de Cali',
    'home.search.where': 'Dónde',
    'home.search.where.placeholder': 'Explora destinos',
    'home.search.bedrooms': 'Habitaciones',
    'home.search.bedrooms.placeholder': '¿Cuántas?',
    'home.search.budget': 'Presupuesto',
    'home.search.budget.placeholder': '¿Cuánto?',
    'home.search.type': 'Tipo',
    'home.search.type.all': 'Todos',
    'home.search.type.rent': 'Para renta',
    'home.search.type.sale': 'En venta',
    
    // Properties
    'property.bedrooms': 'habitaciones',
    'property.bathrooms': 'baños',
    'property.area': 'm²',
    'property.studio': 'estudio',
    'property.price.month': '/mes',
    'property.price.consult': 'Consultar precio',
    'property.rating': 'Calificación',
    'property.details': 'Ver detalles',
    'property.for_rent': 'Para Renta',
    'property.for_sale': 'En Venta',
    'property.rent_sale': 'Renta/Venta',
    
    // Blog
    'blog.title': 'Últimas noticias del blog',
    'blog.subtitle': 'Mantente al día con consejos de viaje, guías de Cali y novedades de Hospelia',
    'blog.loading': 'Cargando artículos destacados...',
    'blog.read_more': 'Leer más',
    'blog.all_articles': 'Ver todos los artículos',
    'blog.min_read': 'min de lectura',
    
    // Footer
    'footer.company': 'Compañía',
    'footer.about': 'Sobre nosotros',
    'footer.careers': 'Trabajos',
    'footer.press': 'Prensa',
    'footer.support': 'Soporte',
    'footer.help': 'Ayuda',
    'footer.contact': 'Contacto',
    'footer.legal': 'Legal',
    'footer.terms': 'Términos y condiciones',
    'footer.privacy': 'Política de privacidad',
    'footer.cookies': 'Cookies',
    
    // Common
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.call_now': 'Llamar ahora',
    'common.whatsapp': 'WhatsApp',
    'common.email': 'Email',
    'common.phone': 'Teléfono',
    'common.address': 'Dirección',
    'common.clear': 'Limpiar',
    'common.search': 'Buscar',
    'common.close': 'Cerrar',
    'common.open': 'Abrir',
    'common.sort_by': 'Ordenar por',
    'common.currency': 'Moneda',
    'common.language': 'Idioma',
    'common.filters': 'Filtros',
    'common.zone': 'Zona',
    'common.all_zones': 'Todas las zonas',
    'common.price': 'Precio',
    'common.minimum': 'Mínimo',
    'common.maximum': 'Máximo',
    'common.bedrooms': 'Habitaciones',
    'common.all': 'Todas',
    'common.reset_filters': 'Resetear filtros',
    'common.properties_found': 'propiedades encontradas',
    'common.property_found': 'propiedad encontrada',
    'common.recent': 'Más recientes',
    'common.price_low_high': 'Precio: Menor a mayor',
    'common.price_high_low': 'Precio: Mayor a menor',
    'common.no_properties': 'No se encontraron propiedades',
    'common.no_properties_desc': 'No hay propiedades que coincidan con tus criterios de búsqueda. Intenta ajustar los filtros.',
    'common.contact_us': 'Contáctanos',
    'common.not_found_title': '¿No encuentras lo que buscas?',
    'common.not_found_desc': 'Contáctanos y te ayudaremos a encontrar la propiedad perfecta para ti. Tenemos nuevas propiedades disponibles cada semana.',
    
    // Recommendations
    'ai.title': 'Recomendado para ti',
    'ai.subtitle': 'Basado en tu actividad reciente',
    'ai.based_on': 'Basado en tu búsqueda anterior, te puede gustar',
    'ai.similar': 'Propiedades similares',
    'ai.trending': 'Tendencias populares',
    'ai.new_for_you': 'Nuevo para ti',
  },
  en: {
    // Header
    'nav.properties': 'Properties',
    'nav.experiences': 'Experiences',
    'nav.blog': 'Blog', 
    'nav.help': 'Help',
    'nav.favorites': 'Favorites',
    'nav.login': 'Log In',
    'nav.signup': 'Sign Up',
    
    // Home
    'home.hero.title': 'Find your next',
    'home.hero.highlight': 'home',
    'home.hero.subtitle': 'Discover unique, fully equipped and verified apartments in the best areas of Cali',
    'home.search.where': 'Where',
    'home.search.where.placeholder': 'Explore destinations',
    'home.search.bedrooms': 'Bedrooms',
    'home.search.bedrooms.placeholder': 'How many?',
    'home.search.budget': 'Budget',
    'home.search.budget.placeholder': 'How much?',
    'home.search.type': 'Type',
    'home.search.type.all': 'All',
    'home.search.type.rent': 'For rent',
    'home.search.type.sale': 'For sale',
    
    // Properties
    'property.bedrooms': 'bedrooms',
    'property.bathrooms': 'bathrooms',
    'property.area': 'm²',
    'property.studio': 'studio',
    'property.price.month': '/month',
    'property.price.consult': 'Price on request',
    'property.rating': 'Rating',
    'property.details': 'View details',
    'property.for_rent': 'For Rent',
    'property.for_sale': 'For Sale',
    'property.rent_sale': 'Rent/Sale',
    
    // Blog
    'blog.title': 'Latest news from the blog',
    'blog.subtitle': 'Stay up to date with travel tips, Cali guides and Hospelia news',
    'blog.loading': 'Loading featured articles...',
    'blog.read_more': 'Read more',
    'blog.all_articles': 'View all articles',
    'blog.min_read': 'min read',
    
    // Footer
    'footer.company': 'Company',
    'footer.about': 'About us',
    'footer.careers': 'Careers',
    'footer.press': 'Press',
    'footer.support': 'Support',
    'footer.help': 'Help',
    'footer.contact': 'Contact',
    'footer.legal': 'Legal',
    'footer.terms': 'Terms and conditions',
    'footer.privacy': 'Privacy policy',
    'footer.cookies': 'Cookies',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.call_now': 'Call now',
    'common.whatsapp': 'WhatsApp',
    'common.email': 'Email',
    'common.phone': 'Phone',
    'common.address': 'Address',
    'common.clear': 'Clear',
    'common.search': 'Search',
    'common.close': 'Close',
    'common.open': 'Open',
    'common.sort_by': 'Sort by',
    'common.currency': 'Currency',
    'common.language': 'Language',
    'common.filters': 'Filters',
    'common.zone': 'Zone',
    'common.all_zones': 'All zones',
    'common.price': 'Price',
    'common.minimum': 'Minimum',
    'common.maximum': 'Maximum',
    'common.bedrooms': 'Bedrooms',
    'common.all': 'All',
    'common.reset_filters': 'Reset filters',
    'common.properties_found': 'properties found',
    'common.property_found': 'property found',
    'common.recent': 'Most recent',
    'common.price_low_high': 'Price: Low to high',
    'common.price_high_low': 'Price: High to low',
    'common.no_properties': 'No properties found',
    'common.no_properties_desc': 'No properties match your search criteria. Try adjusting the filters.',
    'common.contact_us': 'Contact us',
    'common.not_found_title': 'Can\'t find what you\'re looking for?',
    'common.not_found_desc': 'Contact us and we\'ll help you find the perfect property for you. We have new properties available every week.',
    
    // Recommendations
    'ai.title': 'Recommended for you',
    'ai.subtitle': 'Based on your recent activity',
    'ai.based_on': 'Based on your previous search, you might like',
    'ai.similar': 'Similar properties',
    'ai.trending': 'Popular trends',
    'ai.new_for_you': 'New for you',
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('es');

  useEffect(() => {
    // Cargar idioma guardado del localStorage
    const savedLanguage = localStorage.getItem('hospelia-language') as Language;
    if (savedLanguage && (savedLanguage === 'es' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    } else {
      // Detectar idioma del navegador
      const browserLang = navigator.language.slice(0, 2);
      if (browserLang === 'en') {
        setLanguage('en');
      }
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('hospelia-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 