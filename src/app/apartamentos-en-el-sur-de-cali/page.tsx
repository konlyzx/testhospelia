import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Apartamentos amoblados en el sur de Cali – Confort y ubicación',
  description: 'Vive en el sur de Cali con estilo. Hospelia ofrece alojamientos amoblados en barrios exclusivos con todas las comodidades.',
  keywords: 'apartamentos sur cali, alquiler amoblado sur cali, hospedaje cali sur',
};

const ApartamentosSurCali = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Apartamentos amoblados en el sur de Cali – Confort y ubicación</h1>
      <p className="mb-4">
        El sur de Cali es sinónimo de exclusividad, confort y calidad de vida. En Hospelia, te ofrecemos una selección premium de apartamentos amoblados en los mejores barrios del sur de la ciudad, como Pance, Ciudad Jardín y Valle del Lili. Disfruta de un entorno privilegiado, rodeado de naturaleza, centros comerciales de lujo y los mejores restaurantes de la ciudad. Vivir en el sur de Cali es una experiencia que combina la tranquilidad de un sector residencial con la conveniencia de tener todo al alcance de tu mano.
      </p>
      <p className="mb-4">
        Nuestros apartamentos en el sur de Cali están diseñados para quienes buscan un estilo de vida superior. Con amplios espacios, acabados de alta gama y una decoración moderna y funcional, cada apartamento es un refugio de confort y buen gusto. Además, muchos de nuestros alojamientos se encuentran en unidades residenciales con piscina, gimnasio y zonas verdes, para que disfrutes de un estilo de vida activo y relajado. Descubre por qué el sur de Cali es la zona preferida para vivir y déjanos ayudarte a encontrar tu hogar ideal.
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

export default ApartamentosSurCali;