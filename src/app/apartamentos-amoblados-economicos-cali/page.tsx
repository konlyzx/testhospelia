import { Metadata } from 'next';
import LandingPageTemplate from '@/components/LandingPageTemplate';

export const metadata: Metadata = {
  title: 'Apartamentos Amoblados Económicos en Cali | Hospelia',
  description: 'Opciones de alojamiento amoblado a precios accesibles en Cali. Calidad y economía para tu estancia.',
  keywords: 'apartamentos economicos cali, alquiler barato cali, hospedaje economico cali',
};

export default async function ApartamentosEconomicosCaliPage(props: { searchParams: Promise<{ page?: string; order?: string }> }) {
  const searchParams = await props.searchParams;
  // Podríamos forzar un orden por precio si lo deseamos, pero por defecto mostramos los más recientes
  return (
    <LandingPageTemplate
      title="Apartamentos Amoblados Económicos"
      subtitle="Calidad y confort al mejor precio."
      query="Cali"
      searchParams={searchParams}
      basePath="/apartamentos-amoblados-economicos-cali"
    />
  );
}
