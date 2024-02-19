import { useState } from "react"

import { useSelector } from "react-redux"

import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db, storage } from "../config/firebase"
import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"

import { v4 as uuid } from "uuid"

import Attach from "../img/attach.png"
import Img from "../img/img.png"

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


export const Input = () => {
    const [text, setText] = useState("")
    const [img, setImg] = useState(null)

    const data = useSelector((state: Data) => state.chat)
    const [ currentUser ] = useAuthState(auth)

    const handleSend = async () => {
        // send img
        if (img) {
            // create folder
            const storageRef = ref(storage, `sendImg/${uuid()}`)

            // create doc with img
            const uploadTask = uploadBytesResumable(storageRef, img)
            await uploadTask.then(() => {
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    await updateDoc(doc(db, "chats", data.chatId), {
                        messages: arrayUnion({
                            id: uuid(),
                            text,
                            senderId: currentUser?.uid,
                            date: Timestamp.now(),
                            img: downloadURL
                        })
                    })
                })
            })
            
        } else {
            // create doc without img
            await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: currentUser?.uid,
                    date: Timestamp.now()
                })
            })
        }

        // update last message
        await updateDoc(doc(db, "userChats", currentUser?.uid!), {
            [data.chatId + ".lastMessage"]: {
                text
            },
            [data.chatId + ".date"]: serverTimestamp()
        })
        await updateDoc(doc(db, "userChats", data.user.uid), {
            [data.chatId + ".lastMessage"]: {
                text
            },
            [data.chatId + ".date"]: serverTimestamp()
        })

        setText("")
        setImg(null)
    }

    return (
        <div className="h-[50px] bg-white p-[10px] flex
        items-center justify-between">
            <input type="text" placeholder="Type something..."
            className="w-[100%] outline-none text-[#2f2d52] text-[18px]
            placeholder:text-[lightgray]" value={text}
            onChange={(event) => setText(event.target.value)} />
            <div className="flex items-center gap-[10px]">
                <img className="h-6 cursor-pointer"
                src={Attach} alt="Attach" />
                <input type="file" id="file" className="hidden"
                onChange={(event: any) => setImg(event.target.files[0])} />
                <label className="w-12" htmlFor="file">
                    <img className="h-6 cursor-pointer"
                    src={Img} alt="Img" />
                </label>
                <button onClick={handleSend}
                className="p-[10px_15px] text-white bg-[#8da4f1] rounded-md
                hover:bg-blue-500">
                    Send
                </button>
            </div>
        </div>
    )
}