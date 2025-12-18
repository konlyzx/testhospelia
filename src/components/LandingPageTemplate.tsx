import { wasiService } from '@/services/wasi';
import Link from 'next/link';
import VisitCounter from '@/app/components/VisitCounter';
import PaginationControls from '@/app/components/ui/PaginationControls';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { toDestProperty } from '@/utils/propertyUtils';
import PropertyCard from '@/components/PropertyCard';

interface LandingPageProps {
  title: string;
  subtitle: string;
  query: string;
  searchParams?: { page?: string; order?: string };
  basePath: string;
}

export default async function LandingPageTemplate({
  title,
  subtitle,
  query,
  searchParams,
  basePath,
}: LandingPageProps) {
  const page = parseInt(String(searchParams?.page || '1'), 10) || 1;
  const take = 12;
  const skip = (page - 1) * take;
  const order = (searchParams?.order || 'created_at') as 'created_at' | 'sale_price' | 'rent_price' | 'visits';

  const res = await wasiService.searchPropertiesByText(query, {
    scope: 3,
    id_availability: 1,
    take,
    skip,
    order: 'desc',
    order_by: order,
  });

  const keys = Object.keys(res).filter((k) => !isNaN(parseInt(k)));
  const items = keys.map((k) => toDestProperty(res[k]));

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <section className="relative bg-gradient-to-r from-blue-700 to-indigo-800 text-white min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
             <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
             <div className="absolute top-0 -right-4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
             <div className="absolute -bottom-8 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 drop-shadow-lg">
            {title}
          </h1>
          <p className="mt-4 text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto font-light leading-relaxed drop-shadow-md">
            {subtitle}
          </p>
        </div>
      </section>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
          <div>
              <h2 className="text-3xl font-bold text-gray-900">Propiedades Destacadas</h2>
              <p className="text-gray-500 mt-2">Encuentra el lugar perfecto para ti</p>
          </div>
        </div>

        <PaginationControls page={page} hasNext={items.length >= take} order={order} basePath={basePath} />
        
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="bg-white p-8 rounded-full shadow-sm mb-4">
                 <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                 </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900">No encontramos propiedades</h3>
            <p className="text-gray-500 mt-2 max-w-md">Lo sentimos, no hay propiedades disponibles con estos criterios en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
            {items.map((p) => (
              <PropertyCard key={p.codigo_unico} property={p} />
            ))}
          </div>
        )}
        
        <div className="mt-16 flex justify-center">
            <PaginationControls page={page} hasNext={items.length >= take} order={order} basePath={basePath} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
