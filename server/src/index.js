require('dotenv').config()
const express = require('express')
const DbConnect = require('./config/Db')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const authRoute = require('./routes/auth.route')
const userRoute = require('./routes/user.route')
const chatRoute = require('./routes/chat.route')
const messageRoute = require('./routes/message.route')
const createSocketServer = require('./web/socket')
const app = express()

app.set("trust proxy", 1); // 🔥 THIS IS THE FIX

app.use(cors({
    origin: "https://frontdms.onrender.com",
    credentials: true
}))

const Port = process.env.PORT || 8000

// middleware
app.use(express.json())
app.use(cookieParser())

// routes 
app.use('/api/auth', authRoute)
app.use('/api/user', userRoute)
app.use('/api/chat', chatRoute)
app.use('/api/message', messageRoute)

const {server} = createSocketServer(app)

server.listen(Port, ()=> {
    DbConnect()
    console.log("App is listening at PORT:", Port)
})
