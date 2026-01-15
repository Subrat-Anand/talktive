const express = require('express')
const { signUp, logIn } = require('../controller/auth.controller')
const authRoute = express.Router()

authRoute.post('/signup', signUp)
authRoute.post('/login', logIn)

module.exports = authRoute