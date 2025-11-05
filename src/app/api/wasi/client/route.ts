import { NextRequest, NextResponse } from 'next/server';
import { wasiService } from '@/services/wasi';

// Configuración para exportación estática
export const dynamic = 'force-static';
export const revalidate = false;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    
    
    // Validar campos requeridos
    if (!formData.email || (!formData.nombre && !formData.nombres && !formData.name)) {
      console.error('❌ Campos requeridos faltantes:', {
        email: !!formData.email,
        nombre: !!(formData.nombre || formData.nombres || formData.name),
        telefono: !!(formData.telefono || formData.phone)
      });
      
      return NextResponse.json(
        { 
          error: 'Campos requeridos faltantes',
          details: 'Se requieren: nombre y email como mínimo',
          received: Object.keys(formData)
        },
        { status: 400 }
      );
    }

    // Determinar el tipo de cliente y origen
    const isFromHostForm = formData.source === 'hazte-anfitrion' || formData.tipoAlojamiento;
    const isFromPopupClient = formData.source === 'popup-cliente';
    const originName = isFromHostForm ? 'Hazte Anfitrión' : 
                      isFromPopupClient ? 'Popup Cliente' : 'Portal Inmobiliario';
    
    console.log(`🎯 Procesando cliente desde: ${originName}`, {
      isFromHostForm,
      isFromPopupClient,
      hasAccommodationType: !!formData.tipoAlojamiento,
      source: formData.source
    });

    // Procesar y enviar a Wasi CRM
    const wasiClientData = await wasiService.processFormData(formData, originName);
    
    console.log('👤 Creando cliente en Wasi...');
    const wasiResponse = await wasiService.createClient(wasiClientData);
    console.log('✅ Cliente creado exitosamente en Wasi:', wasiResponse);
    
    // Asignar la etiqueta apropiada según el origen (ya creadas manualmente)
    let labelAssigned = false;
    let labelId = null;
    try {
      if (isFromHostForm) {
        console.log('🏷️ Buscando etiqueta de Anfitrión...');
        labelId = await wasiService.getHostLabelId();
        if (labelId) {
          labelAssigned = await wasiService.assignLabelToClient(wasiResponse.id_client, labelId);
          console.log(`✅ Etiqueta de Anfitrión ${labelAssigned ? 'asignada' : 'no asignada'} al cliente ${wasiResponse.id_client}`);
        } else {
          console.warn('⚠️ Etiqueta "Anfitrión" no encontrada');
        }
      } else if (isFromPopupClient) {
        console.log('🏷️ Buscando etiqueta de Cliente desde Popup...');
        labelId = await wasiService.getClientLabelId();
        if (labelId) {
          labelAssigned = await wasiService.assignLabelToClient(wasiResponse.id_client, labelId);
          console.log(`✅ Etiqueta de Cliente ${labelAssigned ? 'asignada' : 'no asignada'} al cliente ${wasiResponse.id_client}`);
        } else {
          console.warn('⚠️ Etiqueta "Cliente" no encontrada');
        }
      } else {
        console.log('🏷️ Buscando etiqueta de Cliente general...');
        labelId = await wasiService.getClientLabelId();
        if (labelId) {
          labelAssigned = await wasiService.assignLabelToClient(wasiResponse.id_client, labelId);
          console.log(`✅ Etiqueta de Cliente ${labelAssigned ? 'asignada' : 'no asignada'} al cliente ${wasiResponse.id_client}`);
        } else {
          console.warn('⚠️ Etiqueta "Cliente" no encontrada');
        }
      }
    } catch (labelError) {
      console.warn('⚠️ Error al asignar etiqueta (el cliente ya fue creado):', labelError);
      // No fallar todo el proceso si no se puede asignar la etiqueta
    }

    return NextResponse.json({
      success: true,
      message: 'Cliente registrado exitosamente en Wasi CRM',
      wasi_client_id: wasiResponse.id_client,
      wasi_status: wasiResponse.status,
      client_type: isFromHostForm ? 'Anfitrión' : 'Cliente',
      label_assigned: labelAssigned,
      label_id: labelId,
      debug: {
        processed_data: wasiClientData,
        wasi_response: wasiResponse,
        origin: originName,
        is_host: isFromHostForm,
        label_found: labelId !== null,
        label_assignment_success: labelAssigned
      }
    });

  } catch (error) {
    console.error('💥 Error al procesar solicitud de Wasi:', error);
    
    // Extraer información más detallada del error
    let errorDetails = 'Error desconocido';
    let errorStatus = 500;
    
    if (error instanceof Error) {
      errorDetails = error.message;
      
      // Si el error viene de Wasi con información específica
      if (error.message.includes('400')) {
        errorStatus = 400;
      } else if (error.message.includes('401')) {
        errorStatus = 401;
      } else if (error.message.includes('403')) {
        errorStatus = 403;
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Error al procesar solicitud con Wasi CRM',
        details: errorDetails,
        timestamp: new Date().toISOString(),
        // Solo incluir stack trace en desarrollo
        ...(process.env.NODE_ENV === 'development' && { 
          stack: error instanceof Error ? error.stack : undefined 
        })
      },
      { status: errorStatus }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'API de Wasi CRM - Solo acepta métodos POST',
    version: '1.0.0',
    endpoints: {
      'POST /api/wasi/client': 'Crear nuevo cliente en Wasi CRM'
    },
    status: 'active'
  });
}
