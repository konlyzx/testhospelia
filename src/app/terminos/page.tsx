"use client";

import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

export default function TerminosPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Términos y Condiciones
              </h1>
              <p className="text-xl text-blue-100">
                Condiciones generales de uso de Hospelia.co
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contenido */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={fadeIn}
              viewport={{ once: true }}
              className="prose prose-lg max-w-none"
            >
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Aceptación de Términos</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Al acceder y utilizar los servicios de Hospelia.co, usted acepta estos términos y condiciones 
                    en su totalidad. Si no está de acuerdo con alguno de estos términos, no debe utilizar nuestros servicios.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Servicios de Hospelia</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Hospelia.co es una plataforma que conecta huéspedes con apartamentos amoblados en Cali, Colombia. 
                    Nuestros servicios incluyen:
                  </p>
                  <ul className="text-gray-700 space-y-2">
                    <li>• Listado y búsqueda de propiedades</li>
                    <li>• Proceso de reserva y pago</li>
                    <li>• Atención al cliente</li>
                    <li>• Servicios adicionales según la propiedad</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Registro y Cuenta de Usuario</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Para utilizar nuestros servicios, debe proporcionar información precisa y actualizada. 
                    Es responsable de mantener la confidencialidad de su cuenta y de todas las actividades 
                    que ocurran bajo su cuenta.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Reservas y Pagos</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Las reservas están sujetas a disponibilidad. Los precios pueden cambiar sin previo aviso. 
                    Los pagos se procesan a través de métodos seguros y las políticas de cancelación 
                    varían según la propiedad.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Responsabilidades del Huésped</h2>
                  <ul className="text-gray-700 space-y-2">
                    <li>• Respetar las reglas de la propiedad</li>
                    <li>• Mantener la propiedad en buen estado</li>
                    <li>• Reportar cualquier daño o problema</li>
                    <li>• Cumplir con los términos de estadía</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Limitación de Responsabilidad</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Hospelia.co actúa como intermediario entre huéspedes y propietarios. No somos responsables 
                    por daños directos o indirectos que puedan surgir del uso de nuestros servicios.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Modificaciones</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Nos reservamos el derecho de modificar estos términos en cualquier momento. 
                    Las modificaciones entrarán en vigor inmediatamente después de su publicación en nuestro sitio web.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contacto</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Para preguntas sobre estos términos y condiciones, puede contactarnos en:
                  </p>
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-blue-900 font-semibold">Email: hospelia007@gmail.com</p>
                    <p className="text-blue-900 font-semibold">Teléfono: +57 301 754 6634</p>
                  </div>
                </div>

                <div className="border-t pt-8">
                  <p className="text-sm text-gray-500">
                    Última actualización: Enero 2025
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
} 