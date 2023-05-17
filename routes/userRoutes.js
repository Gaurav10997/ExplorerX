const express = require('express');

const Router = express.Router();
const authController = require('./../controllers/authController')
const { getAllusers } = require('../controllers/userController');

Router.get('/' , getAllusers);

Router.post('/signup', authController.module.signup)
Router.post('/login', authController.module.login)

module.exports = Router;
