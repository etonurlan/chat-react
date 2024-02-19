import { useSelector } from "react-redux"

import Cam from "../img/cam.png"
import Add from "../img/add.png"
import More from "../img/more.png"

import { Input } from "./Input"
import { Messages } from "./Messages"

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

export const ChatWindow = () => {
    const data = useSelector((state: Data) => state.chat)

    return (
        <div className="flex-[2]">
            <div className="h-[50px] bg-[#5d5b8d] flex items-center
            justify-between p-[10px] text-[lightgray]">
                <span>{data?.user?.displayName}</span>
                <div className="flex gap-[10px]">
                    <img className="h-10 cursor-pointer hover:bg-[#2f2d52] rounded-full p-2"
                    src={Cam} alt="Icon Cam" />
                    <img className="h-10 cursor-pointer hover:bg-[#2f2d52] rounded-full p-2"
                    src={Add} alt="Icon Add" />
                    <img className="h-10 cursor-pointer hover:bg-[#2f2d52] rounded-full p-2"
                    src={More} alt="Icon More" />
                </div>
            </div>
            <Messages />
            <Input />
        </div>
    )
}