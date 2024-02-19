import { ChatWindow } from "../components/ChatWindow"
import { Sidebar } from "../components/Sidebar"

export const Home = () => {
    return (
        <div className="border-white rounded-[10px] w-[65%] h-[80%]
        flex overflow-hidden max-md:w-[90%]">
            <Sidebar />
            <ChatWindow />
        </div>
    )
}