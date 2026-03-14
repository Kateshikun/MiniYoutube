const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  // Identificador único del video
  videoId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  
  // Título del video
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  
  // Descripción del video
  description: {
    type: String,
    required: false,
    trim: true,
    maxlength: 2000
  },
  
  // Nombre del creador del video
  creator: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  
  // Nombre del archivo en Azure Blob Storage
  blobName: {
    type: String,
    required: true,
    trim: true
  },
  
  // URL del video (generada dinámicamente)
  videoUrl: {
    type: String,
    required: false // Se genera dinámicamente
  },
  
  // Duración del video en segundos
  duration: {
    type: Number,
    required: false,
    min: 0
  },
  
  // Tamaño del archivo en bytes
  fileSize: {
    type: Number,
    required: false,
    min: 0
  },
  
  // Tipo de contenido (MIME type)
  contentType: {
    type: String,
    required: false,
    enum: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm']
  },
  
  // Thumbnail URL (opcional)
  thumbnailUrl: {
    type: String,
    required: false
  },
  
  // Etiquetas para búsqueda
  tags: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  
  // Número de vistas
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Estado del video (activo, inactivo, procesando)
  status: {
    type: String,
    enum: ['active', 'inactive', 'processing', 'deleted'],
    default: 'active'
  },
  
  // Fecha de subida
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  
  // Fecha de última actualización
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  // Opciones del schema
  timestamps: true, // Agrega createdAt y updatedAt automáticamente
  collection: 'videos'
});

// Índices para mejorar el rendimiento de las consultas
videoSchema.index({ videoId: 1 }, { unique: true });
videoSchema.index({ title: 'text', description: 'text', creator: 'text' }); // Búsqueda de texto completo
videoSchema.index({ creator: 1 });
videoSchema.index({ status: 1 });
videoSchema.index({ uploadedAt: -1 });
videoSchema.index({ views: -1 });

// Middleware para actualizar la fecha de modificación
videoSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Método para obtener la URL del video
videoSchema.methods.getVideoUrl = async function() {
  const azureStorage = require('../config/azureStorage');
  try {
    const urlData = await azureStorage.getVideoUrl(this.blobName);
    this.videoUrl = urlData.url;
    await this.save();
    return urlData.url;
  } catch (error) {
    console.error('Error al obtener URL del video:', error);
    throw error;
  }
};

// Método para incrementar vistas
videoSchema.methods.incrementViews = async function() {
  this.views += 1;
  return await this.save();
};

// Método estático para buscar videos por texto
videoSchema.statics.searchByText = async function(searchText, options = {}) {
  const {
    page = 1,
    limit = 10,
    sortBy = 'uploadedAt',
    sortOrder = -1
  } = options;
  
  const skip = (page - 1) * limit;
  
  const query = {
    $and: [
      { status: 'active' },
      {
        $text: {
          $search: searchText
        }
      }
    ]
  };
  
  const videos = await this.find(query)
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit)
    .exec();
  
  const total = await this.countDocuments(query);
  
  return {
    videos,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

// Método estático para obtener videos populares
videoSchema.statics.getPopular = async function(limit = 10) {
  return await this.find({ status: 'active' })
    .sort({ views: -1 })
    .limit(limit)
    .exec();
};

// Método estático para obtener videos recientes
videoSchema.statics.getRecent = async function(limit = 10) {
  return await this.find({ status: 'active' })
    .sort({ uploadedAt: -1 })
    .limit(limit)
    .exec();
};

// Método estático para obtener videos por creador
videoSchema.statics.getByCreator = async function(creator, options = {}) {
  const {
    page = 1,
    limit = 10,
    sortBy = 'uploadedAt',
    sortOrder = -1
  } = options;
  
  const skip = (page - 1) * limit;
  
  const query = {
    creator: creator,
    status: 'active'
  };
  
  const videos = await this.find(query)
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit)
    .exec();
  
  const total = await this.countDocuments(query);
  
  return {
    videos,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

// Transformación personalizada para JSON
videoSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Video', videoSchema);
