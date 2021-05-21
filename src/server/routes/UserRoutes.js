import UserController from '../controllers/UserController';
import authMiddleware from '../Auth';

const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const router = express.Router();

router.use(authMiddleware);

router.get('/', UserController.list);
router.get('/:username', UserController.getByID);
router.post('/', UserController.create);
router.put('/:username', UserController.update);
router.delete('/:username', UserController.remove);

router.post('/register', UserController.register);
router.post('/authenticate', UserController.authenticate);
router.post('/forgot_password', UserController.forgotPassword);
router.post('/reset_password', UserController.reset_password);

router.post('/', passport.authenticate('local', { successRedirect: '/login', failureRedirect: '/', failureFlash: true }));

export default router;