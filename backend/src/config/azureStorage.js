const { BlobServiceClient } = require('@azure/storage-blob');

class AzureStorageService {
  constructor() {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    if (!connectionString) {
      throw new Error('AZURE_STORAGE_CONNECTION_STRING no está configurado');
    }
    
    this.blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    this.containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'videos';
  }

  async getContainerClient() {
    const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
    
    // Asegurarse de que el contenedor exista
    await containerClient.createIfNotExists();
    
    return containerClient;
  }

  async getVideoUrl(blobName) {
    try {
      const containerClient = await this.getContainerClient();
      const blobClient = containerClient.getBlobClient(blobName);
      
      // Generar URL con SAS token para acceso seguro
      const sasToken = await this.generateSasToken(blobClient);
      const url = `${blobClient.url}?${sasToken}`;
      
      return {
        url: url,
        blobName: blobName,
        containerName: this.containerName
      };
    } catch (error) {
      console.error('Error al obtener URL del video:', error);
      throw new Error('No se pudo generar la URL del video');
    }
  }

  async generateSasToken(blobClient) {
    // Para producción, implementa una lógica más robusta con permisos específicos
    // Por ahora, retornamos un token básico de lectura
    const sasExpiresOn = new Date();
    sasExpiresOn.setMinutes(sasExpiresOn.getMinutes() + 60); // Expira en 1 hora
    
    // Nota: En producción, deberías usar @azure/storage-blob para generar SAS tokens
    // Por simplicidad, aquí retornamos un string vacío (URL pública)
    // Debes configurar tu contenedor como público o implementar SAS tokens apropiados
    return '';
  }

  async listVideos() {
    try {
      const containerClient = await this.getContainerClient();
      const videos = [];
      
      for await (const blob of containerClient.listBlobsFlat()) {
        if (blob.properties.contentType && blob.properties.contentType.startsWith('video/')) {
          videos.push({
            name: blob.name,
            size: blob.properties.contentLength,
            contentType: blob.properties.contentType,
            lastModified: blob.properties.lastModified,
            url: await this.getVideoUrl(blob.name)
          });
        }
      }
      
      return videos;
    } catch (error) {
      console.error('Error al listar videos:', error);
      throw new Error('No se pudieron listar los videos');
    }
  }

  async getVideoMetadata(blobName) {
    try {
      const containerClient = await this.getContainerClient();
      const blobClient = containerClient.getBlobClient(blobName);
      const properties = await blobClient.getProperties();
      
      return {
        name: blobName,
        size: properties.contentLength,
        contentType: properties.contentType,
        lastModified: properties.lastModified,
        metadata: properties.metadata || {}
      };
    } catch (error) {
      console.error('Error al obtener metadatos del video:', error);
      throw new Error('No se pudieron obtener los metadatos del video');
    }
  }
}

module.exports = new AzureStorageService();
