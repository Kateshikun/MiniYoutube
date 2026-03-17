import { NextResponse } from 'next/server';
import sql from 'mssql';

// 🔹 Configuración SQL Server (Azure)
const sqlConfig = {
  user: process.env.AZURE_SQL_USER,
  password: process.env.AZURE_SQL_PASSWORD,
  server: process.env.AZURE_SQL_SERVER,
  database: process.env.AZURE_SQL_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: false
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 80000
  }
};

// 🔹 Pool GLOBAL (NO cerrar por request)
let pool;

const getPool = async () => {
  if (!pool) {
    pool = await sql.connect(sqlConfig);
    console.log('✅ Conectado a SQL Server');
  }
  return pool;
};

// 🔹 Construir URL SIN Azure SDK
const buildVideoUrl = (blobName) => {
  const container = process.env.AZURE_STORAGE_CONTAINER_NAME || 'videos';
  const account = process.env.AZURE_STORAGE_ACCOUNT_NAME;

  if (!account) {
    return `/videos/${blobName}`;
  }

  return `https://${account}.blob.core.windows.net/${container}/${blobName}`;
};

// 🔹 GET /api/videos
export async function GET() {
  try {
    const pool = await getPool();

    // 🔥 Query CORREGIDA según tu tabla real
    const result = await pool.request().query(`
      SELECT 
        id_video,
        titulo,
        descripcion,
        blob_Name,
        fecha_subida,
        vistas
      FROM videos
      ORDER BY fecha_subida DESC
    `);

    const videos = result.recordset;

    // 🔹 Transformación limpia
    const data = videos.map(video => ({
      videoId: video.id_video,
      title: video.titulo,
      description: video.descripcion,
      views: video.vistas,
      uploadedAt: video.fecha_subida,
      videoUrl: buildVideoUrl(video.blob_Name)
    }));

    return NextResponse.json({
      success: true,
      count: data.length,
      data
    });

  } catch (error) {
    console.error('❌ Error en GET /api/videos:', error);

    // 🔴 Errores específicos útiles
    if (error.code === 'ELOGIN') {
      return NextResponse.json({
        success: false,
        message: 'Credenciales incorrectas de SQL Server'
      }, { status: 500 });
    }

    if (error.code === 'ETIMEOUT') {
      return NextResponse.json({
        success: false,
        message: 'Timeout: revisa firewall o red de Azure'
      }, { status: 500 });
    }

    if (error.code === 'EREQUEST' && error.message.includes('Invalid object name')) {
      return NextResponse.json({
        success: false,
        message: 'La tabla "videos" no existe'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: false,
      message: 'Error interno',
      code: error.code,
      error: error.message
    }, { status: 500 });
  }
}