import React from 'react'
import ChatPage from './ChatPage'
import ChatWindow from './ChatWindow'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { joinChatRoom, leaveChatRoom } from '../socketsActions/ChatRoom'

const Home = () => {
  const selectedChat = useSelector((s)=> s.selectedChat)

  useEffect(()=> {
    if(!selectedChat?._id) return;

    joinChatRoom(selectedChat?._id)

    return () => leaveChatRoom(selectedChat?._id)

  }, [selectedChat?._id])

  return(
  <div className="flex h-screen">
    <ChatPage />
    <ChatWindow />
  </div>
  )
}

export default Home