import { Metadata } from 'next';
import LandingPageTemplate from '@/components/LandingPageTemplate';

export const metadata: Metadata = {
  title: 'Apartamentos Amoblados en Cali | Hospelia',
  description: 'Encuentra la mayor variedad de apartamentos amoblados en Cali. Listos para habitar, con todos los servicios incluidos.',
  keywords: 'apartamentos amoblados cali, alquiler amoblado cali, vivienda amoblada cali',
};

export default async function ApartamentosAmobladosCaliPage(props: { searchParams: Promise<{ page?: string; order?: string }> }) {
  const searchParams = await props.searchParams;
  return (
    <LandingPageTemplate
      title="Apartamentos Amoblados en Cali"
      subtitle="Comodidad y estilo en cada rincón. Tu hogar listo para vivir."
      query="Cali"
      searchParams={searchParams}
      basePath="/apartamentos-amoblados-en-cali"
    />
  );
}
