'use client';

import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

export default function CompaniaPage() {
  const teamMembers = [
    {
      name: "María González",
      position: "CEO & Fundadora",
      description: "Emprendedora apasionada con más de 10 años de experiencia en turismo y tecnología.",
      avatar: "MG"
    },
    {
      name: "Carlos Rodríguez",
      position: "Director de Tecnología",
      description: "Especialista en desarrollo de plataformas digitales y experiencia de usuario.",
      avatar: "CR"
    },
    {
      name: "Ana Silva",
      position: "Directora de Marketing",
      description: "Experta en marketing digital y crecimiento de plataformas tecnológicas.",
      avatar: "AS"
    },
    {
      name: "Diego Morales",
      position: "Director de Operaciones",
      description: "Especialista en gestión de calidad y satisfacción del cliente.",
      avatar: "DM"
    }
  ];

  const milestones = [
    {
      year: "2023",
      title: "Fundación de Hospelia",
      description: "Iniciamos operaciones con una visión clara de revolucionar el alojamiento en Cali."
    },
    {
      year: "2023",
      title: "Primeras 50 Propiedades",
      description: "Alcanzamos nuestras primeras 50 propiedades verificadas en la plataforma."
    },
    {
      year: "2024",
      title: "1,000 Huéspedes Felices",
      description: "Celebramos el milestone de 1,000 huéspedes satisfechos con nuestros servicios."
    },
    {
      year: "2024",
      title: "Expansión de Servicios",
      description: "Lanzamos nuevas funcionalidades y mejoramos la experiencia del usuario."
    }
  ];

  const stats = [
    { number: "500+", label: "Propiedades Activas", icon: "🏠" },
    { number: "2,000+", label: "Huéspedes Satisfechos", icon: "😊" },
    { number: "4.8/5", label: "Calificación Promedio", icon: "⭐" },
    { number: "24/7", label: "Soporte al Cliente", icon: "📞" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Nuestra <span className="text-blue-200">Compañía</span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
                Somos un equipo apasionado por conectar viajeros con experiencias únicas de alojamiento 
                en la hermosa ciudad de Cali, Colombia.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Estadísticas */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center bg-white p-6 rounded-xl shadow-sm"
                >
                  <div className="text-4xl mb-3">{stat.icon}</div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Misión, Visión, Valores */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Nuestros Pilares Fundamentales
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Los principios que guían nuestro trabajo y definen quiénes somos
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-blue-50 p-8 rounded-2xl text-center"
              >
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Misión</h3>
                <p className="text-gray-700 leading-relaxed">
                  Conectar viajeros con alojamientos únicos y auténticos en Cali, 
                  facilitando experiencias memorables que promuevan el turismo local sostenible.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-green-50 p-8 rounded-2xl text-center"
              >
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Visión</h3>
                <p className="text-gray-700 leading-relaxed">
                  Ser la plataforma líder de alojamientos en Cali, reconocida por la calidad 
                  de nuestros servicios y nuestro impacto positivo en la comunidad.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="bg-purple-50 p-8 rounded-2xl text-center"
              >
                <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Valores</h3>
                <p className="text-gray-700 leading-relaxed">
                  Confianza, excelencia, hospitalidad, innovación y sostenibilidad 
                  son los valores que nos guían en cada decisión y acción.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Línea de Tiempo */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Nuestra Historia
              </h2>
              <p className="text-xl text-gray-600">
                Los momentos clave que han marcado nuestro crecimiento
              </p>
            </div>

            <div className="relative">
              {/* Línea vertical */}
              <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-blue-200"></div>
              
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className={`relative flex items-center ${
                      index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    {/* Punto en la línea */}
                    <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow-lg z-10"></div>
                    
                    {/* Contenido */}
                    <div className={`ml-12 md:ml-0 md:w-5/12 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                      <div className="bg-white p-6 rounded-xl shadow-lg">
                        <div className="text-2xl font-bold text-blue-600 mb-2">{milestone.year}</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">{milestone.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{milestone.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Equipo */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Nuestro Equipo
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Conoce a las personas apasionadas que hacen posible Hospelia
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <div className="relative mb-6">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold group-hover:scale-105 transition-transform duration-300">
                      {member.avatar}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{member.position}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Compromiso */}
        <section className="py-20 bg-blue-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Nuestro Compromiso Contigo
              </h2>
              <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-8">
                En Hospelia, nos comprometemos a brindar experiencias excepcionales, 
                mantener la calidad en cada interacción y contribuir al desarrollo 
                sostenible del turismo en Cali.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="text-4xl mb-4">🌟</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Calidad Garantizada</h3>
                  <p className="text-blue-100">Cada propiedad es verificada y cumple con nuestros estándares de calidad.</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">🤝</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Soporte Continuo</h3>
                  <p className="text-blue-100">Estamos disponibles 24/7 para resolver cualquier duda o inconveniente.</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">🌱</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Turismo Sostenible</h3>
                  <p className="text-blue-100">Promovemos prácticas responsables que benefician a la comunidad local.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contacto Corporativo */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Contacto Corporativo
              </h2>
              <p className="text-lg text-gray-600">
                Para consultas comerciales, alianzas o prensa
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-gray-50 rounded-xl"
              >
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Alianzas Comerciales</h3>
                <p className="text-gray-600 mb-4">Para propuestas de negocio y asociaciones estratégicas</p>
                <a href="mailto:comercial@hospelia.co" className="text-blue-600 hover:text-blue-700 font-medium">
                  comercial@hospelia.co
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-gray-50 rounded-xl"
              >
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Prensa y Medios</h3>
                <p className="text-gray-600 mb-4">Para consultas de prensa, entrevistas y comunicados</p>
                <a href="mailto:prensa@hospelia.co" className="text-blue-600 hover:text-blue-700 font-medium">
                  prensa@hospelia.co
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-gray-50 rounded-xl"
              >
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Oficina</h3>
                <p className="text-gray-600 mb-4">Visítanos en nuestra oficina principal</p>
                <p className="text-blue-600 font-medium">Cali, Colombia</p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
} 