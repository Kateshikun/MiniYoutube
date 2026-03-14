const mongoose = require('mongoose');

class DatabaseService {
  constructor() {
    this.connectionString = process.env.MONGODB_CONNECTION_STRING;
    if (!this.connectionString) {
      throw new Error('MONGODB_CONNECTION_STRING no está configurado');
    }
  }

  async connect() {
    try {
      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10, // Máximo 10 conexiones en el pool
        serverSelectionTimeoutMS: 5000, // Timeout de 5 segundos
        socketTimeoutMS: 45000, // Timeout de 45 segundos
        bufferCommands: false, // Deshabilitar buffer de mongoose
        bufferMaxEntries: 0 // Deshabilitar buffer de mongoose
      };

      await mongoose.connect(this.connectionString, options);
      console.log('✅ Conectado a MongoDB Atlas');
      
      // Manejar eventos de conexión
      mongoose.connection.on('error', (error) => {
        console.error('❌ Error en la conexión a MongoDB:', error);
      });

      mongoose.connection.on('disconnected', () => {
        console.log('⚠️ Desconectado de MongoDB');
      });

      mongoose.connection.on('reconnected', () => {
        console.log('🔄 Reconectado a MongoDB');
      });

      return mongoose.connection;
    } catch (error) {
      console.error('❌ Error al conectar a MongoDB:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      await mongoose.disconnect();
      console.log('✅ Desconectado de MongoDB');
    } catch (error) {
      console.error('❌ Error al desconectar de MongoDB:', error);
      throw error;
    }
  }

  getConnection() {
    return mongoose.connection;
  }

  isConnected() {
    return mongoose.connection.readyState === 1;
  }
}

module.exports = new DatabaseService();
