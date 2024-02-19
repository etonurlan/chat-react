import { useState, useEffect } from "react"

import { useSelector } from "react-redux"

import { onSnapshot, doc } from "firebase/firestore"
import { db } from "../config/firebase"

import { Message } from "./Message"

type Data = {
    chat: {
        chatId: string;
        user: {
            displayName: string;
            photoURL: string;
            uid: string;
        }
    }
}
type Message = {
    id: string;
    senderId: string;
    text: string;
    img: string;
}

export const Messages = () => {
    const [messages, setMessages] = useState([])

    const data = useSelector((state: Data) => state.chat)
    
    useEffect(() => {
        const unSub = onSnapshot(doc(db, "chats", data?.chatId), (doc) => {
            doc.exists() && setMessages(doc.data().messages)
        })
        return () => {
            unSub()
        }
    }, [data?.chatId])

    return (
        <div className="bg-[#ddddf7] p-[10px] h-[calc(100%-100px)] overflow-y-scroll">
            {messages?.map((m: Message) => (
                <Message message={m} key={m.id} />
            ))}
        </div>
    )
}