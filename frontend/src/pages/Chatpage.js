import React, { useState } from "react";
import axios from "axios";
import { useEffect } from 'react';
const Chatpage = () => {
const [chats, setChats] = useState([]); //agregar estado a componentes
    //Asincrono
    const fetchChats = async() => {
        const {data} = await axios.get("/api/chat");
        setChats(data);
    }

    //solicitud de datos
    useEffect(() => {
        fetchChats();
    }, []);
    

  return (
    <div>
  {chats.map(chat => (
    <div key={chat._id}>{chat.chatName}</div>
  ))}
</div>
  )
}

export default Chatpage;