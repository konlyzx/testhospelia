"use client";
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const bannersData = [
  {
    src: '/img/banners/banner-encuentra-cali.png',
    alt: 'Encuentra el Alojamiento Ideal en Cali Hospelia',
    // Podríamos añadir texto superpuesto aquí si no fuera parte de la imagen
  },
  {
    src: '/img/banners/banner-sientete-casa.png',
    alt: 'Siéntete como en casa con Hospelia',
  },
  {
    src: '/img/banners/banner-apartamentos-amoblados.png',
    alt: 'Apartamentos amoblados con amenidades increíbles en Hospelia',
  },
];

const PromotionalBanners = () => {
  const bannerVariants = {
    hidden: { opacity: 0, y: 30 }, // Inicia un poco más abajo
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.7, ease: "easeOut", staggerChildren: 0.2 } // staggerChildren para animaciones secuenciales si hay elementos hijos
    },
  };

  return (
    <section className="py-10 md:py-16 bg-white">
      <div className="container mx-auto px-4 space-y-8 md:space-y-12">
        {bannersData.map((banner, index) => (
          <motion.div
            key={index}
            className="relative w-full h-[280px] sm:h-[350px] md:h-[420px] lg:h-[450px] rounded-xl overflow-hidden shadow-xl group"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }} // Trigger cuando 25% del elemento esté en vista
            variants={bannerVariants}
          >
            <Image
              src={banner.src}
              alt={banner.alt}
              layout="fill"
              objectFit="cover"
              quality={90} // Calidad alta para banners
              className="absolute inset-0 object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500 ease-in-out"
            />
            <div 
              className="absolute inset-0 bg-gradient-to-br from-blue-600/70 via-purple-500/50 to-teal-500/60 group-hover:from-blue-600/60 group-hover:via-purple-500/40 group-hover:to-teal-500/50 transition-all duration-300"
              // El texto y logos están en la imagen, así que el overlay es solo para el efecto de color/difuminado.
              // Si quisieras texto sobre esto, se agregaría aquí.
            >
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default PromotionalBanners; 