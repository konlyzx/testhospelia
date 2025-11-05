import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Apartamentos amoblados económicos en Cali – Calidad sin pagar de más',
  description: 'Ahorra sin sacrificar comodidad. Apartamentos amoblados económicos en Cali disponibles hoy con Hospelia.',
  keywords: 'apartamentos económicos cali, arriendo barato cali, amoblado económico cali',
};

const ApartamentosAmobladosEconomicosCali = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Apartamentos amoblados económicos en Cali – Calidad sin pagar de más</h1>
      <p className="mb-4">
        ¿Buscas un apartamento amoblado en Cali que se ajuste a tu presupuesto? En Hospelia, creemos que la comodidad y la calidad no tienen por qué ser costosas. Por eso, te ofrecemos una selección de apartamentos amoblados económicos en diferentes zonas de la ciudad, para que puedas ahorrar sin sacrificar el confort y la seguridad que te mereces.
      </p>
      <p className="mb-4">
        Nuestros apartamentos económicos están cuidadosamente seleccionados para garantizar que cumplan con nuestros estándares de calidad. Todos están completamente equipados y listos para habitar, lo que te permite ahorrar tiempo y dinero. Ya sea que vengas a Cali por un período corto o largo, nuestros alojamientos económicos son la opción inteligente para quienes buscan una excelente relación calidad-precio. Descubre cómo puedes vivir cómodamente en Cali sin gastar de más con Hospelia.
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

export default ApartamentosAmobladosEconomicosCali;