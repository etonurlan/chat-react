import { Navbar } from "./Navbar"
import { SearchUser } from "./SearchUser"
import { ChatsList } from "./ChatsList"

export const Sidebar = () => {
    return (
        <div className="flex-[1] bg-[#3e3c61] relative">
            <Navbar />
            <SearchUser />
            <ChatsList />
        </div>
    )
}