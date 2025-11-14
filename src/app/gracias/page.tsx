import type { Metadata } from 'next'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import Script from 'next/script'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Gracias por tu solicitud | Hospelia',
  description: 'Hemos recibido tu solicitud. Pronto nos contactaremos contigo para ayudarte a encontrar tu espacio ideal.',
  alternates: { canonical: 'https://hospelia.co/gracias' }
}

export default function GraciasPage() {
  return (
    <div className="bg-white min-h-screen">
      <Header />
      <section className="bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 lg:pt-40 pb-16">
          <h1 className="text-4xl font-extrabold">¡Gracias por tu solicitud!</h1>
          <p className="mt-3 text-white/90 max-w-2xl">Pronto nos pondremos en contacto para ayudarte a encontrar el apartamento ideal.</p>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white border rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900">¿Qué sigue?</h2>
          <p className="mt-2 text-gray-700">Nuestro equipo está revisando tu información. Si deseas agilizar la comunicación, puedes escribirnos directamente por WhatsApp.</p>
          <a href="https://wa.me/573017546634" target="_blank" className="inline-block mt-4 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg">Chatear por WhatsApp</a>
        </div>
      </div>
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

