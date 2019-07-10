const Usuario = require('./criando-usuario.js');
const userlog = require('./server.js');

// cria novo usuario
exports.criar = (req, res) => {
    //validação da requisição 
    if (!req.body.username || !req.body.password || !req.body.email) {
        return res.status(400).send({
            msg: "Usuario precisa possuir os atributos"
});
    }
    // criação do usuario , puxando o objeto definido no arquivo "criando-usuario.js"
    const usuario = new Usuario({
        username: nomeUsuario,
        password: senha,
        email: req.body.email
    });
    // salvar usuario no banco de dados 
    usuario.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            msg: err.msg ||  "Erro ao criar usuario"
        });
    });
}
    // buscando usuarios no banco

    exports.buscar = (req, res) => {
        Usuario.find()
        .then(usuario => {
            res.send(usuario);
        }).catch(err => {
            res.status(500).send({
            msg: err.msg || "Não consegui recuperar os usuarios :("
            })
        })
    }
    //buscar um usuario pelo seu identificador !
    exports.buscarUser = (req, res) => {
        Usuario.find({ username : req.params.username })
        .then(usuario => {
            if (!usuario) {
                return res.status(404).send({
                    msg: `O ${req.params.username} não existe no nosso banco.`
                })
            }
            res.send(usuario);
        }).catch(err => {
            if (err.kind === 'ObjectId')
            return res.status(400).send({
                message: `O ${req.params.username} não existe no nosso banco.`
            });
            return res.status(500).send({
                msg: `Algo deu errado ao buscar o ${req.params.username} no banco.`
            });
        });
    };

    // atualizando o usuario
    exports.atualizacao = (req, res) => {
        // validação para atualizar
        if (!req.body) {
            return res.status(400).send({
                message: "Usuario não pode ficar vazio" 
            });
        }
    
    // buscar e atualizar o usuario
    var user = Usuario.findOne({username : req.params.username})
    Usuario.findOneAndUpdate({ username : req.params.username }, {
        _id: user._id,
        username: req.body.username || user.username,
        password: req.body.password || user.password,
        email: req.body.email || user.email
    },  {new: true})
    .then(usuario => {
        if (!usuario) {
            return res.status(404).send({
                msg: "Usuario não encontrado pelo username: " + req.params.username
            });
        }
    res.send(usuario);
    }).catch(err => {
        if(err.tipo === 'ObjectId') {
            return res.status(404).send({
                message: "Usuario não encontrado pelo username: " + req.params.username
            });
        }
        return res.status(500).send({
            msg: "Não consegui deletar o usuario com o username: " + req.params.username
        });
    
    });
}
    // buscando um usuario pelo ID e removendo ele do banco e da aplicação 
    exports.deletar = (req, res) => {
        Usuario.findOneAndRemove({ username : req.params.username })
        .then(usuario => {
            if (!usuario) {
                return res.status(404).send({
                    msg: "Usuario não encontrado pelo username: " + req.params.username
                })
            }
            res.send({msg : "excluido"})
        }).catch(err => {
            if (err.tipo === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    msg: "não consegui buscar o username: " + req.params.username
                });
            }
            return res.status(500).send({
                msg : "Não consegui deletar o usuario com o username: " + req.params.username
            })
        });
    };
