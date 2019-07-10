// apenas bloqueia o botao da senha ao carregar a pagina
//caso for usar esta função JQUERY comente o seu bloco de comandos
$(document).ready(function () {
    var esconderBotaoSenha = document.querySelector('#MostrarSenha').style.display = "none";
})
// mostrar a senha, esta função tem como encargo as animações e a lógica para a senha ser exibida ao usuario como forma de texto
function exibir () {
    var mostrarBotaoSenha = document.querySelector('#OcultarSenha').style.display = "none";
    esconderBotaoSenha = document.querySelector('#MostrarSenha').style.display = "block";
    document.querySelector('#senha').setAttribute("type", "text");
}
function ocultar () {
    esconderBotaoSenha = document.querySelector('#MostrarSenha').style.display = "none";
    mostrarBotaoSenha = document.querySelector('#OcultarSenha').style.display = "block";
    document.querySelector('#senha').setAttribute("type", "password");
}
function autenticar () {
    let senha_one = document.getElementById('senha').value;
    let senha_two = document.getElementById('senha-um').value;
    // validação se senhas são iguais !!
    if (senha_one == senha_two) {
        
    }else {

    }
}
var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;

function aunthpassport() {
passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
  ));
};
