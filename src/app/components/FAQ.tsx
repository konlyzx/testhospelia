'use client'
import React, { useState } from 'react';

const faqs = [
  {
    id: '1',
    question: '¿Cuál es la duración mínima del contrato?',
    answer: 'La duración mínima es de un mes, con flexibilidad para adaptarse a tus necesidades de arrendamiento.'
  },
  {
    id: '2',
    question: '¿Cómo funciona el pago anticipado?',
    answer: 'El pago anticipado de los meses acordados asegura tu reserva y se refleja en el contrato, garantizando tu espacio.'
  },
  {
    id: '3',
    question: '¿Los apartamentos están completamente amoblados?',
    answer: 'Sí, nuestros apartamentos están diseñados para ofrecerte comodidad total y estilo desde el primer día.'
  },
  {
    id: '4',
    question: '¿Qué servicios incluye el contrato?',
    answer: 'El contrato incluye mantenimiento, seguridad y servicios adicionales (como internet y limpieza) según la unidad.'
  },
  {
    id: '5',
    question: '¿Puedo agendar una visita antes de firmar?',
    answer: '¡Claro! Agenda una visita para conocer el apartamento y confirmar que es el ideal para ti.'
  }
];

export default function FAQ() {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Lado izquierdo */}
          <div className="md:w-1/3">
            <div className="sticky top-24 bg-blue-600 text-white p-8 rounded-xl shadow-lg">
              <h2 className="text-3xl font-bold mb-4">Preguntas</h2>
              <h3 className="text-2xl font-bold mb-4">Frecuentes</h3>
              <p className="text-blue-100">
                Todo sobre el alquiler de nuestros apartamentos amoblados en Cali: contratos mensuales, pagos anticipados y más. ¡Aquí despejamos todas tus dudas para que tomes la mejor decisión!
              </p>
            </div>
          </div>
          
          {/* Lado derecho */}
          <div className="md:w-2/3">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={faq.id} 
                  className="border border-gray-200 rounded-xl overflow-hidden"
                >
                  <button
                    className="flex justify-between items-center w-full px-6 py-4 text-left bg-white hover:bg-gray-50"
                    onClick={() => toggleItem(index)}
                  >
                    <span className="text-lg font-medium text-gray-900">
                      {faq.question}
                    </span>
                    <svg
                      className={`w-6 h-6 text-gray-500 transform ${openItem === index ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {openItem === index && (
                    <div className="px-6 py-4 bg-gray-50">
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 