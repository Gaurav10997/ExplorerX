const express = require('express');

const Router = express.Router();
const authController = require('./../controllers/authController')
const userController = require('./../controllers/userController');

Router.get('/' , userController.getAllusers);

Router.post('/signup', authController.module.signup)
Router.post('/login', authController.module.login)

module.exports = Router;
