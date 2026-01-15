const Chat = require('../models/chat.model')
const Message = require('../models/message.model')
const User = require('../models/user.model')

const sendMessage = async(req, res)=>{
    try{
        const myId = req.user._id
        const {chatId, text} = req.body

        if(!myId){
           return res.status(401).json({
                message: "myId is required"
            })
        }
        
        if(!chatId || !text){
           return res.status(400).json({
                message: "chatId and textId are required"
            })
        }

        const chat = await Chat.findById(chatId)
        if(!chat){
            return res.status(404).json({
                message: "chat not exist"
            })
        }

        // optional: check user belongs to chat
        if (!chat.participants.includes(myId)) {
            return res.status(403).json({ message: "Not allowed" });
        }

        const message = await Message.create({
            chatId,
            senderId: myId,
            text
        })
        
        chat.latestMessage = message._id
        await chat.save()

        res.status(200).json({
            message: "Message Sent",
            data: message
        })
    }
    catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

const getMesssageByChat = async(req, res)=>{
    try{
        const myId = req.user._id
        const {chatId} = req.params

        if(!myId){
            return res.status(401).json({
                message: "Unauthorized"
            })
        }
        const chat = await Chat.findById(chatId)
        if(!chat){
            return res.status(404).json({
                message: "Chat not found"
            })
        }

        if(!chat.participants.includes(myId)){
            return res.status(403).json({
                message: "Not Allowed"
            })
        }

        const messages = await Message.find({ chatId }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    }
    catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

const unsendMessage = async (req, res) => {
  try {
    const myId = req.user._id;
    const { messageId } = req.params;

    if (!myId) {
      return res.status(401).json({ message: "unauthorized" });
    }

    const message = await Message.findById(messageId);
    
    if (!message) {
      return res.status(404).json({ message: "message not found" });
    }

    if (message.senderId.toString() !== myId.toString()) {
      return res.status(403).json({ message: "not allowed" });
    }

    await Message.findByIdAndDelete(messageId);

    res.status(200).json({
      message: "message unsent (deleted)",
      messageId,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



module.exports = {sendMessage, getMesssageByChat, unsendMessage}