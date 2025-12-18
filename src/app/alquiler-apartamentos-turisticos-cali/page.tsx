import { Metadata } from 'next';
import LandingPageTemplate from '@/components/LandingPageTemplate';

export const metadata: Metadata = {
  title: 'Alquiler Apartamentos Turísticos Cali | Hospelia',
  description: 'Disfruta de tus vacaciones en Cali con nuestros apartamentos turísticos. Ubicaciones privilegiadas cerca de los principales atractivos.',
  keywords: 'apartamentos turisticos cali, turismo cali, alojamiento vacacional cali',
};

export default async function AlquilerTuristicosCaliPage(props: { searchParams: Promise<{ page?: string; order?: string }> }) {
  const searchParams = await props.searchParams;
  return (
    <LandingPageTemplate
      title="Apartamentos Turísticos en Cali"
      subtitle="Vive Cali como un local en nuestros alojamientos turísticos."
      query="Cali"
      searchParams={searchParams}
      basePath="/alquiler-apartamentos-turisticos-cali"
    />
  );
}
