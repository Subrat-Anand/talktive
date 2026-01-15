const express = require('express')
const isAuth = require('../middleware/isAuth')
const { sendMessage, getMesssageByChat, unsendMessage } = require('../controller/message.controller')
const messageRoute = express.Router()

messageRoute.post('/send', isAuth, sendMessage)
messageRoute.get('/:chatId', isAuth, getMesssageByChat)
messageRoute.delete('/unsend/:messageId', isAuth, unsendMessage)

module.exports = messageRoute