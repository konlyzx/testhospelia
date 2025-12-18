import { Metadata } from 'next';
import LandingPageTemplate from '@/components/LandingPageTemplate';

export const metadata: Metadata = {
  title: 'Apartamentos en Bochalema, Cali | Hospelia',
  description: 'Descubre apartamentos modernos en Bochalema. Una zona tranquila, segura y rodeada de naturaleza en el sur de Cali.',
  keywords: 'apartamentos bochalema, alquiler bochalema cali, vivir en bochalema, sur de cali',
};

export default async function ApartamentosBochalemaPage(props: { searchParams: Promise<{ page?: string; order?: string }> }) {
  const searchParams = await props.searchParams;
  return (
    <LandingPageTemplate
      title="Apartamentos en Bochalema"
      subtitle="Tranquilidad y modernidad en una de las zonas con mayor crecimiento de Cali."
      query="Bochalema"
      searchParams={searchParams}
      basePath="/apartamentos-en-bochalema"
    />
  );
}
