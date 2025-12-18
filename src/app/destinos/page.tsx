import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import DestinationCover from '@/app/components/DestinationCover';

export const metadata: Metadata = {
  title: 'Destinos en Cali | Hospelia',
  description: 'Explora los mejores destinos y zonas para alojarte en Cali con Hospelia. Encuentra apartamentos amoblados en las mejores ubicaciones.',
  alternates: { canonical: 'https://hospelia.co/destinos' }
};

const destinations = [
  { slug: 'apartamentos-en-el-sur-de-cali', title: 'Sur de Cali', description: 'La zona de mayor desarrollo y valorización.' },
  { slug: 'apartamentos-por-dias-en-cali', title: 'Por Días', description: 'Opciones flexibles para estancias cortas.' },
  { slug: 'apartamentos-en-bochalema', title: 'Bochalema', description: 'Tranquilidad y naturaleza en una zona moderna.' },
  { slug: 'apartamentos-cerca-de-univalle', title: 'Cerca de Univalle', description: 'Ubicación estratégica cerca a la universidad.' },
];

export default function DestinosPage() {
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: destinations.map((d, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: d.title,
      url: `https://hospelia.co/destinos/${d.slug}`
    }))
  };

  return (
    <div className="bg-white min-h-screen">
      <Header />
      
      {/* Schema.org ItemList */}
      <Script
        id="schema-itemlist-destinos"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListSchema)
        }}
      />

      <section className="bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 text-white min-h-[80vh] flex items-center relative">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 pt-24 pb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold">Destinos Populares en Cali</h1>
          <p className="mt-2 text-white/90">Encuentra el lugar perfecto en la zona que más te guste.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {destinations.map((destination) => (
            <Link 
              key={destination.slug} 
              href={`/destinos/${destination.slug}`}
              className="group relative h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <DestinationCover slug={destination.slug} title={destination.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">{destination.title}</h3>
                <p className="text-white/80 text-sm">{destination.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
