import { NextRequest, NextResponse } from 'next/server';
import { wasiService } from '@/services/wasi';

// Configuración para exportación estática
export const dynamic = 'force-static';
export const revalidate = false;

export async function GET() {
  try {
    
    const origins = await wasiService.getClientOrigins();
    

    return NextResponse.json({
      success: true,
      data: origins
    });

  } catch (error) {
    console.error('Error al obtener medios de captación:', error);
    
    return NextResponse.json(
      { 
        error: 'Error al obtener medios de captación',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
