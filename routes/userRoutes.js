const express = require('express');

const Router = express.Router();
const authController = require('./../controllers/authController')
const userController = require('./../controllers/userController');

Router.get('/' , userController.getAllusers);

Router
.route('/:id')
.get(userController.getUser)

Router.post('/signup', authController.signup)
Router.post('/login', authController.login)
Router.post('/forgotpassword', authController.forgotPassword)
Router.patch('/resetpassword/:token', authController.resetPassword)

module.exports = Router;
