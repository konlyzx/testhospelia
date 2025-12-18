import { Metadata } from 'next';
import LandingPageTemplate from '@/components/LandingPageTemplate';

export const metadata: Metadata = {
  title: 'Alquiler Temporal en Cali | Hospelia',
  description: 'Soluciones de alquiler temporal en Cali para ejecutivos, turistas y familias. Estancias flexibles desde semanas hasta meses.',
  keywords: 'alquiler temporal cali, estancias cortas cali, alojamiento temporal cali',
};

export default async function AlquilerTemporalCaliPage(props: { searchParams: Promise<{ page?: string; order?: string }> }) {
  const searchParams = await props.searchParams;
  return (
    <LandingPageTemplate
      title="Alquiler Temporal en Cali"
      subtitle="Flexibilidad total para tus necesidades de alojamiento temporal."
      query="Cali"
      searchParams={searchParams}
      basePath="/alquiler-temporal-en-cali"
    />
  );
}
