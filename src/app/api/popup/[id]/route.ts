import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route para servir como proxy al endpoint de popup de WordPress
 * Esto evita problemas de CORS durante el desarrollo local
 */

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Configuración para exportación estática
export const dynamic = 'force-static';
export const revalidate = false;

// Función para generar rutas estáticas
export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' }
  ];
}

// Función para manejar las solicitudes GET
export async function GET(
  request: NextRequest,
  context: RouteParams
) {
  const { id: popupId } = await context.params;
  const wpBaseUrl = process.env.NEXT_PUBLIC_API_REST?.split('/wp-json')[0] || 'https://wp.hospelia.co';
  const popupEndpoint = `${wpBaseUrl}/wp-json/hospelia/v1/${popupId}`;
  
  try {
    const response = await fetch(popupEndpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      // Importante: No incluimos credenciales para evitar problemas con CORS preflight
      cache: 'no-store' // No almacenar en caché para siempre obtener datos frescos
    });
    
    if (!response.ok) {
      console.error(`Proxy: Error HTTP desde WordPress: ${response.status}`);
      
      // Si falla, devolvemos un contenido alternativo con instrucciones
      return NextResponse.json({
        content: `
          <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
            <h2>No se pudo cargar el popup desde WordPress</h2>
            <p>Error al obtener el popup con ID: ${popupId}</p>
            <p>Asegúrate de que el popup existe en WordPress y está utilizando el shortcode:</p>
            <code>[elementor-template id="${popupId}"]</code>
          </div>
        `,
        assets: { css: [], js: [] }
      }, {
        status: 200,
        headers: {
          // Agregamos encabezados CORS para permitir solicitudes desde cualquier origen en desarrollo
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      });
    }
    
    const data = await response.json();
    
    // Devolvemos los datos con encabezados CORS apropiados
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  } catch (error) {
    console.error('Proxy: Error al procesar la solicitud:', error);
    
    // En caso de error, devolvemos una respuesta con contenido alternativo
    return NextResponse.json({
      content: `
        <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
          <h2>Error al conectar con WordPress</h2>
          <p>No se pudo conectar con el servidor de WordPress para obtener el popup.</p>
          <p>Error: ${error instanceof Error ? error.message : 'Desconocido'}</p>
        </div>
      `,
      assets: { css: [], js: [] }
    }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  }
}

// Función para manejar solicitudes preflight OPTIONS de CORS
export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}