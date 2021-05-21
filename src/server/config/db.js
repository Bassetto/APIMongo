import config from './config';
const mongoose = require('mongoose');

class DataBase{
  DB_CONNECTION;

  createConnection() {
    const {dbHost, dbPort, dbName} = config.mongodbConfig;
    mongoose.connect(`mongodb://${dbHost}:${dbPort}/${dbName}`);
    this.logger(dbName);
  };

  logger(name) {
    this.DB_CONNECTION = mongoose.connection;
    this.DB_CONNECTION.on('connected', () => {
      console.log(`Mongoose está conectado ao ${name}`);
    });
    
    this.DB_CONNECTION.on('error', () => {
      console.error(`Erro ao conectar ao ${name}`);
    });

    this.DB_CONNECTION.on('disconnected', () => {
      console.log(`Mongoose foi desconectado ao ${name}`);
    });
  };

  closeConnection(message, callback) {
    this.DB_CONNECTION.close(() => {
      console.log(`Mongoose foi desconectado pelo ${message}`);
      callback();
    });
  };
}

export default DataBase;