"use client";

import React from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import type { WasiProperty } from '@/services/wasi';

interface PropertyPriceProps {
  property: WasiProperty;
  className?: string;
}

/**
 * Componente para mostrar el precio de una propiedad con formato según la moneda actual
 */
export default function PropertyPrice({ property, className = '' }: PropertyPriceProps) {
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();

  const getMainPrice = () => {
    if (property.for_rent === "true" && property.rent_price !== "0") {
      return {
        price: parseInt(property.rent_price),
        period: t('property.price.month'),
        type: "rent",
      };
    }
    if (property.for_sale === "true" && property.sale_price !== "0") {
      return {
        price: parseInt(property.sale_price),
        period: "",
        type: "sale",
      };
    }
    return { price: 0, period: "", type: "consult" };
  };

  const mainPrice = getMainPrice();

  return (
    <div className={className}>
      <p className="text-gray-900 font-bold text-2xl">
        {mainPrice.price > 0 ? formatPrice(mainPrice.price) : t('property.price.consult')}
        {mainPrice.period && (
          <span className="font-normal text-lg text-gray-500 ml-1">
            {mainPrice.period}
          </span>
        )}
      </p>
      {mainPrice.type === "rent" && (
        <p className="text-gray-500 text-base mt-1">
          {t('property.price.month')}
        </p>
      )}
    </div>
  );
} 