const mongoose = require('mongoose');

const produtosbase = mongoose.Schema({
    nome: String,
    descricao: String,
    preco: Number,
    distribuidora: String,
    quantidade : Number,
    status: Boolean
},);

module.exports = mongoose.model('Produtos', produtosbase);

