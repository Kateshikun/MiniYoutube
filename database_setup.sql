-- Script para crear la base de datos y tabla de videos en SQL Server de Azure
-- Ejecutar este script en tu servidor SQL Server para crear la estructura necesaria

-- Crear la base de datos si no existe
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'miniyoutube')
BEGIN
    CREATE DATABASE miniyoutube;
END
GO

-- Usar la base de datos miniyoutube
USE miniyoutube;
GO

-- Crear la tabla de videos
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'videos')
BEGIN
    CREATE TABLE videos (
        video_id NVARCHAR(255) PRIMARY KEY,
        title NVARCHAR(500) NOT NULL,
        description NVARCHAR(MAX) NULL,
        creator NVARCHAR(255) NOT NULL,
        blob_name NVARCHAR(255) NOT NULL,
        views INT DEFAULT 0,
        uploaded_at DATETIME2 DEFAULT GETDATE()
    );
END
GO

-- Crear índices para mejor rendimiento
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_videos_uploaded_at')
BEGIN
    CREATE INDEX IX_videos_uploaded_at ON videos(uploaded_at DESC);
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_videos_creator')
BEGIN
    CREATE INDEX IX_videos_creator ON videos(creator);
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_videos_views')
BEGIN
    CREATE INDEX IX_videos_views ON videos(views DESC);
END
GO

-- Insertar algunos videos de ejemplo (opcional)
-- Nota: En SQL Server usamos NVARCHAR para soportar caracteres especiales
INSERT INTO videos (video_id, title, description, creator, blob_name, views) VALUES
('video001', N'Mi primer video', N'Este es el contenido de mi primer video', N'Juan Pérez', 'video001.mp4', 150),
('video002', N'Tutorial de Next.js', N'Aprende a crear APIs con Next.js', N'María García', 'video002.mp4', 320),
('video003', N'Viaje a la montaña', N'Un video de mi reciente viaje a las montañas', N'Carlos López', 'video003.mp4', 89)
WHERE NOT EXISTS (SELECT 1 FROM videos WHERE video_id IN ('video001', 'video002', 'video003'));
GO

-- Mostrar la estructura de la tabla
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'videos'
ORDER BY ORDINAL_POSITION;
GO

-- Mostrar los datos insertados
SELECT * FROM videos ORDER BY uploaded_at DESC;
GO
