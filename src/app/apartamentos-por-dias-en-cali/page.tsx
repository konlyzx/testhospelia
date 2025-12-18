import { Metadata } from 'next';
import LandingPageTemplate from '@/components/LandingPageTemplate';

export const metadata: Metadata = {
  title: 'Apartamentos por Días en Cali | Hospelia',
  description: 'Encuentra apartamentos por días en Cali ideales para turismo o negocios. Ubicaciones estratégicas y totalmente amoblados.',
  keywords: 'apartamentos por dias cali, alquiler por dias cali, hospedaje por dias, turismo cali',
};

export default async function ApartamentosPorDiasCaliPage(props: { searchParams: Promise<{ page?: string; order?: string }> }) {
  const searchParams = await props.searchParams;
  return (
    <LandingPageTemplate
      title="Apartamentos por Días en Cali"
      subtitle="Flexibilidad y comodidad para tus estancias cortas."
      query="Cali"
      searchParams={searchParams}
      basePath="/apartamentos-por-dias-en-cali"
    />
  );
}
