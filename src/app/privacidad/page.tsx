"use client";

import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

export default function PrivacidadPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-600 to-green-800 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Política de Privacidad
              </h1>
              <p className="text-xl text-green-100">
                Protegemos sus datos personales en Hospelia.co
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
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Información que Recopilamos</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    En Hospelia.co recopilamos información para brindarle el mejor servicio:
                  </p>
                  <ul className="text-gray-700 space-y-2">
                    <li>• <strong>Información personal:</strong> Nombre, email, teléfono</li>
                    <li>• <strong>Información de reserva:</strong> Fechas, preferencias, requerimientos especiales</li>
                    <li>• <strong>Información de pago:</strong> Datos procesados de forma segura por nuestros proveedores</li>
                    <li>• <strong>Información técnica:</strong> IP, navegador, comportamiento en el sitio</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Cómo Utilizamos su Información</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Sus datos son utilizados exclusivamente para:
                  </p>
                  <ul className="text-gray-700 space-y-2">
                    <li>• Procesar y gestionar sus reservas</li>
                    <li>• Brindar atención al cliente personalizada</li>
                    <li>• Mejorar nuestros servicios y experiencia de usuario</li>
                    <li>• Enviar comunicaciones relacionadas con su estadía</li>
                    <li>• Cumplir con obligaciones legales</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Compartir Información</h2>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>No vendemos, alquilamos o compartimos sus datos personales</strong> con terceros 
                    para fines comerciales. Solo compartimos información cuando:
                  </p>
                  <ul className="text-gray-700 space-y-2 mt-4">
                    <li>• Es necesario para completar su reserva</li>
                    <li>• Lo exige la ley</li>
                    <li>• Usted nos da consentimiento explícito</li>
                    <li>• Es necesario para proteger nuestros derechos legales</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Seguridad de Datos</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Implementamos medidas de seguridad técnicas y organizacionales para proteger 
                    sus datos personales contra acceso no autorizado, alteración, divulgación o destrucción.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookies y Tecnologías Similares</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Utilizamos cookies para mejorar su experiencia en nuestro sitio web, 
                    recordar sus preferencias y analizar el tráfico del sitio. Puede configurar 
                    su navegador para rechazar cookies, aunque esto puede afectar la funcionalidad del sitio.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Sus Derechos</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Usted tiene derecho a:
                  </p>
                  <ul className="text-gray-700 space-y-2">
                    <li>• Acceder a sus datos personales</li>
                    <li>• Rectificar información incorrecta</li>
                    <li>• Solicitar la eliminación de sus datos</li>
                    <li>• Oponerse al procesamiento de sus datos</li>
                    <li>• Portabilidad de datos</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Retención de Datos</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Conservamos sus datos personales solo durante el tiempo necesario para 
                    cumplir con los fines para los que fueron recopilados y para cumplir 
                    con nuestras obligaciones legales.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Menores de Edad</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Nuestros servicios están dirigidos a personas mayores de 18 años. 
                    No recopilamos intencionalmente información personal de menores de edad.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Cambios a esta Política</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Podemos actualizar esta política de privacidad ocasionalmente. 
                    Le notificaremos sobre cambios significativos publicando la nueva 
                    política en nuestro sitio web.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contacto</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Para ejercer sus derechos o hacer consultas sobre esta política:
                  </p>
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <p className="text-green-900 font-semibold">Email: hospelia007@gmail.com</p>
                    <p className="text-green-900 font-semibold">Teléfono: +57 301 754 6634</p>
                    <p className="text-green-900 font-semibold">Horarios: Lunes a Domingo, 8:00 AM - 10:00 PM</p>
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