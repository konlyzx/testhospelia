import type { Metadata } from 'next'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import Script from 'next/script'
import Link from 'next/link'
import { FaWhatsapp, FaCheckCircle, FaSearch, FaHome } from 'react-icons/fa'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Gracias por tu solicitud | Hospelia',
  description: 'Hemos recibido tu solicitud. Pronto nos contactaremos contigo para ayudarte a encontrar tu espacio ideal.',
  alternates: { canonical: 'https://hospelia.co/gracias' }
}

export default function GraciasPage() {
  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Header />
      
      {/* Hero Section Simplificado y Centrado */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 text-white min-h-[60vh] flex flex-col justify-center items-center relative text-center px-4">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-3xl mx-auto pt-20">
          <div className="mb-6 flex justify-center">
            <div className="bg-white/20 backdrop-blur-md p-4 rounded-full border-2 border-white/30 shadow-xl">
              <FaCheckCircle className="text-white text-5xl md:text-6xl" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            ¡Solicitud Recibida!
          </h1>
          <p className="text-xl md:text-2xl text-blue-50 font-medium max-w-2xl mx-auto leading-relaxed">
            Gracias por confiar en Hospelia. Tu búsqueda de alojamiento ideal está en buenas manos.
          </p>
        </div>
      </section>

      {/* Contenido Principal */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 pb-20">
        
        {/* Tarjeta de "Pasos Siguientes" */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-12 border border-gray-100">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10">
            ¿Qué sucede ahora?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Línea conectora (visible solo en desktop) */}
            <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-1 bg-gray-100 rounded-full -z-10"></div>

            {/* Paso 1 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl font-bold mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                1
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Revisión</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Nuestro equipo de concierges analiza tus preferencias y necesidades específicas.
              </p>
            </div>

            {/* Paso 2 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl font-bold mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                2
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Contacto</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Te contactaremos vía WhatsApp o correo en menos de 24 horas con opciones curadas.
              </p>
            </div>

            {/* Paso 3 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl font-bold mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                3
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Reserva</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Elige tu favorita, realizamos el proceso de reserva seguro y ¡listo!
              </p>
            </div>
          </div>

          {/* Call to Action Principal */}
          <div className="mt-12 bg-green-50 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-green-100">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full text-green-600">
                <FaWhatsapp className="text-3xl" />
              </div>
              <div className="text-left">
                <h4 className="text-lg font-bold text-gray-900">¿Tienes prisa?</h4>
                <p className="text-gray-600 text-sm">Habla directamente con un asesor ahora mismo.</p>
              </div>
            </div>
            <a 
              href="https://wa.me/573017546634?text=Hola,%20acabo%20de%20enviar%20una%20solicitud%20en%20la%20web%20y%20quisiera%20agilizar%20el%20proceso." 
              target="_blank" 
              className="w-full md:w-auto px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg hover:shadow-green-200 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <FaWhatsapp />
              Chatear ahora
            </a>
          </div>
        </div>

        {/* Botones Secundarios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/" className="group flex items-center justify-between p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 p-3 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <FaHome className="text-xl" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Volver al Inicio</h4>
                <p className="text-sm text-gray-500">Sigue explorando propiedades</p>
              </div>
            </div>
            <span className="text-gray-300 group-hover:text-blue-600 transition-colors">→</span>
          </Link>

          <Link href="/blog" className="group flex items-center justify-between p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-purple-50 p-3 rounded-xl text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <FaSearch className="text-xl" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Visita nuestro Blog</h4>
                <p className="text-sm text-gray-500">Guías y consejos sobre Cali</p>
              </div>
            </div>
            <span className="text-gray-300 group-hover:text-purple-600 transition-colors">→</span>
          </Link>
        </div>

      </div>

      {/* Google Ads Conversion Script */}
      <Script id="google-ads-conversion" strategy="afterInteractive">
        {`
          const urlParams = new URLSearchParams(window.location.search);
          const conversionValue = parseFloat(urlParams.get('value')) || 1.0;
          const conversionCurrency = urlParams.get('currency') || 'COP';

          gtag('event', 'conversion', {
              'send_to': 'AW-943201081/dpzsCNDA3YcaELm24MED',
              'value': conversionValue,
              'currency': conversionCurrency
          });
        `}
      </Script>

      <Script id="ga-thankyou" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `
        if (window && window.gtag) {
          window.gtag('event', 'page_view', {
            page_title: 'Gracias',
            page_location: window.location.href,
            page_path: '/gracias'
          });
        }
      `}} />
      <Footer />
    </div>
  )
}

