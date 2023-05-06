const express = require('express');

const userRouter = express.Router();
const { getAllusers, postUsers } = require('../controllers/userController');

userRouter.route('/').get(getAllusers).post(postUsers);

module.exports = userRouter;
