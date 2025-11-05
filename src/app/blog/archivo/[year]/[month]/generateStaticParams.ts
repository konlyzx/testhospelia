// Función para generar rutas estáticas
export async function generateStaticParams() {
  // Devolvemos un array con algunas combinaciones de año/mes comunes para generar estáticamente
  return [
    { year: '2023', month: 'enero' },
    { year: '2023', month: 'febrero' },
    { year: '2023', month: 'marzo' },
    { year: '2023', month: 'abril' },
    { year: '2023', month: 'mayo' }
  ];
}