"use client";

import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

export default function CookiesPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-orange-600 to-orange-800 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Política de Cookies
              </h1>
              <p className="text-xl text-orange-100">
                Información sobre el uso de cookies en Hospelia.co
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
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">¿Qué son las Cookies?</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Las cookies son pequeños archivos de texto que se almacenan en su dispositivo 
                    cuando visita nuestro sitio web. Nos ayudan a proporcionar una mejor experiencia 
                    de usuario y a entender cómo utiliza nuestro sitio.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Tipos de Cookies que Utilizamos</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-blue-900 mb-3">Cookies Esenciales</h3>
                      <p className="text-blue-800 mb-3">
                        Son necesarias para el funcionamiento básico del sitio web.
                      </p>
                      <ul className="text-blue-700 space-y-1">
                        <li>• Mantener sus preferencias de sesión</li>
                        <li>• Recordar items en su carrito</li>
                        <li>• Funcionalidad de seguridad</li>
                      </ul>
                    </div>

                    <div className="bg-green-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-green-900 mb-3">Cookies de Funcionalidad</h3>
                      <p className="text-green-800 mb-3">
                        Mejoran la funcionalidad y personalización del sitio.
                      </p>
                      <ul className="text-green-700 space-y-1">
                        <li>• Recordar sus preferencias de idioma</li>
                        <li>• Guardar configuraciones de accesibilidad</li>
                        <li>• Personalizar contenido</li>
                      </ul>
                    </div>

                    <div className="bg-yellow-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-yellow-900 mb-3">Cookies Analíticas</h3>
                      <p className="text-yellow-800 mb-3">
                        Nos ayudan a entender cómo los visitantes usan nuestro sitio.
                      </p>
                      <ul className="text-yellow-700 space-y-1">
                        <li>• Google Analytics para estadísticas anónimas</li>
                        <li>• Análisis de comportamiento de usuario</li>
                        <li>• Optimización de rendimiento</li>
                      </ul>
                    </div>

                    <div className="bg-purple-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-purple-900 mb-3">Cookies de Marketing</h3>
                      <p className="text-purple-800 mb-3">
                        Para mostrar anuncios relevantes y medir efectividad.
                      </p>
                      <ul className="text-purple-700 space-y-1">
                        <li>• Google Ads para seguimiento de conversiones</li>
                        <li>• Remarketing y retargeting</li>
                        <li>• Análisis de campañas publicitarias</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies de Terceros</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Algunos servicios de terceros pueden establecer cookies en nuestro sitio:
                  </p>
                  <ul className="text-gray-700 space-y-2">
                    <li>• <strong>Google Analytics:</strong> Para análisis de tráfico web</li>
                    <li>• <strong>Google Ads:</strong> Para seguimiento de conversiones</li>
                    <li>• <strong>Redes sociales:</strong> Para funcionalidades de compartir</li>
                    <li>• <strong>Mapas:</strong> Para mostrar ubicaciones de propiedades</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Gestión de Cookies</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Usted puede controlar y gestionar las cookies de varias maneras:
                  </p>
                  
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Configuración del Navegador</h3>
                    <ul className="text-gray-700 space-y-2">
                      <li>• <strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies</li>
                      <li>• <strong>Firefox:</strong> Preferencias → Privacidad y seguridad</li>
                      <li>• <strong>Safari:</strong> Preferencias → Privacidad</li>
                      <li>• <strong>Edge:</strong> Configuración → Cookies y permisos del sitio</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies Específicas que Utilizamos</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300 rounded-lg">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="border-b border-gray-300 px-4 py-3 text-left">Cookie</th>
                          <th className="border-b border-gray-300 px-4 py-3 text-left">Propósito</th>
                          <th className="border-b border-gray-300 px-4 py-3 text-left">Duración</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        <tr>
                          <td className="border-b border-gray-200 px-4 py-3">_ga</td>
                          <td className="border-b border-gray-200 px-4 py-3">Google Analytics - ID único</td>
                          <td className="border-b border-gray-200 px-4 py-3">2 años</td>
                        </tr>
                        <tr>
                          <td className="border-b border-gray-200 px-4 py-3">_gid</td>
                          <td className="border-b border-gray-200 px-4 py-3">Google Analytics - ID de sesión</td>
                          <td className="border-b border-gray-200 px-4 py-3">24 horas</td>
                        </tr>
                        <tr>
                          <td className="border-b border-gray-200 px-4 py-3">session_id</td>
                          <td className="border-b border-gray-200 px-4 py-3">Mantener sesión activa</td>
                          <td className="border-b border-gray-200 px-4 py-3">Sesión</td>
                        </tr>
                        <tr>
                          <td className="border-b border-gray-200 px-4 py-3">preferences</td>
                          <td className="border-b border-gray-200 px-4 py-3">Guardar preferencias de usuario</td>
                          <td className="border-b border-gray-200 px-4 py-3">1 año</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Impacto de Deshabilitar Cookies</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Si deshabilita las cookies, algunas funcionalidades pueden verse afectadas:
                  </p>
                  <ul className="text-gray-700 space-y-2">
                    <li>• No podremos recordar sus preferencias</li>
                    <li>• Algunas funciones del sitio pueden no trabajar correctamente</li>
                    <li>• No podremos personalizar su experiencia</li>
                    <li>• Los formularios pueden requerir información repetida</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Actualizaciones de esta Política</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Podemos actualizar esta política de cookies ocasionalmente para reflejar 
                    cambios en nuestras prácticas o por razones operativas, legales o regulatorias.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Contacto</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Si tiene preguntas sobre nuestra política de cookies:
                  </p>
                  <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                    <p className="text-orange-900 font-semibold">Email: hospelia007@gmail.com</p>
                    <p className="text-orange-900 font-semibold">Teléfono: +57 301 754 6634</p>
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