// Importamos NextResponse para crear respuestas HTTP
import { NextResponse } from 'next/server';

/**
 * GET handler - Endpoint de salud
 * 
 * Función simple para verificar que el backend está funcionando
 * Útil para monitoreo y debugging
 */
export async function GET(request) {
  return NextResponse.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'Backend funcionando correctamente'
  });
}
