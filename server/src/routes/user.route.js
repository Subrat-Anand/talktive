const express = require('express')
const isAuth = require('../middleware/isAuth')
const { getCurrentUser, searchUser } = require('../controller/user.controller')
const userRoute = express.Router()

userRoute.get('/me', isAuth, getCurrentUser)
userRoute.get('/search', isAuth, searchUser)

module.exports = userRoute