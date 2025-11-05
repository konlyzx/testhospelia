'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Currency = 'COP' | 'USD' | 'EUR';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convertPrice: (priceInCOP: number) => number;
  formatPrice: (priceInCOP: number) => string;
  getCurrencySymbol: () => string;
  exchangeRates: Record<Currency, number>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Tasas de cambio (COP como base)
const EXCHANGE_RATES: Record<Currency, number> = {
  COP: 1,
  USD: 0.00024, // 1 COP = 0.00024 USD (aproximadamente 4,200 COP = 1 USD)
  EUR: 0.00022, // 1 COP = 0.00022 EUR (aproximadamente 4,500 COP = 1 EUR)
};

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  COP: '$',
  USD: '$',
  EUR: '€',
};

const CURRENCY_NAMES: Record<Currency, string> = {
  COP: 'Peso Colombiano',
  USD: 'Dólar Americano', 
  EUR: 'Euro',
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('COP');
  const [exchangeRates, setExchangeRates] = useState(EXCHANGE_RATES);

  useEffect(() => {
    // Cargar divisa guardada del localStorage
    const savedCurrency = localStorage.getItem('hospelia-currency') as Currency;
    if (savedCurrency && ['COP', 'USD', 'EUR'].includes(savedCurrency)) {
      setCurrency(savedCurrency);
    }

    // Actualizar tasas de cambio desde una API (opcional)
    updateExchangeRates();
  }, []);

  const updateExchangeRates = async () => {
    try {
      // Usar una API de tasas de cambio como exchangerate-api.com
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/COP');
      const data = await response.json();
      
      if (data.rates) {
        setExchangeRates({
          COP: 1,
          USD: data.rates.USD || EXCHANGE_RATES.USD,
          EUR: data.rates.EUR || EXCHANGE_RATES.EUR,
        });
      }
    } catch (error) {
      console.log('📈 Usando tasas de cambio predeterminadas:', error);
      // Mantener las tasas predeterminadas en caso de error
    }
  };

  const handleSetCurrency = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    localStorage.setItem('hospelia-currency', newCurrency);
  };

  const convertPrice = (priceInCOP: number): number => {
    if (!priceInCOP || priceInCOP === 0) return 0;
    return priceInCOP * exchangeRates[currency];
  };

  const formatPrice = (priceInCOP: number): string => {
    if (!priceInCOP || priceInCOP === 0) return 'Precio a consultar';
    
    const convertedPrice = convertPrice(priceInCOP);
    const symbol = getCurrencySymbol();
    
    // Formatear según la divisa
    switch (currency) {
      case 'COP':
        return `${symbol}${Math.round(convertedPrice).toLocaleString('es-CO')}`;
      case 'USD':
        return `${symbol}${convertedPrice.toLocaleString('en-US', { 
          minimumFractionDigits: 0,
          maximumFractionDigits: 0 
        })}`;
      case 'EUR':
        return `${convertedPrice.toLocaleString('de-DE', { 
          minimumFractionDigits: 0,
          maximumFractionDigits: 0 
        })}${symbol}`;
      default:
        return `${symbol}${Math.round(convertedPrice).toLocaleString()}`;
    }
  };

  const getCurrencySymbol = (): string => {
    return CURRENCY_SYMBOLS[currency];
  };

  return (
    <CurrencyContext.Provider 
      value={{ 
        currency, 
        setCurrency: handleSetCurrency, 
        convertPrice, 
        formatPrice, 
        getCurrencySymbol,
        exchangeRates 
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

// Hook para componentes que necesiten mostrar precios
export function usePrice() {
  const { formatPrice, currency, getCurrencySymbol } = useCurrency();
  
  return {
    formatPrice,
    currency,
    symbol: getCurrencySymbol(),
  };
} 