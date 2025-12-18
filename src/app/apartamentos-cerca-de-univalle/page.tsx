import { Metadata } from 'next';
import LandingPageTemplate from '@/components/LandingPageTemplate';

export const metadata: Metadata = {
  title: 'Apartamentos cerca de Univalle | Hospelia',
  description: 'Alojamientos estratégicos cerca de la Universidad del Valle. Ideales para estudiantes, profesores y visitantes académicos.',
  keywords: 'apartamentos cerca univalle, alquiler cerca universidad del valle, alojamiento ingenio cali, hospedaje universitario cali',
};

export default async function ApartamentosUnivallePage(props: { searchParams: Promise<{ page?: string; order?: string }> }) {
  const searchParams = await props.searchParams;
  return (
    <LandingPageTemplate
      title="Apartamentos cerca de Univalle"
      subtitle="Ubicación estratégica cerca de la Universidad del Valle y centros comerciales."
      query="Univalle" // Asegurarse que "Univalle" retorne resultados o usar "Ingenio" / "Sur" si es necesario
      searchParams={searchParams}
      basePath="/apartamentos-cerca-de-univalle"
    />
  );
}
