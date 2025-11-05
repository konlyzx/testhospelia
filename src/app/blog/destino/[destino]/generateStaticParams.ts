// Función para generar rutas estáticas
export async function generateStaticParams() {
  return [
    { destino: 'cali' },
    { destino: 'bogota' },
    { destino: 'medellin' },
    { destino: 'cartagena' }
  ];
}