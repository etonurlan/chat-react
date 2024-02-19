import { useEffect, useRef } from "react"

import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "../config/firebase"

import { useSelector } from "react-redux"

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

export const Message = ({ message }: {message: Message}) => {
    const data = useSelector((state: Data) => state.chat)
    const [currentUser] = useAuthState(auth)

    const ref: any = useRef()
    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: "smooth" })
    }, [message])

    return (
        <div ref={ref}
        className={`flex gap-5 mb-5 ${message.senderId === currentUser?.uid && "flex-row-reverse"}`}>
            <div className="flex flex-col text-[gray] font-light">
                <img className="w-10 h-10 rounded-[50%] object-cover"
                src={
                    message.senderId === currentUser?.uid
                        ? currentUser?.photoURL!
                        : data.user.photoURL
                } alt="User Avatar" />
                <span>just now</span>
            </div>
            <div className={`max-w-[80%] flex flex-col gap-[10px] ${message.senderId === currentUser?.uid && "items-end"}`}>
                <p className={`bg-white p-[10px_20px] rounded-[0px_10px_10px_10px]
                max-w-max ${message.senderId === currentUser?.uid && "bg-[#8da4f1] rounded-[10px_0px_10px_10px]"}`}>
                    {message.text}
                </p>
                {message.img && <img className="w-[50%]" src={message.img} alt="Message Image" />}
            </div>
        </div>
    )
}