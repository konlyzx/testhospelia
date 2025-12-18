import { Metadata } from 'next';
import LandingPageTemplate from '@/components/LandingPageTemplate';

export const metadata: Metadata = {
  title: 'Apartamentos amoblados en el sur de Cali | Hospelia',
  description: 'Vive en el sur de Cali con estilo. Hospelia ofrece alojamientos amoblados en barrios exclusivos como Pance, Ciudad Jardín y Valle del Lili.',
  keywords: 'apartamentos sur cali, alquiler amoblado sur cali, hospedaje cali sur, ciudad jardin, pance, valle del lili',
};

export default async function ApartamentosSurCaliPage(props: { searchParams: Promise<{ page?: string; order?: string }> }) {
  const searchParams = await props.searchParams;
  return (
    <LandingPageTemplate
      title="Apartamentos en el Sur de Cali"
      subtitle="Confort y ubicación privilegiada en las mejores zonas del sur."
      query="Sur de Cali"
      searchParams={searchParams}
      basePath="/apartamentos-en-el-sur-de-cali"
    />
  );
}
