import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Apartamentos cerca de Univalle – Cómodos y seguros',
  description: 'Apartamentos amoblados cerca de la Universidad del Valle. Perfectos para estudiantes o visitantes temporales.',
  keywords: 'apartamento univalle, arriendo cerca de univalle, alojamiento estudiantes cali',
};

const ApartamentosCercaUnivalle = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Apartamentos cerca de Univalle – Cómodos y seguros</h1>
      <p className="mb-4">
        Si eres estudiante, profesor o necesitas estar cerca de la Universidad del Valle, en Hospelia tenemos la solución de alojamiento perfecta para ti. Ofrecemos apartamentos amoblados, cómodos y seguros en las inmediaciones del campus universitario. Olvídate de los largos desplazamientos y aprovecha al máximo tu tiempo en un entorno diseñado para tu bienestar y rendimiento académico.
      </p>
      <p className="mb-4">
        Nuestros apartamentos cerca de Univalle están ubicados en barrios tranquilos y con excelente acceso a transporte público, supermercados y zonas de ocio. Todos están completamente equipados para que no tengas que preocuparte por nada más que tus estudios o trabajo. Disfruta de un espacio propio, con la privacidad y la comodidad que necesitas para concentrarte y descansar. En Hospelia, apoyamos tu éxito académico y profesional ofreciéndote un hogar temporal de calidad.
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

export default ApartamentosCercaUnivalle;