import ProductController from '../controllers/ProductController';
import authMiddleware from '../Auth';

const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const router = express.Router();

router.use(authMiddleware);

router.get('/', ProductController.list);
router.get('/:id', ProductController.getById);
router.post('/', ProductController.create);
router.put('/:id', ProductController.update);
router.delete('/:id', ProductController.remove);

router.post('/', passport.authenticate('local', { successRedirect: '/login', failureRedirect: '/', failureFlash: true }));

export default router;