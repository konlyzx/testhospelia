import React from 'react';
import { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Todas las Propiedades | Hospelia',
  description: 'Explora todas nuestras propiedades disponibles en distintas zonas de Cali. Encuentra el hogar perfecto para ti con acabados de lujo y totalmente amoblado.',
};

export default function PropertiesPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <Script
          id="schema-itemlist-propiedades"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Propiedades',
                  url: 'https://hospelia.co/propiedades'
                }
              ]
            })
          }}
        />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Propiedades Disponibles
        </h1>
        <p className="text-gray-600 mb-8">
          Esta página está en construcción. Pronto podrás explorar todas nuestras propiedades disponibles.
        </p>
        <a 
          href="/"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Volver al inicio
        </a>
      </div>
    </div>
  );
} 
