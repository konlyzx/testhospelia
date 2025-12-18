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
    <div className="w-32 h-16 md:w-44 md:h-24 bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)] border border-gray-100/50 flex items-center justify-center p-4 md:p-6 group-hover:scale-105 transition-all duration-300">
      <Image
        src={company.logo}
        alt={`Logo de ${company.name}`}
        width={140}
        height={60}
        className="max-w-full max-h-full object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
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
      className="py-20 bg-gray-50 overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-4 mb-12">
        <div className="text-center max-w-3xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-4 border border-blue-100"
          >
            Nuestros Aliados
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight"
          >
            Hemos trabajado con
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-lg"
          >
            Empresas líderes confían en nosotros para sus necesidades de hospedaje y alojamiento corporativo
          </motion.p>
        </div>
      </div>

      {/* Carrusel infinito */}
      <div className="relative w-full">
        {/* Gradients de desvanecimiento */}
        <div className="absolute top-0 left-0 z-10 w-32 h-full bg-gradient-to-r from-gray-50 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 z-10 w-32 h-full bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />
        
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
    </motion.section>
  );
} 