import React from 'react';
import DummyImage from './DummyImageLoader';

const testimonials = [
  {
    id: '1',
    text: 'Excelente experiencia en Hospelia. El apartamento estaba impecable, muy bien ubicado en el norte de Cali y con todas las comodidades. La atención al cliente fue excepcional, siempre dispuestos a ayudar. Definitivamente regresaré.',
    name: 'María Fernanda Rodríguez',
    role: 'Turista de Bogotá',
    avatar: 'https://lh3.googleusercontent.com/a-/ALV-UjVaGWwX41GcnMmfDwc0_cDJQsUFX4zX19m3_CRLhO0GWTBr40Wy=w56-h56-p-rp-mo-br100',
    rating: 5
  },
  {
    id: '2',
    text: 'Me quedé por trabajo durante 3 semanas y fue como estar en casa. El apartamento tenía todo lo necesario: cocina equipada, wifi excelente y muy buena ubicación. El proceso de check-in fue súper fácil.',
    name: 'Carlos Mendoza',
    role: 'Ejecutivo de Medellín',
    avatar: 'https://wp.hospelia.co/wp-content/webp-express/webp-images/uploads/2023/12/3.png.webp',
    rating: 5
  },
  {
    id: '3',
    text: 'Hospelia superó mis expectativas. El apartamento era tal como se veía en las fotos, muy limpio y cómodo. La zona es segura y tiene fácil acceso a restaurantes y centros comerciales. Muy recomendado.',
    name: 'Ana Lucía Vargas',
    role: 'Viajera de negocios',
    avatar: '/avatars/avatar-3.jpg',
    rating: 5
  },
  {
    id: '4',
    text: 'Perfecto para unas vacaciones familiares en Cali. El apartamento tenía espacio suficiente para todos, excelente vista y muy buena atención. Los niños disfrutaron mucho la piscina del edificio.',
    name: 'Roberto Silva',
    role: 'Familia de Quito, Ecuador',
    avatar: '/avatars/avatar-4.jpg',
    rating: 5
  },
  {
    id: '5',
    text: 'Estuve hospedada por un mes mientras buscaba apartamento propio. El servicio fue impecable, muy profesionales y siempre atentos a cualquier necesidad. Precios justos y excelente calidad.',
    name: 'Valentina Torres',
    role: 'Profesional reubicada',
    avatar: '/avatars/avatar-5.jpg',
    rating: 5
  },
  {
    id: '6',
    text: 'Gran experiencia con Hospelia. El apartamento estaba en una zona muy tranquila pero cerca de todo. La comunicación fue excelente desde el primer contacto hasta el check-out. 100% recomendado.',
    name: 'Andrés Ramírez',
    role: 'Turista de Barranquilla',
    avatar: '/avatars/avatar-6.jpg',
    rating: 5
  }
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Lo que dicen nuestros huéspedes
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre por qué somos la opción preferida para alojamiento en Cali
          </p>
          <div className="flex items-center justify-center mt-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-2 text-gray-600 font-medium">4.9 de 5 estrellas</span>
              <span className="ml-2 text-gray-500">• Más de 500 reseñas</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-start mb-4">
                <svg className="w-8 h-8 text-blue-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5 3.871 3.871 0 0 1-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804 .167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5 3.871 3.871 0 0 1-2.748-1.179z" />
                </svg>
                <div className="flex ml-auto">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed">{testimonial.text}</p>
              
              <div className="flex items-center">
                <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  {testimonial.avatar ? (
                    <DummyImage
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      layout="fill"
                      objectFit="cover"
                    />
                  ) : (
                    <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900">{testimonial.name}</h4>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">¿Quieres ver más reseñas?</p>
          <a 
            href="https://www.google.com/search?q=Hospelia+Cali+reseñas" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            Ver todas las reseñas en Google
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
} 