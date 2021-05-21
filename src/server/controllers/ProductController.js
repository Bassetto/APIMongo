import ProductModel from '../models/Product.js';
import * as httpStatus from 'http-status';

const sendResponse = function(res, statusCode, data) {
    res.status(statusCode).json({ result: data });
};

class ProductController {
    constructor() {};
        
    list(req, res) {
        ProductModel.find({})
            .then(products => sendResponse(res, httpStatus.OK, products))
            .catch(err => {
                console.error('Erro: ' + err);
                sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, {});
            });
    };
    
    getById(req, res) {
        const id = { _id: req.params.id };

        if(!id) {
            sendResponse(res, httpStatus.OK, 'Usuário não encontrado');
        };

        Produto.findById(id)
            .then(product => sendResponse(res, httpStatus.OK, product))
            .catch(err => {
                console.error('Erro: ' + err);
                sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, {});
            });
    };

    create(req, res) {
        const product = req.body;

        ProductModel.create(product)
            .then(product =>
                sendResponse(res, httpStatus.CREATED, 'Usuário criado!'),
            )
            .catch(err => {
                console.error('Erro: ' + err);
                sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, {});
            });
    };
    
    update(req, res) {
        const id = { _id: req.params.id };
        const product = req.body;
        const updateProduct = {
            name: product.name,
            description: product.description,
            price: product.price,
            distributor: product.distributor,
            quantity: product.quantity,
            status: product.status,
        };

        ProductModel.findByIdAndUpdate(id, updateProduct)
            .then(product => sendResponse(res, httpStatus.OK, 'Produto alterado com sucesso!'))
            .catch(err => {
                console.error(`Erro: ${err}`);
                sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, {});
            });
    }

    remove(req, res) {
        const id = { _id: req.params.id };
        ProductModel.remove(id)
            .then(result => sendResponse(res, httpStatus.OK, result))
            .catch(err => {
                console.error(`Erro: ${err}`);
                sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, {});
            });
    };
};

export default new ProductController();