import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Alquiler temporal en Cali – Apartamentos listos para ti',
  description: '¿Necesitas quedarte en Cali por días o semanas? En Hospelia encuentras apartamentos temporales con todo incluido.',
  keywords: 'alquiler temporal cali, apartamento por días cali, arriendo corto cali',
};

const AlquilerTemporalCali = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Alquiler temporal en Cali – Apartamentos listos para ti</h1>
      <p className="mb-4">
        ¿Planeando una estadía corta en Cali? Ya sea por trabajo, un proyecto temporal o simplemente para explorar la ciudad, en Hospelia te ofrecemos la solución perfecta con nuestros apartamentos de alquiler temporal. Olvídate de las complicaciones de los contratos de arrendamiento tradicionales y disfruta de la flexibilidad y comodidad de un hogar completamente amoblado y equipado a tu disposición.
      </p>
      <p className="mb-4">
        Nuestros apartamentos temporales en Cali están diseñados para brindarte una experiencia sin preocupaciones. Cuentan con todos los servicios incluidos, como Wi-Fi de alta velocidad, para que puedas mantenerte conectado y productivo. Ubicados en zonas estratégicas de la ciudad, tendrás fácil acceso a centros de negocios, universidades y atracciones turísticas. En Hospelia, hacemos que tu estadía temporal en Cali sea lo más cómoda y placentera posible.
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

export default AlquilerTemporalCali;