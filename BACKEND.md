# Backend Mini YouTube - Versión Next.js API Routes

## 🎯 ¿Qué es este Backend?

Backend integrado en Next.js usando API Routes. En lugar de un servidor separado, el backend vive dentro de la misma aplicación Next.js.

## 📁 Estructura de Archivos

```
src/app/api/
├── videos/
│   └── route.js        # Endpoint principal: GET /api/videos
└── health/
    └── route.js        # Endpoint de salud: GET /api/health
```

## 🚀 Endpoints Disponibles

### GET /api/videos
Retorna todos los videos con sus URLs de Azure Blob Storage.

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "videoId": "video1",
      "title": "Mi video",
      "description": "Descripción del video",
      "creator": "Juan Pérez",
      "views": 150,
      "uploadedAt": "2024-01-15T10:30:00.000Z",
      "videoUrl": "https://account.blob.core.windows.net/videos/video1.mp4"
    }
  ]
}
```

### GET /api/health
Verifica que el backend esté funcionando correctamente.

**Respuesta:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "message": "Backend funcionando correctamente"
}
```

## ⚙️ Configuración

1. **Copiar archivo de variables de entorno:**
```bash
cp .env.local.example .env.local
```

2. **Configurar las variables en `.env.local`:**
```env
# MongoDB Atlas
MONGODB_CONNECTION_STRING=mongodb+srv://username:password@cluster.mongodb.net/miniyoutube

# Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=youraccount;AccountKey=yourkey;EndpointSuffix=core.windows.net
AZURE_STORAGE_CONTAINER_NAME=videos
```

## 🏃‍♂️ Ejecución

No necesitas iniciar un servidor separado. El backend se activa automáticamente cuando inicias Next.js:

```bash
npm run dev
```

Los endpoints estarán disponibles en:
- `http://localhost:3000/api/videos`
- `http://localhost:3000/api/health`

## 🔄 Flujo de Funcionamiento

### Cuando visitas GET /api/videos:

1. **Next.js recibe la petición** y la dirige a `src/app/api/videos/route.js`
2. **Conexión a MongoDB** - Se conecta a la base de datos
3. **Búsqueda de videos** - Busca todos los documentos en la colección `videos`
4. **Generación de URLs** - Para cada video, pide su URL a Azure Blob Storage
5. **Respuesta JSON** - Devuelve todos los videos con sus URLs al frontend

## 📊 Modelo de Datos

Cada video en MongoDB tiene esta estructura:

```javascript
{
  videoId: "video123",        // ID único
  title: "Título del video",   // Título visible
  description: "Descripción...", // Descripción opcional
  creator: "Nombre del creador", // Quién lo subió
  blobName: "video123.mp4",   // Nombre del archivo en Azure
  views: 100,                 // Contador de vistas
  uploadedAt: "2024-01-15"   // Fecha de subida
}
```

## 🎯 Ventajas de esta Estructura

### ✅ **Integrado con Next.js**
- No necesitas servidor separado
- Mismo proyecto para frontend y backend
- Despliegue más simple

### ✅ **API Routes de Next.js**
- Manejo automático de peticiones
- Optimizado para rendimiento
- Soporte nativo para JSON

### ✅ **Simplificado**
- Todo en un solo archivo por endpoint
- Fácil de entender y mantener
- Sin configuración extra

## 🛠️ ¿Cómo Agregar un Nuevo Video?

1. **Sube el video a Azure Blob Storage** (manualmente o via Azure Portal)
2. **Guarda los metadatos en MongoDB**:
```javascript
// Puedes usar MongoDB Compass o crear un endpoint POST
{
  "videoId": "mi-video-unico",
  "title": "Título del video",
  "description": "Descripción",
  "creator": "Tu nombre",
  "blobName": "nombre-del-archivo.mp4"
}
```

3. **El video aparecerá automáticamente** en GET /api/videos

## 🚨 Problemas Comunes

### "No puedo conectar a MongoDB"
- Verifica tu `MONGODB_CONNECTION_STRING` en `.env.local`
- Asegúrate que tu IP esté en la lista blanca de MongoDB Atlas

### "No puedo acceder a Azure"
- Verifica tu `AZURE_STORAGE_CONNECTION_STRING` en `.env.local`
- Asegúrate que el contenedor exista en Azure

### "El endpoint no responde"
- Verifica que el archivo `route.js` esté en la carpeta correcta
- Reinicia el servidor de desarrollo

## 🎓 Conceptos Clave

- **API Routes**: Sistema de Next.js para crear endpoints API
- **Route Handler**: Función que maneja peticiones HTTP (GET, POST, etc.)
- **NextResponse**: Utilidad de Next.js para crear respuestas HTTP
- **Server Components**: Componentes que se ejecutan en el servidor

¡Ahora tienes un backend completamente integrado con Next.js! 🚀
