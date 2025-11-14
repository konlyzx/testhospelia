import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Apartamentos por días en Cali – Reserva fácil con Hospelia',
  description: 'Encuentra apartamentos por días en Cali, ideales para viajes, turismo o trabajo. Sin papeleo, sin estrés.',
  keywords: 'apartamentos por días cali, alojamiento temporal cali, renta corta cali',
};

const ApartamentosPorDiasCali = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Apartamentos por días en Cali – Reserva fácil con Hospelia</h1>
      <p className="mb-4">
        ¿Necesitas un lugar para quedarte en Cali solo por unos días? En Hospelia, te lo ponemos fácil. Ofrecemos un servicio de alquiler de apartamentos por días, perfecto para turistas, viajeros de negocios o cualquier persona que necesite un alojamiento flexible y sin complicaciones. Olvídate de los hoteles impersonales y disfruta de la privacidad, el espacio y la comodidad de tener tu propio apartamento en la ciudad, aunque sea por poco tiempo.
      </p>
      <p className="mb-4">
        Reservar un apartamento por días en Cali con Hospelia es un proceso rápido y sencillo. Todos nuestros apartamentos están completamente amoblados y equipados, listos para que llegues y te instales. Disfruta de la libertad de tener tu propio espacio, con cocina para preparar tus comidas y áreas para relajarte o trabajar. Además, al estar ubicados en las mejores zonas de Cali, tendrás todo lo que necesitas a tu alcance. Vive Cali a tu ritmo, con la comodidad y la flexibilidad que solo Hospelia te puede ofrecer.
      </p>
      <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Image
          src="/img/banners/Banner-Hospelia-sur-de-cali.webp"
          alt="Apartamento amoblado en el sur de Cali"
          width={500}
          height={300}
          className="rounded-lg"
        />
        <Image
          src="/img/banners/Banner-Hospelia-apartamentos-cali.webp"
          alt="Apartamento amoblado en el sur de Cali"
          width={500}
          height={300}
          className="rounded-lg"
        />
      </div>
      <div className="text-center">
        <Link href="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Ver apartamentos disponibles →
        </Link>
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            setTimeout(() => {
              window.location.href = "https://hospelia.co";
            }, 4000);
          `,
        }}
      />
    </div>
  );
};

export default ApartamentosPorDiasCali;