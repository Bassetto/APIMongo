// buscando as dependencias 
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// buscando os parses do projeto
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// permitindo comunicação fora de nossa camada 'amigavel'
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})
// requisição para o banco e configurações 
const config = require('./config.js');
const mongoose = require('mongoose');
// importando rotas 
require ('./rotas.js')(app);  // Adicionar arquivo de rota aqui

mongoose.Promise = global.Promise;
// conexão com o banco
mongoose.connect(config.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Sucesso!!!!!!!!!!")
}).catch(err => {
    console.log('Erro, verifique a conexão no cloud');
    process.exit;
})
// view engine do EJS
app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/views'));
app.set('View engine', 'ejs');
app.set('views', './views');

// rota padrão da aplicação
// renderizando a index com framework EJS SIMILAR ao Jade JS
app.get('/', (req, res) => {
  res.render('index.ejs');
});
app.get('/registrar.ejs', (req, res) => {
    res.render('./pages/registrar.ejs');
});
// requisição que pega os dados do usuário
app.post('/login', (req, res) => {
   var nomeUsuario = req.body.username;
   var senha = req.body.password;
   
})
// listando o node na porta 3000
app.listen(config.porta, () => {
    console.log('Server rodando na porta 3000');
});

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;



