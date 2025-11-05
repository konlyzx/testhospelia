// Función para generar rutas estáticas
export async function generateStaticParams() {
  // Devolvemos un array con algunos slugs comunes para generar estáticamente
  return [
    { slug: 'descubre-cali-colombia-5-razones-irresistibles-para-visitar-la-ciudad-de-la-salsa' },
    { slug: 'mejores-alojamientos-en-cali' },
    { slug: 'guia-turistica-cali' },
    { slug: 'gastronomia-cali' },
    { slug: 'eventos-cali' }
  ];
}