'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import type { Language } from '@/contexts/LanguageContext';
import type { Currency } from '@/contexts/CurrencyContext';

interface LanguageCurrencySelectorProps {
  className?: string;
  variant?: 'header' | 'inline';
}

const languages = {
  es: { name: 'Español', flag: '🇪🇸' },
  en: { name: 'English', flag: '🇺🇸' },
};

const currencies = {
  COP: { name: 'Peso Colombiano', flag: '🇨🇴', symbol: '$' },
  USD: { name: 'US Dollar', flag: '🇺🇸', symbol: '$' },
  EUR: { name: 'Euro', flag: '🇪🇺', symbol: '€' },
};

export default function LanguageCurrencySelector({ 
  className = '', 
  variant = 'header' 
}: LanguageCurrencySelectorProps) {
  const { language, setLanguage, t } = useLanguage();
  const { currency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setIsOpen(false);
  };

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    setIsOpen(false);
  };

  if (variant === 'inline') {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        {/* Selector de idioma inline */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-bold text-white drop-shadow-lg">{t('common.language')}:</span>
          <div className="flex rounded-lg border border-gray-300 overflow-hidden shadow-lg">
            {Object.entries(languages).map(([key, lang]) => (
              <button
                key={key}
                onClick={() => handleLanguageChange(key as Language)}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  language === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-800 hover:bg-gray-100'
                }`}
              >
                {lang.flag} {lang.name}
              </button>
            ))}
          </div>
        </div>

        {/* Selector de divisa inline */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-bold text-white drop-shadow-lg">{t('common.currency')}:</span>
          <div className="flex rounded-lg border border-gray-300 overflow-hidden shadow-lg">
            {Object.entries(currencies).map(([key, curr]) => (
              <button
                key={key}
                onClick={() => handleCurrencyChange(key as Currency)}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  currency === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-800 hover:bg-gray-100'
                }`}
              >
                {curr.flag} {key}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Botón principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-gray-400 hover:shadow-lg transition-all duration-200 shadow-sm"
        aria-label={`Seleccionar idioma y moneda. Idioma actual: ${languages[language]?.name ?? 'Idioma'}, Moneda actual: ${currency}`}
      >
        <span className="text-lg">{languages[language]?.flag ?? '🌐'}</span>
        <span className="text-sm font-semibold text-gray-800 hidden sm:inline bg-white">
          {languages[language]?.name ?? 'Idioma'}
        </span>
        <span className="text-lg bg-white">{currencies[currency]?.flag ?? '💲'}</span>
        <span className="text-sm font-semibold text-gray-800 hidden sm:inline bg-white">
          {currency}
        </span>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-4 h-4 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-xl border border-gray-200 shadow-xl z-50 overflow-hidden"
          >
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                {t('common.language')} y {t('common.currency')}
              </h3>

              {/* Selector de idioma */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">
                  {t('common.language')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(languages).map(([key, lang]) => (
                    <button
                      key={key}
                      onClick={() => handleLanguageChange(key as Language)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                        language === key
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-900'
                      }`}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <span className="font-medium text-sm">{lang.name}</span>
                      {language === key && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto w-2 h-2 bg-blue-500 rounded-full"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector de divisa */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">
                  {t('common.currency')}
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(currencies).map(([key, curr]) => (
                    <button
                      key={key}
                      onClick={() => handleCurrencyChange(key as Currency)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                        currency === key
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-900'
                      }`}
                    >
                      <span className="text-xl">{curr.flag}</span>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-sm">{curr.name}</div>
                        <div className="text-xs text-gray-500">{key} ({curr.symbol})</div>
                      </div>
                      {currency === key && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 bg-blue-500 rounded-full"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-gray-700 bg-white px-2 py-1 rounded">
                Los precios se actualizan automáticamente según la divisa seleccionada
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 