module.exports = (app) => {
    const produtos = require('./controlandoProdutos.js');
    var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;


    // criando produto
   app.post('/produtos', produtos.criar);

   app.get('/produtos', produtos.buscar);

   app.get('/produtos/:produtoId', produtos.buscarId);

   app.put('/produtos/:produtoId', produtos.atualizacao);

   app.delete('/produtos/:produtoId', produtos.deletar);


   
   const usuarios = require('./controlandoUsuarios.js');

   //criando users
   app.post('/usuarios', usuarios.criar);
    
   app.get('/usuarios', usuarios.buscar);

   app.get('/usuarios/:username', usuarios.buscarUser);

   app.put('/usuarios/:username', usuarios.atualizacao);

   app.delete('/usuarios/:username', usuarios.deletar); 


   //autenticação passport
   app.post('/', passport.authenticate('local', { successRedirect: '/login', failureRedirect: '/', failureFlash: true }));
}


