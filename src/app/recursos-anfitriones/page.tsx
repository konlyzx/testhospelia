import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Recursos para Anfitriones - Hospelia',
  description: 'Recursos y herramientas para anfitriones de Hospelia',
};

export default function RecursosAnfitrionesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Recursos para Anfitriones
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Herramientas y recursos para maximizar tus ingresos
          </p>
          <p className="text-gray-700">
            Esta página está en construcción. Pronto encontrarás aquí recursos útiles para anfitriones.
          </p>
        </div>
      </div>
    </div>
  );
} 