const express = require('express')
const UsersController = require('../controllers/users-controllers')

const {check} = require('express-validator')

const route = express.Router()

route.get('/', UsersController.getAllUsers)
route.post('/login', UsersController.loginHandler)
route.post('/signup', [check('email').normalizeEmail().isEmail(),
                       check('name').not().isEmpty()] , UsersController.signupHandler)

module.exports = route