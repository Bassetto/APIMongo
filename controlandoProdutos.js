const Produto = require('./criando-produto.js');

// cria novo produto
exports.criar = (req, res) => {
    // validação da requisição 
    if (!req.body) {
        return res.status(400).send({
            msg: "Produto precisa possuir os atributos"
});
    }
    // criação do produto , puxando o objeto definido no arquivo "criando-produto.js"
    const produto = new Produto({
        nome: req.body.nome || "Sem nome",
        preco: req.body.preco || 0.00,
        distribuidora: req.body.distribuidora || "desconhecida",
        quantidade: req.body.quantidade || "0",
        status: req.body.quantidade || "1"
    });

    // salvar produto no banco de dados 
    produto.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            msg: err.msg ||  "Erro ao criar produto"
        });
    });
}
    // buscando produtos no banco

    exports.buscar = (req, res) => {
        Produto.find()
        .then(produto => {
            res.send(produto);
        }).catch(err => {
            res.status(500).send({
            msg: err.msg || "Não consegui recuperar os produtos :("
            })
        })
    }
    //buscar um produto pelo seu identificador !
    exports.buscarId = (req, res) => {
        Produto.findById(req.params.produtoId)
        .then(produto => {
            if (!produto) {
                return res.status(404).send({
                    msg: "Este id não existe" + req.params.produtoId
                })
            }
            res.send(produto);
        }).catch(err => {
            if (err.kind === 'ObjectId')
            return res.status(400).send({
                message: "Produto não encontrado pelo id " + req.params.produtoId
            });
            return res.status(500).send({
                msg: "Algo de errado ao buscar o ID " + req.params.produtoId 
            });
        });
    };

    // atualizando o produto
    exports.atualizacao = (req, res) => {
        // validação para atualizar
        if (!req.body) {
            return res.status(400).send({
                message: "Produto não pode ficar vazio" 
            });
        }
    
    // buscar e atualizar o produto
    Produto.findByIdAndUpdate(req.params.produtoId, {
        id: req.params.id,
        nome: req.body.nome,
        preco: req.body.preco,
        distribuidora: req.body.distribuidora,
        quantidade: req.body.quantidade,
        status: req.body.status
    },)
    .then(produto => {
        if (!produto) {
            return res.status(404).send({
                msg: "Não consegui encontrar este produto" + req.params.produtoId
            });
        }
    res.send(produto);
    }).catch(err => {
        if(err.tipo === 'ObjectId') {
            return res.status(404).send({
                message: "Produto não encontrado com o ID" + req.params.produtoId
            });
        }
        return res.status(500).send({
            msg: "Algo de errado com o ID" + req.params.produtoId
        });
    
    });
}
    // buscando um produto pelo ID e removendo ele do banco e da aplicação 
    exports.deletar = (req, res) => {
        Produto.findByIdAndRemove(req.params.produtoId)
        .then(produto => {
            if (!produto) {
                return res.status(404).send({
                    msg: "Produto não encontrado pelo ID " + req.params.produtoId
                })
            }
            res.send({msg : "excluido"})
        }).catch(err => {
            if (err.tipo === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    msg: "não consegui buscar o ID " + req.params.produtoId
                });
            }
            return res.status(500).send({
                msg : "Não foi deletado o produto com o ID " + req.params.produtoId
            })
        });
    };
