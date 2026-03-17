// Importamos NextResponse para crear respuestas HTTP
import { NextResponse } from 'next/server';
import sql from 'mssql';

// Configuración de SQL Server para verificar conexión
const sqlConfig = {
  user: process.env.AZURE_SQL_USER || 'azureuser',
  password: process.env.AZURE_SQL_PASSWORD || '',
  server: process.env.AZURE_SQL_SERVER || 'your-server.database.windows.net',
  database: process.env.AZURE_SQL_DATABASE || 'miniyoutube',
  options: {
    encrypt: true, // Para Azure SQL Server
    trustServerCertificate: false,
    enableArithAbort: true,
    requestTimeout: 30000
  },
  connectionTimeout: 30000
};

/**
 * GET handler - Endpoint de salud
 * 
 * Función para verificar que el backend y SQL Server están funcionando
 * Útil para monitoreo y debugging
 */
export async function GET(request) {
  let pool;
  
  try {
    // Intentamos conectar a SQL Server para verificar que todo funciona
    pool = await sql.connect(sqlConfig);
    
    // Ejecutamos una consulta simple para verificar la conexión
    await pool.request().query('SELECT 1 as test');
    
    return NextResponse.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      message: 'Backend y SQL Server funcionando correctamente',
      database: 'SQL Server de Azure conectado'
    });
    
  } catch (error) {
    console.error('Error en health check:', error);
    return NextResponse.json(
      {
        status: 'ERROR',
        timestamp: new Date().toISOString(),
        message: 'Error en la conexión a SQL Server de Azure',
        error: error.message
      },
      { status: 500 }
    );
  } finally {
    // Siempre cerrar la conexión
    if (pool) {
      await pool.close();
    }
  }
}
