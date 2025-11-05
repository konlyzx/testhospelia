import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Empleo - Hospelia',
  description: 'Oportunidades de empleo en Hospelia',
};

export default function EmpleoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Empleo
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Únete a nuestro equipo
          </p>
          <p className="text-gray-700">
            Esta página está en construcción. Pronto encontrarás aquí nuestras oportunidades de empleo.
          </p>
        </div>
      </div>
    </div>
  );
} 