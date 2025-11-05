import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Airbnb en Cali – Alternativas con mejor atención',
  description: 'Conoce opciones tipo Airbnb en Cali con la calidad y servicio de Hospelia. Reservas seguras y atención personalizada.',
  keywords: 'airbnb cali, hospedaje cali, apartamentos turísticos cali',
};

const AirbnbCali = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Airbnb en Cali – Alternativas con mejor atención</h1>
      <p className="mb-4">
        Si estás buscando opciones de alojamiento en Cali tipo Airbnb, has llegado al lugar indicado. En Hospelia, te ofrecemos una experiencia similar, pero con un valor añadido que nos diferencia: un servicio de atención al cliente excepcional y un estándar de calidad garantizado en todas nuestras propiedades. Nos aseguramos de que cada apartamento cumpla con nuestros exigentes criterios de limpieza, equipamiento y ubicación, para que tu única preocupación sea disfrutar de tu estadía.
      </p>
      <p className="mb-4">
        A diferencia de las plataformas tradicionales, en Hospelia te ofrecemos un trato cercano y personalizado. Nuestro equipo está siempre disponible para ayudarte con cualquier necesidad que puedas tener, desde recomendaciones sobre la ciudad hasta la gestión de cualquier imprevisto en tu alojamiento. Disfruta de la independencia y la autenticidad de un apartamento privado, con la tranquilidad y el respaldo de una empresa comprometida con tu satisfacción. Descubre una nueva forma de alojarte en Cali, con la confianza y el servicio que solo Hospelia te puede brindar.
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

export default AirbnbCali;