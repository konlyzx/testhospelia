import { Metadata } from 'next';
import LandingPageTemplate from '@/components/LandingPageTemplate';

export const metadata: Metadata = {
  title: 'Airbnb en Cali – Alternativas con mejor atención | Hospelia',
  description: 'Conoce opciones tipo Airbnb en Cali con la calidad y servicio de Hospelia. Reservas seguras y atención personalizada.',
  keywords: 'airbnb cali, hospedaje cali, apartamentos turísticos cali, alquiler vacacional cali',
};

export default async function AirbnbCaliPage(props: { searchParams: Promise<{ page?: string; order?: string }> }) {
  const searchParams = await props.searchParams;
  return (
    <LandingPageTemplate
      title="Airbnb en Cali"
      subtitle="Alternativas profesionales con mejor atención y seguridad garantizada."
      query="Cali"
      searchParams={searchParams}
      basePath="/airbnb-en-cali"
    />
  );
}
