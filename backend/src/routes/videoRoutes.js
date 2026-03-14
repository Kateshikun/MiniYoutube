const express = require('express');
const videoController = require('../controllers/videoController');

const router = express.Router();

// Rutas públicas para el frontend

// GET /api/videos - Obtener todos los videos con paginación
// Query params: page, limit, sortBy, sortOrder
router.get('/', videoController.getAllVideos);

// GET /api/videos/popular - Obtener videos populares
// Query params: limit
router.get('/popular', videoController.getPopularVideos);

// GET /api/videos/recent - Obtener videos recientes
// Query params: limit
router.get('/recent', videoController.getRecentVideos);

// GET /api/videos/search - Buscar videos por texto
// Query params: q (texto de búsqueda), page, limit, sortBy, sortOrder
router.get('/search', videoController.searchVideos);

// GET /api/videos/creator/:creator - Obtener videos por creador
// Query params: page, limit, sortBy, sortOrder
router.get('/creator/:creator', videoController.getVideosByCreator);

// GET /api/videos/:videoId - Obtener un video específico por ID
router.get('/:videoId', videoController.getVideoById);

// GET /api/videos/:videoId/url - Obtener URL de un video específico
router.get('/:videoId/url', videoController.getVideoUrl);

// Rutas de administración (pueden requerir autenticación en el futuro)

// POST /api/videos - Crear un nuevo video (admin)
router.post('/', videoController.createVideo);

// PUT /api/videos/:videoId - Actualizar metadatos de un video (admin)
router.put('/:videoId', videoController.updateVideo);

// DELETE /api/videos/:videoId - Eliminar un video (admin)
router.delete('/:videoId', videoController.deleteVideo);

module.exports = router;
