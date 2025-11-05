import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Alojamiento amoblado en Cali – Tu hogar temporal',
  description: 'Alojamiento completamente amoblado en Cali, con Wi-Fi, parqueadero y zonas comunes. Vive como en casa con Hospelia.',
  keywords: 'alojamiento amoblado cali, renta amoblada cali, apartaestudio cali',
};

const AlojamientoAmobladoCali = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Alojamiento amoblado en Cali – Tu hogar temporal</h1>
      <p className="mb-4">
        Encontrar un alojamiento amoblado en Cali que se sienta como un verdadero hogar es posible con Hospelia. Nos especializamos en ofrecerte apartamentos que no solo están completamente equipados, sino que también han sido decorados con un estilo moderno y acogedor para que te sientas a gusto desde el primer momento. Ya sea que tu estadía sea corta o larga, nuestro objetivo es que vivas una experiencia de confort y bienestar.
      </p>
      <p className="mb-4">
        Todos nuestros alojamientos amoblados en Cali incluyen servicios esenciales como Wi-Fi de alta velocidad y parqueadero. Además, muchos de ellos se encuentran en unidades residenciales que ofrecen zonas comunes como piscina, gimnasio y áreas de coworking, para que puedas complementar tu rutina diaria sin salir de casa. En Hospelia, nos encargamos de todos los detalles para que tú solo te preocupes por disfrutar de tu estancia en Cali. Vive la experiencia de un hogar temporal con todas las comodidades de un servicio profesional.
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

export default AlojamientoAmobladoCali;