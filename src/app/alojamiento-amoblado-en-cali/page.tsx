import { Metadata } from 'next';
import LandingPageTemplate from '@/components/LandingPageTemplate';

export const metadata: Metadata = {
  title: 'Alojamiento Amoblado en Cali | Hospelia',
  description: 'Servicio integral de alojamiento amoblado en Cali. Ideal para empresas y reubicaciones.',
  keywords: 'alojamiento amoblado cali, vivienda corporativa cali, relocation cali',
};

export default async function AlojamientoAmobladoCaliPage(props: { searchParams: Promise<{ page?: string; order?: string }> }) {
  const searchParams = await props.searchParams;
  return (
    <LandingPageTemplate
      title="Alojamiento Amoblado en Cali"
      subtitle="Soluciones completas de vivienda para estancias sin preocupaciones."
      query="Cali"
      searchParams={searchParams}
      basePath="/alojamiento-amoblado-en-cali"
    />
  );
}
