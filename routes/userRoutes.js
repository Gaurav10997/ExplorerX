const express = require('express');

const Router = express.Router();
const authController = require('./../controllers/authController')
const userController = require('./../controllers/userController');

Router.get('/' , userController.getAllusers);

Router
.route('/:id')
.get(userController.getUser)

Router.post('/signup', authController.module.signup)
Router.post('/login', authController.module.login)
Router.post('/reset', authController.module.resetPassword)
Router.post('/forgotpassword', authController.module.forgotPassword)

module.exports = Router;
