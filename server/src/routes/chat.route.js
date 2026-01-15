const express = require('express')
const isAuth = require('../middleware/isAuth')
const { createChat, getMyChats } = require('../controller/chat.controller')
const chatRoute = express.Router()

chatRoute.post('/create', isAuth, createChat)
chatRoute.get('/my', isAuth, getMyChats)

module.exports = chatRoute