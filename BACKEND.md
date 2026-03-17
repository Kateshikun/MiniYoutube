# Backend Mini YouTube - Versión Next.js API Routes con SQL Server + Azure Blob Storage

## ¿Qué es este Backend?

Backend integrado en Next.js usando API Routes con SQL Server de Azure para metadatos y Azure Blob Storage para almacenamiento de videos. Arquitectura completamente en la nube de Microsoft.

## Estructura de Archivos

```
src/app/api/
├── videos/
│   └── route.js        # Endpoint principal: GET /api/videos
└── health/
    └── route.js        # Endpoint de salud: GET /api/health
```

## Endpoints Disponibles

### GET /api/videos
Retorna todos los videos con sus URLs desde Azure Blob Storage.

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "videoId": "video001",
      "title": "Mi primer video",
      "description": "Este es el contenido de mi primer video",
      "creator": "Juan Pérez",
      "views": 150,
      "uploadedAt": "2024-01-15T10:30:00.000Z",
      "videoUrl": "https://account.blob.core.windows.net/videos/video001.mp4"
    }
  ],
  "count": 1
}
```

### GET /api/health
Verifica que el backend y SQL Server estén funcionando correctamente.

**Respuesta:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "message": "Backend y SQL Server funcionando correctamente",
  "database": "SQL Server de Azure conectado"
}
```

## Configuración

### 1. **Configurar SQL Server de Azure**
1. Crea un servidor SQL Server en Azure
2. Crea una base de datos llamada `miniyoutube`
3. Habilita el acceso desde tu IP
4. Obtén las credenciales

### 2. **Configurar Azure Blob Storage**
1. Crea una cuenta de Azure Storage
2. Crea un contenedor llamado `videos`
3. Obtén tu connection string

### 3. **Configurar variables de entorno**
```bash
cp .env.local.example .env.local
```

Edita el archivo `.env.local`:
```env
# SQL Server de Azure - Base de datos para metadatos de videos
AZURE_SQL_SERVER=your-server.database.windows.net
AZURE_SQL_USER=azureuser
AZURE_SQL_PASSWORD=your_password
AZURE_SQL_DATABASE=miniyoutube

# Azure Blob Storage - Almacenamiento de archivos de video
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=youraccount;AccountKey=yourkey;EndpointSuffix=core.windows.net
AZURE_STORAGE_CONTAINER_NAME=videos
```

### 4. **Ejecutar script SQL**
Ejecuta el script `database_setup.sql` en tu servidor SQL Server:

```bash
# Usando SQL Server Management Studio
# O usando Azure Data Studio
# O desde la línea de comandos con sqlcmd
sqlcmd -S your-server.database.windows.net -U azureuser -P your_password -d master -i database_setup.sql
```

## Ejecución

No necesitas servidor separado. El backend se activa con Next.js:

```bash
npm run dev
```

Los endpoints estarán disponibles en:
- `http://localhost:3000/api/videos`
- `http://localhost:3000/api/health`

## Flujo de Funcionamiento

### Cuando visitas GET /api/videos:

1. **Next.js recibe la petición** y la dirige a `src/app/api/videos/route.js`
2. **Conexión a SQL Server** - Se conecta a la base de datos en Azure
3. **Búsqueda de videos** - Ejecuta `SELECT video_id, title, description, creator, blob_name, views, uploaded_at FROM videos ORDER BY uploaded_at DESC`
4. **Generación de URLs** - Para cada video, pide su URL a Azure Blob Storage
5. **Respuesta JSON** - Devuelve todos los videos con sus URLs al frontend

## Modelo de Datos (SQL Server)

### Tabla `videos`:

```sql
CREATE TABLE videos (
    video_id NVARCHAR(255) PRIMARY KEY,    -- ID único del video
    title NVARCHAR(500) NOT NULL,           -- Título del video
    description NVARCHAR(MAX) NULL,           -- Descripción (opcional)
    creator NVARCHAR(255) NOT NULL,          -- Nombre del creador
    blob_name NVARCHAR(255) NOT NULL,       -- Nombre del archivo en Azure
    views INT DEFAULT 0,                     -- Contador de vistas
    uploaded_at DATETIME2 DEFAULT GETDATE()  -- Fecha de subida
);
```

