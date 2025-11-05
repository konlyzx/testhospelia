// Función para generar rutas estáticas
export async function generateStaticParams() {
  return [
    { categoria: 'alojamientos' },
    { categoria: 'turismo' },
    { categoria: 'gastronomia' }
  ];
}