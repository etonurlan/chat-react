import { useEffect, useState } from "react"

import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from "../config/firebase"
import { doc, onSnapshot } from "firebase/firestore"

import { useDispatch } from "react-redux"
import { changeUser } from "../redux/features/chatSlice"

export const ChatsList = () => {
    const [chats, setChats] = useState([])

    const [currentUser] = useAuthState(auth)

    const currentUserSend = {
        uid: currentUser?.uid
    }

    const dispatch = useDispatch()

    useEffect(() => {
        const getChats = () => {
            const unsub = onSnapshot(doc(db, "userChats", currentUser?.uid!), (doc: any) => {
                setChats(doc.data())
            })

            return () => {
                unsub()
            }
        }

        currentUser?.uid && getChats()
    }, [currentUser?.uid])

    const handleSelect = (selectUser: any, currentUser: any) => {
        dispatch(changeUser({ selectUser, currentUser }))
    }

    return (
        <div>
            {Object.entries(chats)?.sort((a: any, b: any) => b[1].date - a[1].date).map((chat: any) => (
                <div className="p-[10px] flex items-center gap-[10px] text-white
                cursor-pointer hover:bg-[#2f2d52]"
                key={chat[0]} onClick={() => handleSelect(chat[1].userInfo, currentUserSend)}>
                    <img className="w-[50px] h-[50px] rounded-[50%] object-cover"
                    src={chat[1].userInfo.photoURL}
                    alt="User Avatar" />
                    <div>
                        <span className="text-[18px] font-medium">
                            {chat[1].userInfo.displayName}
                        </span>
                        <p className="text-[14px] text-[lightgray]">
                            {chat[1].lastMessage?.text}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}