"use client";

import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Chatbot from "../components/Chatbot";
import Image from "next/image";
import { motion } from "framer-motion";

export default function SobreNosotrosPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const team = [
    {
      name: "Laura Martínez",
      role: "CEO & Fundadora",
      img: "https://images.unsplash.com/photo-1544725176-7c40e5a2c9f9?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Carlos Gómez",
      role: "CTO",
      img: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Ana Rodríguez",
      role: "CMO",
      img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80",
    },
  ];

  const valores = [
    { titulo: "Transparencia", descripcion: "Operamos con honestidad y claridad en cada paso." },
    { titulo: "Innovación", descripcion: "Buscamos soluciones creativas para mejorar la experiencia de alojamiento." },
    { titulo: "Hospitalidad", descripcion: "Ponemos a nuestros huéspedes y anfitriones en el centro de todo." },
    { titulo: "Calidad", descripcion: "Nos esforzamos por ofrecer alojamientos y servicios de alto nivel." },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-r from-blue-600 to-blue-800 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Sobre <span className="text-blue-200">Hospelia</span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                Conectamos huéspedes con alojamientos únicos en Cali, creando experiencias memorables 
                y promoviendo el turismo local sostenible.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Nuestra Historia */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Nuestra Historia
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    Hospelia nació del amor por Cali y la pasión por brindar experiencias únicas de hospedaje. 
                    Fundada por un equipo de emprendedores locales, nuestra misión es conectar a viajeros con 
                    los mejores alojamientos de la capital de la salsa.
                  </p>
                  <p>
                    Reconocemos que cada viajero es único, por eso trabajamos incansablemente para ofrecer 
                    una amplia variedad de opciones que se adapten a diferentes gustos, presupuestos y necesidades.
                  </p>
                  <p>
                    Desde apartamentos modernos en el centro histórico hasta casas familiares en barrios 
                    residenciales, cada propiedad en nuestra plataforma ha sido cuidadosamente seleccionada 
                    y verificada para garantizar la mejor experiencia posible.
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative h-96 rounded-2xl overflow-hidden shadow-2xl"
              >
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <div className="text-center text-white">
                    <svg className="w-20 h-20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <p className="text-lg font-semibold">Cali, Colombia</p>
                    <p className="text-blue-200">Nuestra ciudad</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Nuestra Misión y Visión */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Misión y Visión
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-blue-50 p-8 rounded-2xl"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Nuestra Misión</h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-center">
                  Facilitar conexiones auténticas entre viajeros y anfitriones locales, 
                  ofreciendo alojamientos únicos y experiencias memorables que promuevan 
                  el turismo sostenible y el desarrollo económico de Cali.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-green-50 p-8 rounded-2xl"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Nuestra Visión</h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-center">
                  Ser la plataforma líder de alojamientos en Cali, reconocida por la calidad 
                  de nuestros servicios, la confianza de nuestros usuarios y nuestro impacto 
                  positivo en la comunidad local.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Nuestros Valores */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Nuestros Valores
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Los principios que guían cada decisión y acción en Hospelia
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: "🤝",
                  title: "Confianza",
                  description: "Construimos relaciones sólidas basadas en la transparencia, honestidad y cumplimiento de nuestras promesas."
                },
                {
                  icon: "🌟",
                  title: "Excelencia",
                  description: "Nos esforzamos por superar las expectativas en cada interacción, buscando siempre la mejora continua."
                },
                {
                  icon: "❤️",
                  title: "Hospitalidad",
                  description: "Tratamos a cada huésped como familia, brindando calidez humana y atención personalizada."
                },
                {
                  icon: "🌱",
                  title: "Sostenibilidad",
                  description: "Promovemos prácticas responsables que beneficien tanto a viajeros como a la comunidad local."
                },
                {
                  icon: "💡",
                  title: "Innovación",
                  description: "Adoptamos tecnología y métodos creativos para mejorar constantemente la experiencia del usuario."
                },
                {
                  icon: "🏠",
                  title: "Comunidad",
                  description: "Fomentamos el desarrollo económico local y valoramos las tradiciones culturales de Cali."
                }
              ].map((valor, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="text-4xl mb-4 text-center">{valor.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">{valor.title}</h3>
                  <p className="text-gray-600 text-center leading-relaxed">{valor.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Estadísticas */}
        <section className="py-20 bg-blue-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Hospelia en Números
              </h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Nuestro crecimiento y impacto en la comunidad
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "500+", label: "Propiedades Verificadas" },
                { number: "2,000+", label: "Huéspedes Satisfechos" },
                { number: "4.8/5", label: "Calificación Promedio" },
                { number: "24/7", label: "Atención al Cliente" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-blue-100 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contacto */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                ¿Quieres Conocer Más?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Estamos aquí para responder todas tus preguntas y ayudarte en tu próxima aventura en Cali
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-gray-50 rounded-xl"
              >
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600">hola@hospelia.co</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-gray-50 rounded-xl"
              >
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Teléfono</h3>
                <p className="text-gray-600">+57 301 754 6634</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
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
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Ubicación</h3>
                <p className="text-gray-600">Cali, Colombia</p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      
      {/* Chatbot flotante */}
      <Chatbot />
    </div>
  );
} 