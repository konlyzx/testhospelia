import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Centro de Ayuda - Hospelia',
  description: 'Centro de ayuda y soporte de Hospelia',
};

export default function CentroAyudaPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Centro de Ayuda
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Encuentra respuestas a tus preguntas
          </p>
          <p className="text-gray-700">
            Esta página está en construcción. Pronto encontrarás aquí nuestro centro de ayuda completo con preguntas frecuentes y guías.
          </p>
        </div>
      </div>
    </div>
  );
} 