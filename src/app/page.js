'use client';

import { useState, useEffect } from 'react';
import styles from "./page.module.css";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/videos');
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setVideos(data.data || []);
      } else {
        throw new Error(data.message || 'Error al cargar videos');
      }
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatViews = (views) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'hace 1 día';
    if (diffDays < 30) return `hace ${diffDays} días`;
    if (diffDays < 365) return `hace ${Math.floor(diffDays / 30)} meses`;
    return `hace ${Math.floor(diffDays / 365)} años`;
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Cargando videos...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.error}>
            <h2>❌ Error al cargar videos</h2>
            <p>{error}</p>
            <button onClick={fetchVideos} className={styles.retryButton}>
              Reintentar
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <h1>🎬 Mini YouTube</h1>
          </div>
          <div className={styles.searchBar}>
            <input 
              type="text" 
              placeholder="Buscar videos..." 
              className={styles.searchInput}
            />
            <button className={styles.searchButton}>🔍</button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.videosGrid}>
            {videos.length === 0 ? (
              <div className={styles.noVideos}>
                <h2>📹 No hay videos disponibles</h2>
                <p>No se encontraron videos en la base de datos.</p>
              </div>
            ) : (
              videos.map((video) => (
                <div key={video.videoId} className={styles.videoCard}>
                  <div className={styles.videoThumbnail}>
                    <video
                      className={styles.videoPlayer}
                      controls
                      poster="/hola.jpeg"
                    >
                      <source src={video.videoUrl} type="video/mp4" />
                      Tu navegador no soporta videos.
                    </video>
                    <div className={styles.videoDuration}>6 Aegund</div>
                  </div>
                  
                  <div className={styles.videoInfo}>
                    <h3 className={styles.videoTitle}>
                      {video.title}
                    </h3>
                    
                    <p className={styles.videoDescription}>
                      {video.description || 'Sin descripción'}
                    </p>
                    
                    <div className={styles.videoMeta}>
                      <span className={styles.videoViews}>
                        👁 {formatViews(video.views)} vistas
                      </span>
                      <span className={styles.videoDate}>
                        📅 {formatDate(video.uploadedAt)}
                      </span>
                    </div>
                    
                    <div className={styles.videoActions}>
                      <button className={styles.actionButton}>
                        ❤️ Me gusta
                      </button>
                      <button className={styles.actionButton}>
                        💬 Comentar
                      </button>
                      <button className={styles.actionButton}>
                        📤 Compartir
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>© 2024 Mini YouTube - Backend con SQL Server + Azure Blob Storage</p>
      </footer>
    </div>
  );
}
