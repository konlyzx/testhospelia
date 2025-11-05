import { NextRequest, NextResponse } from 'next/server';

// Configuración para exportación estática
export const dynamic = 'force-static';
export const revalidate = false;

export async function POST(request: NextRequest) {
  try {
    const eventData = await request.json();
    
    // Validar que los datos del evento estén presentes
    if (!eventData.data || !Array.isArray(eventData.data)) {
      return NextResponse.json(
        { error: 'Datos de evento inválidos' },
        { status: 400 }
      );
    }

    // Obtener el token de acceso desde las variables de entorno
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
    const pixelId = process.env.FACEBOOK_PIXEL_ID;
    
    if (!accessToken || !pixelId) {
      console.error('Facebook Access Token o Pixel ID no configurados');
      return NextResponse.json(
        { error: 'Configuración de Facebook no encontrada' },
        { status: 500 }
      );
    }

    // Enviar evento a Facebook Conversions API
    const facebookResponse = await fetch(
      `https://graph.facebook.com/v18.0/${pixelId}/events`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: eventData.data,
          access_token: accessToken,
          test_event_code: process.env.FACEBOOK_TEST_EVENT_CODE, // Solo para testing
        }),
      }
    );

    if (!facebookResponse.ok) {
      const errorData = await facebookResponse.json();
      console.error('Error de Facebook API:', errorData);
      return NextResponse.json(
        { error: 'Error al enviar evento a Facebook', details: errorData },
        { status: facebookResponse.status }
      );
    }

    const result = await facebookResponse.json();
    
    // Log del evento enviado (sin datos sensibles)
    console.log('Evento enviado a Facebook:', {
      events_received: result.events_received,
      messages: result.messages,
      fbtrace_id: result.fbtrace_id,
    });

    return NextResponse.json({
      success: true,
      facebook_response: result,
    });

  } catch (error) {
    console.error('Error en Facebook Conversions API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
