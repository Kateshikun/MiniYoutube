require('dotenv').config();
const express = require('express');
const cors = require('cors');
const database = require('./config/database');
const videoRoutes = require('./routes/videoRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware para logging de solicitudes
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rutas de la API
app.use('/api/videos', videoRoutes);

// Ruta de salud para verificar que el servidor está funcionando
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'Mini YouTube Backend API',
    version: '1.0.0',
    endpoints: {
      videos: '/api/videos',
      health: '/health'
    }
  });
});

// Middleware para manejar rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.originalUrl
  });
});

// Middleware para manejar errores globales
app.use((error, req, res, next) => {
  console.error('Error global:', error);
  
  // Error de validación de Mongoose
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors
    });
  }
  
  // Error de duplicación de clave única
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `El campo ${field} ya existe`
    });
  }
  
  // Error de sintaxis JSON
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      success: false,
      message: 'JSON inválido'
    });
  }
  
  // Error por defecto
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Función para iniciar el servidor
async function startServer() {
  try {
    // Conectar a la base de datos
    await database.connect();
    
    // Iniciar el servidor Express
    app.listen(PORT, () => {
      console.log(`🚀 Servidor backend corriendo en puerto ${PORT}`);
      console.log(`📊 Entorno: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 URL base: http://localhost:${PORT}`);
      console.log(`📚 Documentación de API: http://localhost:${PORT}/api/videos`);
      console.log(`💚 Salud del servidor: http://localhost:${PORT}/health`);
    });
    
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

// Manejo de cierre graceful
process.on('SIGTERM', async () => {
  console.log('📡 Recibida señal SIGTERM, cerrando servidor...');
  await database.disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('📡 Recibida señal SIGINT, cerrando servidor...');
  await database.disconnect();
  process.exit(0);
});

// Manejo de excepciones no capturadas
process.on('uncaughtException', (error) => {
  console.error('❌ Excepción no capturada:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promesa rechazada no manejada:', reason);
  process.exit(1);
});

// Iniciar el servidor
if (require.main === module) {
  startServer();
}

module.exports = app;
