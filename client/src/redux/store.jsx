import { configureStore } from "@reduxjs/toolkit";
import userReducer from './userSlice'
import chatReducer from './chatsSlice'
import messageReducer from './messageSlice'
import selectedChatReducer from './selectedChatSlice'
import unsendMessageReducer from  './oneMessageIdSlice'
import toggleReducer from './toggleSlice'

const store = configureStore({
    reducer:{
        user: userReducer,
        chat: chatReducer,
        message: messageReducer,
        selectedChat: selectedChatReducer,
        onSingleMessageId: unsendMessageReducer,
        toggle: toggleReducer
    }
})

export default store