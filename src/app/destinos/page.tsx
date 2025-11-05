import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Destinos - Hospelia',
  description: 'Descubre los mejores destinos en Colombia con Hospelia',
};

export default function DestinosPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Destinos
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Explora los mejores destinos de Colombia
          </p>
          <p className="text-gray-700">
            Esta página está en construcción. Pronto encontrarás aquí información sobre los mejores destinos.
          </p>
        </div>
      </div>
    </div>
  );
} 