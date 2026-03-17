// Endpoint simple de prueba sin dependencias externas
import { NextResponse } from 'next/server';

/**
 * GET handler - Endpoint de prueba simple
 * 
 * Función para verificar que Next.js API Routes funciona
 * sin dependencias de base de datos o servicios externos
 */
export async function GET(request) {
  return NextResponse.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'API Routes funcionando correctamente',
    environment: {
      node_version: process.version,
      platform: process.platform,
      next_version: '14.x'
    }
  });
}