### Índices para rendimiento:
```sql
CREATE INDEX IX_videos_uploaded_at ON videos(uploaded_at DESC);
CREATE INDEX IX_videos_creator ON videos(creator);
CREATE INDEX IX_videos_views ON videos(views DESC);
```

### Datos de ejemplo:
```sql
INSERT INTO videos (video_id, title, description, creator, blob_name, views) VALUES
('video001', N'Mi primer video', N'Descripción del video', N'Juan Pérez', 'video001.mp4', 150);
```

## Ventajas de SQL Server + Azure Blob Storage

### **Base de datos empresarial**
- Alto rendimiento y escalabilidad
- Soporte nativo para Unicode (NVARCHAR)
- Integración perfecta con Azure

### **Almacenamiento en la nube**
- Escalabilidad ilimitada
- Acceso global rápido con CDN
- Sin preocupación por espacio en disco

### **Integrado con Next.js**
- No necesitas servidor separado
- Mismo proyecto para frontend y backend
- Despliegue más simple

### **Arquitectura Microsoft completa**
- Todo en el ecosistema Azure
- Gestión centralizada
- Seguridad integrada

## ¿Cómo Agregar un Nuevo Video?

### Método 1: SQL Directo
```sql
INSERT INTO videos (video_id, title, description, creator, blob_name) 
VALUES ('video004', N'Mi nuevo video', N'Descripción', N'Mi Nombre', 'video004.mp4');
```

### Método 2: Subir archivo
1. **Sube el video a Azure Blob Storage** (via Azure Portal o SDK)
2. **Inserta el registro** en SQL Server con el nombre del archivo
3. **El video aparecerá automáticamente** en GET /api/videos

## Problemas Comunes

### "No puedo conectar a SQL Server"
- Verifica tu firewall de Azure SQL Server
- Verifica tus credenciales en `.env.local`
- Asegúrate que la base de datos `miniyoutube` exista

### "No puedo acceder a Azure Blob Storage"
- Verifica tu `AZURE_STORAGE_CONNECTION_STRING` en `.env.local`
- Asegúrate que el contenedor exista en Azure
- Verifica los permisos del contenedor

### "La tabla videos no existe"
- Ejecuta el script: `sqlcmd -S server -U user -P pass -d master -i database_setup.sql`
- Verifica que la tabla se creó: `SELECT name FROM sys.tables WHERE name = 'videos'`

### "El endpoint no responde"
- Verifica que el archivo `route.js` esté en la carpeta correcta
- Reinicia el servidor de desarrollo: `npm run dev`

## Conceptos Clave

- **SQL Server**: Sistema de base de datos relacional de Microsoft
- **Azure Blob Storage**: Servicio de almacenamiento en la nube de Microsoft
- **API Routes**: Sistema de Next.js para crear endpoints
- **Connection Pool**: Gestión de conexiones a SQL Server
- **NVARCHAR**: Tipo de dato Unicode en SQL Server

## Arquitectura Azure Completa

```
Frontend (Next.js) 
    ↓ pide videos
Backend (Next.js API)
    ↓ busca metadatos
SQL Server (Azure)
    ↓ devuelve info básica
Backend (Next.js API)
    ↓ pide URLs
Azure Blob Storage
    ↓ devuelve URLs
Backend (Next.js API)
    ↓ junta todo
Frontend (Next.js)
    ↓ muestra videos con URLs directas
```

## Comparación con MySQL

| Característica | MySQL | SQL Server Azure |
|---------------|---------|-----------------|
| Unicode | utf8mb4 | NVARCHAR (nativo) |
| Fecha | TIMESTAMP | DATETIME2 |
| Conexión | mysql2 | mssql |
| Escalabilidad | Limitada | Ilimitada |
| Costo | Variable | Por uso |
| Integración | Manual | Nativa con Azure |

¡Ahora tienes un backend con SQL Server + Azure Blob Storage completamente en la nube de Microsoft! 
