"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const companies = [
  {
    name: 'Cruz Roja Colombiana',
    logo: 'https://wp.hospelia.co/wp-content/uploads/2025/04/LOGO-ORG-VERTICAL.png',
    url: 'https://www.cruzrojacolombiana.org/'
  },
  {
    name: 'DHL',
    logo: 'https://wp.hospelia.co/wp-content/uploads/2025/04/dhl-logo.svg',
    url: 'https://www.dhl.com/co-es/home.html'
  },
  {
    name: 'Cantina La 15',
    logo: 'https://wp.hospelia.co/wp-content/uploads/2025/04/Logo-original-600x117-1.png',
    url: 'https://www.cantinala15.com/'
  },
  {
    name: 'Belanova',
    logo: 'https://wp.hospelia.co/wp-content/uploads/2025/04/309050360_619774439742027_3124979860421283267_n.png',
    url: 'https://belanovacare.com/'
  },
  {
    name: 'Industrias Pintumel',
    logo: 'https://wp.hospelia.co/wp-content/uploads/2025/04/Captura-de-pantalla-2025-04-15-223041.png',
    url: 'https://www.pintumel.com/'
  },
];

// Componente individual para cada logo
const CompanyLogo = ({ company, index }: { company: typeof companies[0], index: number }) => (
  <motion.a
    key={`logo-${index}`}
    href={company.url}
    target="_blank"
    rel="noopener noreferrer"
    className="flex-shrink-0 mx-4 md:mx-6 lg:mx-8 group cursor-pointer"
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.2 }}
    onClick={() => {
      // Track click event
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'click', {
          event_category: 'Partner',
          event_label: company.name,
          value: 1
        });
      }
    }}
  >
    <div className="w-32 h-16 md:w-40 md:h-20 lg:w-44 lg:h-22 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center justify-center p-3 md:p-4 group-hover:shadow-lg group-hover:border-gray-300 group-hover:scale-105 transition-all duration-300">
      <Image
        src={company.logo}
        alt={`Logo de ${company.name}`}
        width={120}
        height={50}
        className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
        onError={(e) => {
          console.error(`Error cargando logo de ${company.name}:`, company.logo);
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
    </div>
  </motion.a>
);

export default function TrustedBy() {
  return (
    <motion.section 
      className="py-16 bg-gray-50"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Hemos trabajado con
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Empresas líderes confían en nosotros para sus necesidades de hospedaje y alojamiento corporativo
          </p>
        </div>

        {/* Carrusel infinito */}
        <div className="relative overflow-hidden">
          <div 
            className="flex animate-scroll" 
            style={{ width: 'calc(100% * 3)' }}
          >
            {/* Primera serie de logos */}
            {companies.map((company, index) => (
              <CompanyLogo key={`first-${index}`} company={company} index={index} />
            ))}
            
            {/* Segunda serie de logos para continuidad */}
            {companies.map((company, index) => (
              <CompanyLogo key={`second-${index}`} company={company} index={index} />
            ))}

            {/* Tercera serie de logos para continuidad */}
            {companies.map((company, index) => (
              <CompanyLogo key={`third-${index}`} company={company} index={index} />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
} 