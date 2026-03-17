# 🎬 Mini YouTube - Manual de Uso

## 📋 Tabla de Contenido

1. [¿Qué es Mini YouTube?](#qué-es-mini-youtube)
2. [Tecnologías Utilizadas](#tecnologías-utilizadas)
3. [Arquitectura del Sistema](#arquitectura-del-sistema)
4. [Requisitos Previos](#requisitos-previos)
5. [Instalación y Configuración](#instalación-y-configuración)
6. [Uso de la Aplicación](#uso-de-la-aplicación)
7. [Gestión de Videos](#gestión-de-videos)
8. [Solución de Problemas](#solución-de-problemas)
9. [Referencia Rápida](#referencia-rápida)

---

## 🎯 ¿Qué es Mini YouTube?

Mini YouTube es una aplicación web simplificada que replica la funcionalidad básica de YouTube para almacenar y reproducir videos. Utiliza tecnologías modernas de Microsoft Azure para proporcionar una solución escalable y robusta.

### **Características Principales:**
- 📹 Visualización de videos en streaming
- 🔍 Búsqueda de videos
- 📊 Metadatos de videos (título, descripción, vistas)
- ❤️ Sistema de interacción básico
- 📱 Diseño responsivo
- 🌐 Despliegue en la nube

---

## 🛠️ Tecnologías Utilizadas

### **Frontend**
- **Next.js 14**: Framework de React para aplicaciones web modernas
- **React 18**: Librería de JavaScript para interfaces de usuario
- **CSS Modules**: Estilos CSS con alcance local
- **JavaScript ES6+**: JavaScript moderno con async/await

### **Backend**
- **Next.js API Routes**: Sistema de endpoints integrado
- **Node.js**: Runtime de JavaScript del lado del servidor

### **Base de Datos**
- **SQL Server de Azure**: Base de datos relacional en la nube
- **mssql (Node.js)**: Driver de SQL Server para Node.js
- **T-SQL**: Lenguaje de consulta de SQL Server

### **Almacenamiento**
- **Azure Blob Storage**: Almacenamiento de objetos en la nube
- **@azure/storage-blob**: SDK de Azure para Node.js

### **Infraestructura**
- **Microsoft Azure**: Plataforma cloud completa
- **Azure SQL Database**: Base de datos como servicio
- **Azure Storage Account**: Cuenta de almacenamiento

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend     │    │    Backend      │    │   Base de      │
│   (Next.js)    │◄──►│   (API Routes)  │◄──►│   Datos        │
│                │    │                │    │ (SQL Server)   │
│ • React UI     │    │ • GET /api/videos│    │                │
│ • CSS Modules  │    │ • GET /api/health│    │ • Tabla videos  │
│ • Client-side   │    │ • Error handling│    │ • Índices      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       ▼                       │
         │              ┌─────────────────┐              │
         │              │  Almacenamiento│              │
         └──────────────►│   (Azure Blob) │◄─────────────┘
                        │                │
                        │ • Videos .mp4  │
                        │ • URLs directas │
                        │ • CDN global   │
                        └─────────────────┘
```

### **Flujo de Datos:**

1. **Usuario visita la web** → Frontend carga
2. **Frontend solicita videos** → GET /api/videos
3. **Backend consulta SQL Server** → SELECT * FROM videos
4. **Backend genera URLs** → Azure Blob Storage URLs
5. **Frontend recibe datos** → Renderiza videos
6. **Usuario reproduce video** → Streaming directo desde Azure

---

## 📋 Requisitos Previos

### **Software Necesario:**
- **Node.js 18+**: Runtime de JavaScript
- **npm o yarn**: Gestor de paquetes
- **Navegador moderno**: Chrome, Firefox, Safari, Edge

### **Cuentas de Azure:**
- **Azure Subscription**: Suscripción activa de Azure
- **Azure SQL Server**: Servidor de base de datos
- **Azure Storage Account**: Cuenta de almacenamiento

### **Conocimientos Básicos:**
- JavaScript/React: Nivel intermedio
- SQL: Conocimientos básicos de T-SQL
- Azure: Familiaridad con el portal de Azure

---

## 🚀 Instalación y Configuración

### **1. Clonar el Proyecto**
```bash
git clone <repositorio>
cd miniyoutube
```

### **2. Instalar Dependencias**
```bash
npm install
```

### **3. Configurar Variables de Entorno**

Copia el archivo de ejemplo:
```bash
cp .env.local.example .env.local
```

Edita `.env.local` con tus credenciales:
```env
# 🗄️ SQL Server de Azure
AZURE_SQL_SERVER=tu-servidor.database.windows.net
AZURE_SQL_USER=tu-usuario
AZURE_SQL_PASSWORD=tu-contraseña
AZURE_SQL_DATABASE=miniyoutube

# 📦 Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=tu-cuenta;AccountKey=tu-key;EndpointSuffix=core.windows.net
AZURE_STORAGE_CONTAINER_NAME=videos
AZURE_STORAGE_ACCOUNT_NAME=tu-cuenta
```

### **4. Configurar Base de Datos**

Ejecuta el script SQL en tu servidor:
```bash
# Usando Azure Data Studio o SQL Server Management Studio
# Conéctate a tu servidor SQL Server
# Ejecuta el contenido de database_setup.sql
```

### **5. Iniciar la Aplicación**
```bash
npm run dev
```

Visita: `http://localhost:3000`

---

## 🎮 Uso de la Aplicación

### **Interfaz Principal**

#### **Header**
- **🎬 Logo Mini YouTube**: Identificador de la aplicación
- **🔍 Barra de búsqueda**: Buscar videos por título
- **📱 Navegación**: Menú responsivo

#### **Grid de Videos**
- **📹 Tarjetas de video**: Cada video mostrado como tarjeta
- **🎨 Thumbnails**: Imagen de preview del video
- **⏱️ Duración**: Tiempo del video
- **📊 Metadatos**: Título, descripción, vistas, fecha

#### **Controles de Video**
- **▶️ Reproducir**: Play/pause del video
- **🔊 Volumen**: Control de audio
- **⏸️ Pausa**: Pausar reproducción
- **📺 Pantalla completa**: Modo fullscreen

#### **Interacciones**
- **❤️ Me gusta**: Dar like al video
- **💬 Comentar**: Añadir comentarios
- **📤 Compartir**: Compartir video

### **Estados de la Aplicación**

#### **🔄 Loading**
```javascript
// Mientras carga los videos
<div className={styles.loading}>
  <div className={styles.spinner}></div>
  <p>Cargando videos...</p>
</div>
```

#### **❌ Error**
```javascript
// Si hay problemas de conexión
<div className={styles.error}>
  <h2>❌ Error al cargar videos</h2>
  <p>{error}</p>
  <button onClick={fetchVideos}>Reintentar</button>
</div>
```

#### **📹 Vacío**
```javascript
// Si no hay videos disponibles
<div className={styles.noVideos}>
  <h2>📹 No hay videos disponibles</h2>
  <p>No se encontraron videos en la base de datos.</p>
</div>
```

---

## 📺 Gestión de Videos

### **Agregar Nuevos Videos**

#### **Método 1: SQL Directo**
```sql
INSERT INTO videos (video_id, title, description, creator, blob_name, views) 
VALUES ('video004', N'Mi nuevo video', N'Descripción del video', N'Mi Nombre', 'video004.mp4', 0);
```

#### **Método 2: Subida Manual**
1. **Subir video a Azure Blob Storage**
   - Ve al Azure Portal
   - Navega a tu Storage Account
   - Abre el contenedor "videos"
   - Sube el archivo .mp4

2. **Registrar en base de datos**
   ```sql
   INSERT INTO videos (video_id, title, description, creator, blob_name) 
   VALUES ('video004', N'Título del video', N'Descripción', N'Creador', 'video004.mp4');
   ```

3. **Verificar en la aplicación**
   - Refresca la página web
   - El video debería aparecer automáticamente

### **Estructura de Datos**

#### **Tabla `videos`**
```sql
CREATE TABLE videos (
    video_id NVARCHAR(255) PRIMARY KEY,    -- ID único
    title NVARCHAR(500) NOT NULL,           -- Título
    description NVARCHAR(MAX) NULL,           -- Descripción
    creator NVARCHAR(255) NOT NULL,          -- Creador
    blob_name NVARCHAR(255) NOT NULL,       -- Nombre archivo
    views INT DEFAULT 0,                     -- Contador vistas
    uploaded_at DATETIME2 DEFAULT GETDATE()  -- Fecha subida
);
```

#### **Índices de Rendimiento**
```sql
CREATE INDEX IX_videos_uploaded_at ON videos(uploaded_at DESC);
CREATE INDEX IX_videos_creator ON videos(creator);
CREATE INDEX IX_videos_views ON videos(views DESC);
```

---

## 🔧 Solución de Problemas

### **Problemas Comunes**

#### **❌ "No puedo conectar a SQL Server"**
```
🔍 Causas:
- Firewall bloqueando conexión
- Credenciales incorrectas
- Base de datos no existe

✅ Soluciones:
1. Verifica firewall de Azure SQL Server
2. Revisa credenciales en .env.local
3. Confirma que la base de datos 'miniyoutube' exista
```

#### **❌ "No puedo acceder a Azure Blob Storage"**
```
🔍 Causas:
- Connection string incorrecta
- Contenedor no existe
- Permisos insuficientes

✅ Soluciones:
1. Verifica AZURE_STORAGE_CONNECTION_STRING
2. Crea el contenedor 'videos' en Azure Portal
3. Revisa permisos del contenedor
```

#### **❌ "Los videos no se reproducen"**
```
🔍 Causas:
- URLs incorrectas
- Videos no subidos a Azure
- Formato no compatible

✅ Soluciones:
1. Verifica que los videos estén en Azure Blob Storage
2. Confirma nombres de archivo en la base de datos
3. Usa formato .mp4 compatible
```

#### **❌ "La aplicación carga lento"**
```
🔍 Causas:
- Conexión lenta a Azure
- Videos muy grandes
- Sin CDN configurado

✅ Soluciones:
1. Optimiza tamaño de videos
2. Habilita CDN de Azure
3. Revisa latencia de red
```

### **Herramientas de Debugging**

#### **Verificar Backend**
```bash
# Health check
curl http://localhost:3000/api/health

# Videos endpoint
curl http://localhost:3000/api/videos
```

#### **Verificar Base de Datos**
```sql
-- Conexión prueba
SELECT 1 as test;

-- Verificar tabla
SELECT name FROM sys.tables WHERE name = 'videos';

-- Contar videos
SELECT COUNT(*) as total_videos FROM videos;
```

#### **Verificar Azure Storage**
```bash
# Con Azure CLI
az storage blob list --container-name videos --account-name tu-cuenta
```

---

## 📚 Referencia Rápida

### **Endpoints API**

#### **GET /api/videos**
```javascript
// Petición
fetch('/api/videos')
  .then(response => response.json())
  .then(data => {
    console.log(data.success); // true/false
    console.log(data.data);   // Array de videos
    console.log(data.count);  // Número de videos
  });
```

#### **GET /api/health**
```javascript
// Petición
fetch('/api/health')
  .then(response => response.json())
  .then(data => {
    console.log(data.status);   // "OK" o "ERROR"
    console.log(data.message);  // Mensaje de estado
  });
```

### **Estructura de Proyecto**

```
miniyoutube/
├── src/app/
│   ├── api/
│   │   ├── videos/
│   │   │   └── route.js          # Endpoint de videos
│   │   └── health/
│   │       └── route.js          # Health check
│   ├── page.js                  # Componente principal
│   └── page.module.css          # Estilos CSS
├── .env.local                  # Variables de entorno
├── .env.local.example           # Ejemplo de configuración
├── database_setup.sql           # Script de base de datos
├── BACKEND.md                 # Documentación backend
├── MANUAL_USO.md              # Este manual
└── package.json               # Dependencias del proyecto
```

### **Variables de Entorno**

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `AZURE_SQL_SERVER` | Servidor SQL Server | `server.database.windows.net` |
| `AZURE_SQL_USER` | Usuario de base de datos | `azureuser` |
| `AZURE_SQL_PASSWORD` | Contraseña de base de datos | `tu_password` |
| `AZURE_SQL_DATABASE` | Nombre de la base de datos | `miniyoutube` |
| `AZURE_STORAGE_CONNECTION_STRING` | Connection string Azure | `DefaultEndpointsProtocol=...` |
| `AZURE_STORAGE_CONTAINER_NAME` | Contenedor de videos | `videos` |
| `AZURE_STORAGE_ACCOUNT_NAME` | Nombre de cuenta Azure | `tuaccount` |

### **Comandos Útiles**

```bash
# Instalar dependencias
npm install

# Iniciar desarrollo
npm run dev

# Construir para producción
npm run build

# Iniciar producción
npm start

# Verificar instalación
npm list
```

---

## 🎓 Mejores Prácticas

### **Desarrollo**
- ✅ Usar variables de entorno para credenciales
- ✅ Manejar errores con try-catch
- ✅ Implementar loading states
- ✅ Optimizar imágenes y videos
- ✅ Testear en diferentes navegadores

### **Producción**
- ✅ Usar HTTPS en todas las conexiones
- ✅ Implementar logging de errores
- ✅ Monitorear rendimiento
- ✅ Hacer backup de la base de datos
- ✅ Usar CDN para contenido estático

### **Seguridad**
- ✅ Nunca exponer credenciales en el código
- ✅ Validar datos de entrada
- ✅ Implementar rate limiting
- ✅ Usar conexiones seguras a Azure
- ✅ Sanitizar datos del usuario

---

## 🆘 Soporte y Ayuda

### **Recursos Adicionales**
- 📖 [Documentación de Next.js](https://nextjs.org/docs)
- 🗄️ [Documentación de SQL Server](https://docs.microsoft.com/sql/)
- 📦 [Documentación de Azure Blob Storage](https://docs.microsoft.com/azure/storage/blobs/)
- 🎨 [Documentación de React](https://react.dev/)

### **Comunidad**
- 💬 Stack Overflow para preguntas técnicas
- 🐛 GitHub Issues para reportar bugs
- 📱 Discord para discusiones en vivo

---

## 📄 Licencia

Este proyecto es para fines educativos y demostrativos. 

**Autor**: Mini YouTube Team  
**Versión**: 1.0.0  
**Última actualización**: 2024

---

🎬 **¡Gracias por usar Mini YouTube!**

Si tienes alguna pregunta o necesitas ayuda, no dudes en consultar este manual o contactar al equipo de desarrollo.
