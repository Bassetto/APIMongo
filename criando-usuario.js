const mongoose = require('mongoose');

const usuariosbase = mongoose.Schema({
    username: String,
    password: String,
    email: String
},);

module.exports = mongoose.model('Usuarios', usuariosbase);

