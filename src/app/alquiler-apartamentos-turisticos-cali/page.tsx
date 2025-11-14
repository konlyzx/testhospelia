import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Alquiler de apartamentos turísticos en Cali – Vive la ciudad',
  description: 'Si vienes a Cali de vacaciones, elige un apartamento turístico Hospelia. Más privacidad y comodidad que un hotel.',
  keywords: 'apartamentos turísticos cali, alojamiento vacacional cali, arriendo turístico cali',
};

const AlquilerApartamentosTuristicosCali = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Alquiler de apartamentos turísticos en Cali – Vive la ciudad</h1>
      <p className="mb-4">
        ¿Planeando unas vacaciones en Cali? Vive la ciudad como un local alojándote en uno de nuestros apartamentos turísticos. En Hospelia, te ofrecemos una alternativa a los hoteles que te brinda mayor privacidad, espacio y la posibilidad de sumergirte en la auténtica vida caleña. Disfruta de la libertad de tener tu propio hogar en la Sucursal del Cielo, con todas las comodidades que necesitas para una estancia inolvidable.
      </p>
      <p className="mb-4">
        Nuestros apartamentos turísticos en Cali están ubicados en las zonas más vibrantes y seguras de la ciudad, cerca de los principales atractivos turísticos, restaurantes y sitios de rumba. Todos están completamente amoblados y equipados, para que solo te preocupes por explorar y disfrutar. Ya sea que viajes en pareja, en familia o con amigos, tenemos el apartamento perfecto para tus necesidades. Descubre Cali a tu manera, con la comodidad y la flexibilidad que te ofrece Hospelia.
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

export default AlquilerApartamentosTuristicosCali;