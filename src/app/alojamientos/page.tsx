import { Metadata } from 'next';
import WasiPropertiesList from '@/components/WasiPropertiesList';

export const metadata: Metadata = {
  title: 'Alojamientos en Colombia - Hospelia',
  description: 'Explora alojamientos disponibles en Colombia: apartamentos, casas y opciones para renta o venta con fotos, precios y filtros útiles.',
  keywords: ['alojamientos en Colombia', 'alquiler de alojamientos', 'apartamentos en Cali', 'alojamientos Hospelia', 'renta de propiedades', 'venta de propiedades'],
};

export default function AlojamientosPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Alojamientos
          </h1>
          <p className="text-lg text-gray-700">
            Descubre alojamientos disponibles con fotos, precios y detalles. Usa los filtros para encontrar tu lugar ideal.
          </p>
        </div>

        {/* Listado de propiedades de WASI */}
        <WasiPropertiesList
          filters={{
            take: 12,
          }}
          className="mt-8"
        />
      </div>
    </div>
  );
}