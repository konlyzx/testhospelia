import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Apartamentos amoblados en Bochalema – Zona sur de Cali',
  description: 'Disfruta de apartamentos modernos en Bochalema, una zona tranquila y cerca de todo. Ideal para estadías cortas o largas.',
  keywords: 'bochalema apartamentos, arriendo bochalema cali, amoblados sur cali',
};

const ApartamentosBochalema = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Apartamentos amoblados en Bochalema – Zona sur de Cali</h1>
      <p className="mb-4">
        Descubre la comodidad de vivir en Bochalema, una de las zonas más nuevas y de mayor desarrollo en el sur de Cali. En Hospelia, te ofrecemos apartamentos amoblados en Bochalema, ideales para quienes buscan un entorno tranquilo, seguro y con fácil acceso a universidades, centros comerciales y clínicas. Disfruta de la modernidad y el confort de nuestros alojamientos en una de las áreas con mayor proyección de la ciudad.
      </p>
      <p className="mb-4">
        Nuestros apartamentos en Bochalema están pensados para ofrecerte una experiencia de vida superior. Con diseños modernos, acabados de calidad y completamente equipados, solo necesitas traer tus maletas para empezar a disfrutar. Ya sea que vengas a Cali por estudios, trabajo o simplemente para disfrutar de un nuevo ambiente, Bochalema te ofrece un entorno residencial con amplias zonas verdes y una creciente oferta de servicios. Vive en el sur de Cali con la tranquilidad y el estilo que te mereces.
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

export default ApartamentosBochalema;