# Mini YouTube Backend

Backend API para la aplicación Mini YouTube que gestiona videos almacenados en Azure Blob Storage y metadatos en MongoDB Atlas.

## 🚀 Características

- **Almacenamiento de videos**: URLs seguras desde Azure Blob Storage
- **Metadatos**: Información de videos en MongoDB Atlas
- **Búsqueda**: Búsqueda de texto completo en títulos, descripciones y creadores
- **Paginación**: Soporte completo para paginación de resultados
- **Estadísticas**: Contador de vistas y videos populares
- **API RESTful**: Endpoints bien estructurados y documentados

## 📋 Requisitos

- Node.js 18+
- MongoDB Atlas
- Azure Blob Storage Account

## 🛠️ Configuración

1. **Clonar el repositorio e instalar dependencias:**
```bash
cd backend
npm install
```

2. **Configurar variables de entorno:**
```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:

```env
# Configuración del servidor
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Configuración de MongoDB Atlas
MONGODB_CONNECTION_STRING=mongodb+srv://username:password@cluster.mongodb.net/miniyoutube?retryWrites=true&w=majority

# Configuración de Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=yourstorageaccount;AccountKey=youraccountkey;EndpointSuffix=core.windows.net
AZURE_STORAGE_CONTAINER_NAME=videos
```

## 🗂️ Estructura del Proyecto

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js      # Configuración de MongoDB
│   │   └── azureStorage.js  # Configuración de Azure Blob Storage
│   ├── controllers/
│   │   └── videoController.js # Lógica de negocio de videos
│   ├── models/
│   │   └── Video.js         # Esquema de Mongoose para videos
│   ├── routes/
│   │   └── videoRoutes.js   # Rutas de la API
│   └── server.js            # Servidor Express principal
├── .env.example             # Plantilla de variables de entorno
├── package.json
└── README.md
```

## 🚀 Ejecución

**Modo desarrollo:**
```bash
npm run dev
```

**Modo producción:**
```bash
npm start
```

El servidor se iniciará en `http://localhost:3001`

## 📚 Endpoints de la API

### Videos Públicos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/videos` | Obtener todos los videos |
| GET | `/api/videos/popular` | Videos populares |
| GET | `/api/videos/recent` | Videos recientes |
| GET | `/api/videos/search` | Buscar videos |
| GET | `/api/videos/creator/:creator` | Videos por creador |
| GET | `/api/videos/:videoId` | Video específico |
| GET | `/api/videos/:videoId/url` | URL de video |

### Administración

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/videos` | Crear video |
| PUT | `/api/videos/:videoId` | Actualizar video |
| DELETE | `/api/videos/:videoId` | Eliminar video |

### Sistema

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/health` | Estado del servidor |
| GET | `/` | Información de la API |

## 📝 Parámetros de Consulta

### Paginación
- `page`: Número de página (default: 1)
- `limit`: Resultados por página (default: 10)
- `sortBy`: Campo de ordenamiento (default: uploadedAt)
- `sortOrder`: Orden (1: ascendente, -1: descendente)

### Búsqueda
- `q`: Texto de búsqueda

## 💾 Modelo de Datos

```javascript
{
  videoId: String,        // ID único
  title: String,         // Título
  description: String,   // Descripción
  creator: String,        // Creador
  blobName: String,      // Nombre en Azure
  duration: Number,       // Duración (segundos)
  fileSize: Number,       // Tamaño (bytes)
  contentType: String,    // MIME type
  tags: [String],         // Etiquetas
  views: Number,          // Vistas
  status: String,         // Estado
  uploadedAt: Date,       // Fecha de subida
  updatedAt: Date        // Fecha de actualización
}
```

## 🔧 Azure Blob Storage

El backend genera URLs temporales para los videos almacenados en Azure Blob Storage. Los videos se organizan en contenedores y se acceden mediante URLs seguras con tokens SAS.

## 🗃️ MongoDB Atlas

Los metadatos de los videos se almacenan en MongoDB Atlas con índices optimizados para búsquedas de texto completo y ordenamiento.

## 🛡️ Seguridad

- CORS configurado para el frontend
- Validación de datos de entrada
- Manejo seguro de errores
- Variables de entorno para credenciales

## 🚀 Despliegue

Para despliegue en producción:

1. Configurar variables de entorno de producción
2. Asegurar que MongoDB Atlas y Azure Storage sean accesibles
3. Configurar el firewall para permitir conexiones
4. Usar HTTPS en producción

## 📊 Monitoreo

- Endpoint `/health` para verificar estado
- Logging de solicitudes y errores
- Métricas de conexión a base de datos

## 🤝 Contribución

1. Fork del proyecto
2. Branch de características
3. Pull Request

## 📄 Licencia

MIT License
