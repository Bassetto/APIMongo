// buscando as dependencias 
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;

import UserRoutes from './routes/UserRoutes';
import ProductRoutes from './routes/ProductRoutes';
import DataBase from './config/db';

class App {
  app;
  bodyParser;
  database;

  constructor() {
    this.app = express();
    this.middleware();
    this.routes();
    this.database = new DataBase();
    this.dataBaseConnection();
  };

  dataBaseConnection() {
    this.database.createConnection();
  };

  closeDataBaseConnection(message, callback) {
    this.database.closeConnection(message, () => callback());
  };

  middleware() {
    this.app.use(cors());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    this.app.use(express.static(__dirname + '/public'))
    this.app.use(express.static(__dirname + '/views'));
    this.app.set('View engine', 'ejs');
    this.app.set('views', './views');
  };

  routes() {
    this.app.get('/', (req, res) => {
      res.render('index.ejs');
    });
    this.app.get('/registrar.ejs', (req, res) => {
        res.render('./pages/registrar.ejs');
    });
    
    this.app.use('/user', UserRoutes);
    this.app.use('/product', ProductRoutes);
  };
};

export default new App();