import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import DummyImage from './DummyImageLoader';

interface PropertyCardProps {
  id: string;
  title: string;
  price: string;
  location: string;
  beds: number;
  baths: number;
  type: string;
  image: string;
  isNew?: boolean;
}

export default function PropertyCard({
  id,
  title,
  price,
  location,
  beds,
  baths,
  type,
  image,
  isNew = false
}: PropertyCardProps) {
  return (
    <motion.div 
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col"
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
    >
      <div className="relative">
        {/* Etiqueta nueva con animación */}
        {isNew && (
          <motion.div 
            className="absolute top-3 left-3 z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
              delay: 0.2
            }}
          >
            <span className="bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-md flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              Nuevo
            </span>
          </motion.div>
        )}
        
        {/* Etiqueta ubicación */}
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs px-3 py-1.5 rounded-full font-medium shadow-sm">
            {location}
          </span>
        </div>
        
        {/* Efecto de hover en la imagen */}
        <div className="relative h-56 w-full overflow-hidden group">
          <DummyImage
            src={image}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="rounded-t-xl transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        {/* Precio con gradiente */}
        <div className="flex justify-between items-center mb-3">
          <div className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-500">
            {price}/mes
          </div>
          <div className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {type}
          </div>
        </div>
        
        {/* Título con truncado */}
        <h3 className="font-bold text-gray-800 mb-3 line-clamp-2 h-12">
          {title}
        </h3>
        
        {/* Línea divisoria con gradiente */}
        <div className="w-16 h-0.5 bg-gradient-to-r from-blue-700 to-blue-300 mb-3"></div>
        
        {/* Características con iconos mejorados */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 mt-auto">
          {beds > 0 && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>{beds} {beds === 1 ? 'Cama' : 'Camas'}</span>
            </div>
          )}
          
          {baths > 0 && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
              <span>{baths} {baths === 1 ? 'Baño' : 'Baños'}</span>
            </div>
          )}
        </div>
        
        {/* Botón detalles con animación hover */}
        <Link 
          href={`/propiedad/${id}`} 
          className="group inline-flex items-center justify-center w-full text-center bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-medium py-2.5 px-4 rounded-full transition-all duration-300"
        >
          <span>Ver detalles</span>
          <svg 
            className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
} 