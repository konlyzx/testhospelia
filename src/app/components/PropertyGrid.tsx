import React from 'react';
import { motion } from 'framer-motion';
import PropertyCard from './PropertyCard';

// Datos de muestra 
const properties = [
  {
    id: '1',
    title: 'IMPRESIONANTE APARTAMENTO NOVAFLORA 14 – CONFORT Y ESTILO EN CALI',
    price: '$3,500,000',
    location: 'Zona Norte',
    beds: 1,
    baths: 2,
    type: 'Apartamento',
    image: '/property-1.jpg',
    isNew: true
  },
  {
    id: '2',
    title: 'MODERNO APARTAMENTO EN SAN VICENTE – NORTE DE CALI',
    price: '$3,000,000',
    location: 'Zona Norte',
    beds: 2,
    baths: 2,
    type: 'Apartamento',
    image: '/property-2.jpg',
    isNew: true
  },
  {
    id: '3',
    title: 'IMPECABLE APARTAMENTO WENGUE EN BOCHALEMA – CONFORT Y LUJO EN CALI',
    price: '$3,500,000',
    location: 'Zona Sur',
    beds: 2,
    baths: 2,
    type: 'Apartamento',
    image: '/property-3.jpg',
    isNew: true
  },
  {
    id: '4',
    title: 'INCREÍBLE APARTAMENTO TAYRONA EN VALLE DEL LILI – ALQUILER AMOBLADO EN CALI',
    price: '$3,800,000',
    location: 'Zona Sur',
    beds: 2,
    baths: 1,
    type: 'Apartamento',
    image: '/property-4.jpg',
    isNew: true
  },
  {
    id: '5',
    title: 'NUEVO APARTAMENTO EN LA FLORA NORTE DE CALI: CONFORT Y ESTILO',
    price: '$4,500,000',
    location: 'Zona Norte',
    beds: 2,
    baths: 2,
    type: 'Apartamento',
    image: '/property-5.jpg',
    isNew: true
  },
  {
    id: '6',
    title: 'APARTAMENTO AMOBLADO EN BOCHALEMA – SUR DE CALI',
    price: '$4,300,000',
    location: 'Zona Sur',
    beds: 3,
    baths: 2,
    type: 'Apartamento',
    image: '/property-6.jpg',
    isNew: false
  }
];

// Variantes de animación para el contenedor
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Variantes de animación para los elementos
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

export default function PropertyGrid() {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-20">
      <div className="container mx-auto px-4">
        {/* Encabezado con animación */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Encuentra tu <span className="text-blue-600">hogar ideal</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre propiedades exclusivas seleccionadas para ofrecerte la mejor experiencia de vivienda.
          </p>
        </motion.div>

        {/* Filtros con animación */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <button className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors">
            Todos
          </button>
          <button className="bg-white text-gray-700 px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors border border-gray-200">
            Apartamentos
          </button>
          <button className="bg-white text-gray-700 px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors border border-gray-200">
            Casas
          </button>
          <button className="bg-white text-gray-700 px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors border border-gray-200">
            Estudios
          </button>
          <button className="bg-white text-gray-700 px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors border border-gray-200">
            Premium
          </button>
        </motion.div>

        {/* Cuadrícula de propiedades con diseño bento */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Propiedad destacada (más grande) */}
          <motion.div 
            className="md:col-span-2 md:row-span-2"
            variants={itemVariants}
          >
            <PropertyCard {...properties[0]} />
          </motion.div>
          
          {/* Propiedades secundarias */}
          {properties.slice(1, 5).map((property, index) => (
            <motion.div 
              key={property.id}
              variants={itemVariants}
            >
              <PropertyCard {...property} />
            </motion.div>
          ))}
        </motion.div>
        
        {/* Estadísticas con animación */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.div 
            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center"
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-4xl font-bold text-gray-800 mb-2">500+</h3>
            <p className="text-gray-600">Propiedades disponibles</p>
          </motion.div>
          
          <motion.div 
            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center"
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-4xl font-bold text-gray-800 mb-2">1,200+</h3>
            <p className="text-gray-600">Clientes satisfechos</p>
          </motion.div>
          
          <motion.div 
            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center"
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-4xl font-bold text-gray-800 mb-2">10+</h3>
            <p className="text-gray-600">Años de experiencia</p>
          </motion.div>
        </motion.div>
        
        {/* Botón cargar más con animación */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <button className="group inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-full transition-colors shadow-md hover:shadow-lg">
            <span>Ver más propiedades</span>
            <svg 
              className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
} 