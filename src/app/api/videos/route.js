// Importamos las herramientas necesarias
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { BlobServiceClient } from '@azure/storage-blob';

// Configuración de la base de datos - Conexión a MongoDB
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return; // Ya está conectado
  
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
  }
};

// Función para obtener URL de video en Azure Blob Storage
const getVideoUrl = async (blobName) => {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'videos';
  
  const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlobClient(blobName);
  
  return blobClient.url;
};

// Esquema de Video - Define la estructura de datos para cada video
const videoSchema = new mongoose.Schema({
  videoId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  creator: { type: String, required: true },
  blobName: { type: String, required: true },
  views: { type: Number, default: 0 },
  uploadedAt: { type: Date, default: Date.now }
});

// Modelo de Video - Para interactuar con la colección de videos en MongoDB
const Video = mongoose.models.Video || mongoose.model('Video', videoSchema);

/**
 * GET handler - Obtener todos los videos
 * 
 * Flujo completo:
 * 1. Conectar a MongoDB
 * 2. Buscar todos los videos
 * 3. Para cada video, obtener su URL de Azure
 * 4. Devolver todo junto al frontend
 */
export async function GET(request) {
  try {
    // Paso 1: Conectar a la base de datos
    await connectDB();
    
    // Paso 2: Buscar todos los videos en MongoDB, ordenados por fecha (más recientes primero)
    const videos = await Video.find().sort({ uploadedAt: -1 });
    
    // Paso 3: Para cada video, obtener su URL desde Azure Blob Storage
    const videosWithUrls = await Promise.all(
      videos.map(async (video) => {
        try {
          const url = await getVideoUrl(video.blobName);
          return {
            videoId: video.videoId,
            title: video.title,
            description: video.description,
            creator: video.creator,
            views: video.views,
            uploadedAt: video.uploadedAt,
            videoUrl: url
          };
        } catch (error) {
          console.error(`Error obteniendo URL para video ${video.videoId}:`, error);
          return {
            videoId: video.videoId,
            title: video.title,
            description: video.description,
            creator: video.creator,
            views: video.views,
            uploadedAt: video.uploadedAt,
            videoUrl: null
          };
        }
      })
    );
    
    // Paso 4: Retornar respuesta exitosa con todos los videos y sus URLs
    return NextResponse.json({
      success: true,
      data: videosWithUrls
    });
    
  } catch (error) {
    console.error('Error general en GET /api/videos:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error al obtener los videos'
      },
      { status: 500 }
    );
  }
}
