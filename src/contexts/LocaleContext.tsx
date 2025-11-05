"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// --- Configuración Base ---
const BASE_CURRENCY_CODE = 'COP'; // Moneda en la que están los precios en WordPress
const BASE_TO_USD_RATE = 1 / 4200; // Tasa de cambio actualizada de BASE_CURRENCY a USD (1 COP = 0.000238 USD)
// ------------------------

// Definición de tipos
export interface Currency {
  code: string;
  symbol: string;
  exchangeRate: number; // Tasa de cambio relativa a USD (1 USD = X de esta moneda)
}

export interface Locale {
  language: string;
  languageName: string;
  currency: Currency;
}

export interface LocaleContextType {
  currentLocale: Locale;
  availableLocales: Locale[];
  changeLocale: (localeCode: string) => void;
  formatPrice: (priceBaseCurrency: number) => string; // La función ahora espera el precio en BASE_CURRENCY
}

// Configuración de locales disponibles (tasas relativas a USD)
const locales: Record<string, Locale> = {
  'es-CO': {
    language: 'es-CO',
    languageName: 'Español (CO)',
    currency: {
      code: 'COP',
      symbol: '$',
      exchangeRate: 4200 // Actualizado: 1 USD = 4200 COP
    }
  },
  'en-US': {
    language: 'en-US',
    languageName: 'English (US)',
    currency: {
      code: 'USD',
      symbol: '$',
      exchangeRate: 1 // Base USD
    }
  },
  'es-ES': {
    language: 'es-ES',
    languageName: 'Español (ES)',
    currency: {
      code: 'EUR',
      symbol: '€',
      exchangeRate: 0.92 // 1 USD = 0.92 EUR (actualizar si es necesario)
    }
  },
  'pt-BR': {
    language: 'pt-BR',
    languageName: 'Português (BR)',
    currency: {
      code: 'BRL',
      symbol: 'R$',
      exchangeRate: 5.15 // 1 USD = 5.15 BRL (actualizar si es necesario)
    }
  },
  'fr-FR': {
    language: 'fr-FR',
    languageName: 'Français (FR)',
    currency: {
      code: 'EUR',
      symbol: '€',
      exchangeRate: 0.92 // 1 USD = 0.92 EUR
    }
  }
};

// Crear contexto
export const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

// Proveedor del contexto
export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  // Estado para almacenar el locale actual (por defecto es-CO)
  const [currentLocale, setCurrentLocale] = useState<Locale>(locales['es-CO']);

  // Efecto para cargar el locale guardado del localStorage
  useEffect(() => {
    const savedLocale = localStorage.getItem('userLocale');
    if (savedLocale && locales[savedLocale]) {
      setCurrentLocale(locales[savedLocale]);
    } else {
      // Si no hay nada guardado, intentar detectar el idioma del navegador
      const browserLang = navigator.language.split('-')[0]; // 'es', 'en', etc.
      const foundLocale = Object.values(locales).find(l => l.language.startsWith(browserLang));
      if (foundLocale) {
        setCurrentLocale(foundLocale);
        localStorage.setItem('userLocale', foundLocale.language);
      }
    }
  }, []);

  // Función para cambiar de locale
  const changeLocale = (localeCode: string) => {
    if (locales[localeCode]) {
      setCurrentLocale(locales[localeCode]);
      localStorage.setItem('userLocale', localeCode);
    }
  };

  // Formatear precios: Convierte de BASE_CURRENCY a la moneda del locale actual
  const formatPrice = (priceBaseCurrency: number) => {
    const { currency } = currentLocale;
    
    // 1. Convertir el precio base (ej: COP) a USD
    const priceUSD = priceBaseCurrency * BASE_TO_USD_RATE;
    
    // 2. Convertir de USD a la moneda del locale actual
    const convertedPrice = priceUSD * currency.exchangeRate;
    
    return new Intl.NumberFormat(currentLocale.language, {
      style: 'currency',
      currency: currency.code,
      maximumFractionDigits: 0 // O ajusta según necesites decimales
    }).format(convertedPrice);
  };

  return (
    <LocaleContext.Provider
      value={{
        currentLocale,
        availableLocales: Object.values(locales),
        changeLocale,
        formatPrice
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale debe ser usado dentro de un LocaleProvider');
  }
  return context;
}; 