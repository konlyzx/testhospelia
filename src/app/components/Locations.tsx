import React from 'react';
import Link from 'next/link';
import DummyImage from './DummyImageLoader';

const locations = [
  {
    id: 'norte',
    name: 'Zona Norte',
    properties: 4,
    image: '/zona-norte.jpg'
  },
  {
    id: 'sur',
    name: 'Zona Sur',
    properties: 19,
    image: '/zona-sur.jpg'
  },
  {
    id: 'oeste',
    name: 'Zona Oeste',
    properties: 1,
    image: '/zona-oeste.jpg'
  }
];

const features = [
  {
    id: 'todo-incluido',
    title: '¡Alojamientos todo incluido!',
    description: 'Con todas las comodidades de un Hotel pero el espacio y privacidad de un apartamento.',
    image: '/feature-todo-incluido.jpg',
    properties: 19
  },
  {
    id: 'pet-friendly',
    title: 'Pet friendly',
    description: 'Viaja con tu mascota, todos nuestros apartamentos son Pet Friendly.',
    image: '/feature-pet-friendly.jpg',
    properties: 19
  }
];

export default function Locations() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ubicados en las zonas más exclusivas de Cali
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {locations.map((location) => (
            <Link 
              key={location.id}
              href={`/zonas/${location.id}`}
              className="group relative overflow-hidden rounded-xl shadow-lg aspect-[4/3]"
            >
              <div className="absolute inset-0 z-0">
                <DummyImage
                  src={location.image}
                  alt={location.name}
                  layout="fill"
                  objectFit="cover"
                  className="group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10 text-white">
                <h3 className="text-xl font-bold mb-1">{location.name}</h3>
                <p className="text-sm text-white/80">{location.properties} Propiedades</p>
                <span className="mt-2 inline-block text-sm text-white bg-blue-600 px-3 py-1 rounded-md group-hover:bg-white group-hover:text-blue-600 transition-colors">
                  Más Detalles
                </span>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature) => (
            <div key={feature.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="md:flex">
                <div className="md:flex-shrink-0 md:w-48 h-48 md:h-auto relative">
                  <DummyImage
                    src={feature.image}
                    alt={feature.title}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {feature.description}
                  </p>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500">{feature.properties} Propiedades</span>
                    <Link 
                      href={`/caracteristicas/${feature.id}`}
                      className="ml-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Más Detalles →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 