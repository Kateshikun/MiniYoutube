const Video = require('../models/Video');
const azureStorage = require('../config/azureStorage');

class VideoController {
  // Obtener todos los videos con paginación
  async getAllVideos(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'uploadedAt',
        sortOrder = -1
      } = req.query;

      const skip = (page - 1) * limit;
      const sortOrderNum = parseInt(sortOrder);

      const videos = await Video.find({ status: 'active' })
        .sort({ [sortBy]: sortOrderNum })
        .skip(skip)
        .limit(parseInt(limit))
        .exec();

      const total = await Video.countDocuments({ status: 'active' });

      // Generar URLs para cada video
      const videosWithUrls = await Promise.all(
        videos.map(async (video) => {
          try {
            const urlData = await azureStorage.getVideoUrl(video.blobName);
            return {
              ...video.toJSON(),
              videoUrl: urlData.url
            };
          } catch (error) {
            console.error(`Error generando URL para video ${video.videoId}:`, error);
            return {
              ...video.toJSON(),
              videoUrl: null
            };
          }
        })
      );

      res.json({
        success: true,
        data: {
          videos: videosWithUrls,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error) {
      console.error('Error al obtener videos:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener los videos',
        error: error.message
      });
    }
  }

  // Obtener un video por su ID
  async getVideoById(req, res) {
    try {
      const { videoId } = req.params;

      const video = await Video.findOne({ 
        videoId: videoId, 
        status: 'active' 
      });

      if (!video) {
        return res.status(404).json({
          success: false,
          message: 'Video no encontrado'
        });
      }

      // Incrementar el contador de vistas
      await video.incrementViews();

      // Obtener URL del video
      try {
        const urlData = await azureStorage.getVideoUrl(video.blobName);
        
        res.json({
          success: true,
          data: {
            ...video.toJSON(),
            videoUrl: urlData.url
          }
        });
      } catch (urlError) {
        console.error('Error generando URL del video:', urlError);
        res.json({
          success: true,
          data: {
            ...video.toJSON(),
            videoUrl: null
          }
        });
      }
    } catch (error) {
      console.error('Error al obtener video:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener el video',
        error: error.message
      });
    }
  }

  // Obtener URL de un video específico
  async getVideoUrl(req, res) {
    try {
      const { videoId } = req.params;

      const video = await Video.findOne({ 
        videoId: videoId, 
        status: 'active' 
      });

      if (!video) {
        return res.status(404).json({
          success: false,
          message: 'Video no encontrado'
        });
      }

      const urlData = await azureStorage.getVideoUrl(video.blobName);

      res.json({
        success: true,
        data: {
          videoId: video.videoId,
          url: urlData.url,
          blobName: urlData.blobName,
          containerName: urlData.containerName
        }
      });
    } catch (error) {
      console.error('Error al obtener URL del video:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener la URL del video',
        error: error.message
      });
    }
  }

  // Buscar videos por texto
  async searchVideos(req, res) {
    try {
      const {
        q: searchText,
        page = 1,
        limit = 10,
        sortBy = 'uploadedAt',
        sortOrder = -1
      } = req.query;

      if (!searchText) {
        return res.status(400).json({
          success: false,
          message: 'El texto de búsqueda es requerido'
        });
      }

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder: parseInt(sortOrder)
      };

      const result = await Video.searchByText(searchText, options);

      // Generar URLs para cada video
      const videosWithUrls = await Promise.all(
        result.videos.map(async (video) => {
          try {
            const urlData = await azureStorage.getVideoUrl(video.blobName);
            return {
              ...video.toJSON(),
              videoUrl: urlData.url
            };
          } catch (error) {
            console.error(`Error generando URL para video ${video.videoId}:`, error);
            return {
              ...video.toJSON(),
              videoUrl: null
            };
          }
        })
      );

      res.json({
        success: true,
        data: {
          videos: videosWithUrls,
          pagination: result.pagination,
          searchText
        }
      });
    } catch (error) {
      console.error('Error al buscar videos:', error);
      res.status(500).json({
        success: false,
        message: 'Error al buscar videos',
        error: error.message
      });
    }
  }

  // Obtener videos populares
  async getPopularVideos(req, res) {
    try {
      const { limit = 10 } = req.query;

      const videos = await Video.getPopular(parseInt(limit));

      // Generar URLs para cada video
      const videosWithUrls = await Promise.all(
        videos.map(async (video) => {
          try {
            const urlData = await azureStorage.getVideoUrl(video.blobName);
            return {
              ...video.toJSON(),
              videoUrl: urlData.url
            };
          } catch (error) {
            console.error(`Error generando URL para video ${video.videoId}:`, error);
            return {
              ...video.toJSON(),
              videoUrl: null
            };
          }
        })
      );

      res.json({
        success: true,
        data: videosWithUrls
      });
    } catch (error) {
      console.error('Error al obtener videos populares:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener videos populares',
        error: error.message
      });
    }
  }

  // Obtener videos recientes
  async getRecentVideos(req, res) {
    try {
      const { limit = 10 } = req.query;

      const videos = await Video.getRecent(parseInt(limit));

      // Generar URLs para cada video
      const videosWithUrls = await Promise.all(
        videos.map(async (video) => {
          try {
            const urlData = await azureStorage.getVideoUrl(video.blobName);
            return {
              ...video.toJSON(),
              videoUrl: urlData.url
            };
          } catch (error) {
            console.error(`Error generando URL para video ${video.videoId}:`, error);
            return {
              ...video.toJSON(),
              videoUrl: null
            };
          }
        })
      );

      res.json({
        success: true,
        data: videosWithUrls
      });
    } catch (error) {
      console.error('Error al obtener videos recientes:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener videos recientes',
        error: error.message
      });
    }
  }

  // Obtener videos por creador
  async getVideosByCreator(req, res) {
    try {
      const { creator } = req.params;
      const {
        page = 1,
        limit = 10,
        sortBy = 'uploadedAt',
        sortOrder = -1
      } = req.query;

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder: parseInt(sortOrder)
      };

      const result = await Video.getByCreator(creator, options);

      // Generar URLs para cada video
      const videosWithUrls = await Promise.all(
        result.videos.map(async (video) => {
          try {
            const urlData = await azureStorage.getVideoUrl(video.blobName);
            return {
              ...video.toJSON(),
              videoUrl: urlData.url
            };
          } catch (error) {
            console.error(`Error generando URL para video ${video.videoId}:`, error);
            return {
              ...video.toJSON(),
              videoUrl: null
            };
          }
        })
      );

      res.json({
        success: true,
        data: {
          videos: videosWithUrls,
          pagination: result.pagination,
          creator
        }
      });
    } catch (error) {
      console.error('Error al obtener videos del creador:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener videos del creador',
        error: error.message
      });
    }
  }

  // Crear un nuevo video (para administración)
  async createVideo(req, res) {
    try {
      const {
        videoId,
        title,
        description,
        creator,
        blobName,
        duration,
        fileSize,
        contentType,
        tags
      } = req.body;

      // Verificar si el video ya existe
      const existingVideo = await Video.findOne({ videoId });
      if (existingVideo) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un video con ese ID'
        });
      }

      // Verificar que el blob exista en Azure Storage
      try {
        await azureStorage.getVideoMetadata(blobName);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: 'El archivo de video no existe en Azure Storage',
          error: error.message
        });
      }

      const video = new Video({
        videoId,
        title,
        description,
        creator,
        blobName,
        duration,
        fileSize,
        contentType,
        tags: tags || []
      });

      await video.save();

      res.status(201).json({
        success: true,
        message: 'Video creado exitosamente',
        data: video
      });
    } catch (error) {
      console.error('Error al crear video:', error);
      res.status(500).json({
        success: false,
        message: 'Error al crear el video',
        error: error.message
      });
    }
  }

  // Actualizar metadatos de un video (para administración)
  async updateVideo(req, res) {
    try {
      const { videoId } = req.params;
      const updates = req.body;

      const video = await Video.findOneAndUpdate(
        { videoId, status: 'active' },
        updates,
        { new: true, runValidators: true }
      );

      if (!video) {
        return res.status(404).json({
          success: false,
          message: 'Video no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Video actualizado exitosamente',
        data: video
      });
    } catch (error) {
      console.error('Error al actualizar video:', error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar el video',
        error: error.message
      });
    }
  }

  // Eliminar un video (borrado lógico)
  async deleteVideo(req, res) {
    try {
      const { videoId } = req.params;

      const video = await Video.findOneAndUpdate(
        { videoId, status: 'active' },
        { status: 'deleted' },
        { new: true }
      );

      if (!video) {
        return res.status(404).json({
          success: false,
          message: 'Video no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Video eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar video:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar el video',
        error: error.message
      });
    }
  }
}

module.exports = new VideoController();
