import React from 'react';
import DummyImage from './DummyImageLoader';

const partners = [
  {
    id: '1',
    name: 'Partner 1',
    logo: '/partner-1.svg'
  },
  {
    id: '2',
    name: 'Partner 2',
    logo: '/partner-2.svg'
  },
  {
    id: '3',
    name: 'Partner 3',
    logo: '/partner-3.svg'
  },
  {
    id: '4',
    name: 'Partner 4',
    logo: '/partner-4.svg'
  }
];

export default function Partners() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Hemos trabajado con
          </h2>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
          {partners.map((partner) => (
            <div key={partner.id} className="h-12 w-auto grayscale hover:grayscale-0 transition-all duration-300">
              <DummyImage
                src={partner.logo}
                alt={partner.name}
                width={120}
                height={48}
                objectFit="contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 