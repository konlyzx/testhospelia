import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Apartamentos amoblados en Cali – Vive cómodo con Hospelia',
  description: 'Descubre apartamentos amoblados en Cali listos para mudarte hoy. Hospelia te conecta con alojamientos modernos, equipados y en las mejores zonas.',
  keywords: 'apartamentos amoblados cali, alquiler cali amoblado, apartaestudios cali',
};

const ApartamentosAmobladosCali = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Apartamentos amoblados en Cali – Hospelia</h1>
      <p className="mb-4">
        En Hospelia, entendemos que encontrar el lugar perfecto para vivir en Cali es más que solo un techo sobre tu cabeza. Es encontrar un hogar que se adapte a tu estilo de vida, que te brinde comodidad y que esté ubicado en una zona que te permita disfrutar de todo lo que la ciudad tiene para ofrecer. Por eso, nos especializamos en ofrecer una cuidada selección de apartamentos amoblados en las mejores zonas de Cali, listos para que te mudes hoy mismo.
      </p>
      <p className="mb-4">
        Nuestros apartamentos están completamente equipados con todo lo que necesitas para una estadía placentera, ya sea que vengas a Cali por trabajo, estudios o turismo. Desde cocinas modernas y funcionales hasta cómodas habitaciones y áreas sociales, cada detalle ha sido pensado para que te sientas como en casa. Olvídate de la molestia de comprar muebles o equipar un apartamento desde cero. Con Hospelia, solo tienes que llegar con tus maletas y empezar a disfrutar de tu nuevo hogar en Cali.
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

export default ApartamentosAmobladosCali;