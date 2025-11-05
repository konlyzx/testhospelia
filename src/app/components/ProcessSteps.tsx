import React from 'react';

const steps = [
  {
    id: 'elige',
    title: 'Elige',
    description: 'Explora una selección exclusiva de apartamentos en Cali y elige tu refugio perfecto en la ciudad.',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8.01 8.01 0 0 1-8 8z" />
        <path d="M9.5 11.5 11 13l3.5-3.5 1.5 1.5-5 5-3.5-3.5 1.5-1.5z" />
      </svg>
    )
  },
  {
    id: 'reserva',
    title: 'Reserva',
    description: 'Asegura tu estancia con solo unos clics. Reserva tu apartamento en Cali de manera sencilla y segura.',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
        <path d="M7 14h5v5H7z" />
      </svg>
    )
  },
  {
    id: 'paga',
    title: 'Paga',
    description: 'Convenientes opciones de pago para adaptarse a tus necesidades. Garantiza tu alojamiento en Cali sin complicaciones.',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
        <path d="M13 15h2v2h-2z" />
      </svg>
    )
  },
  {
    id: 'disfruta',
    title: 'Disfruta',
    description: 'Sumérgete en el lujo y la comodidad en nuestros apartamentos exclusivos. ¡Disfruta de una experiencia inolvidable en Cali!',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
      </svg>
    )
  }
];

export default function ProcessSteps() {
  return (
    <section className="py-16 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.id} className="bg-blue-600 text-white rounded-xl p-6 text-center shadow-lg hover:bg-blue-700 transition-colors">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-white/20 rounded-full">
                  {step.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-sm text-blue-100">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 