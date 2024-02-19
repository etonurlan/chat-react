import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "../config/firebase"
import { signOut } from "firebase/auth"
import { useNavigate } from "react-router-dom"

export const Navbar = () => {
    const [user] = useAuthState(auth)

    const navigate = useNavigate()
    const signUserOut = async () => {
        await signOut(auth)
        navigate("/register")
    }

    return (
        <div className="flex items-center bg-[#2f2d52] h-[50px]
        p-[10px] justify-between text-[#ddddf7]">

            <span className="font-bold max-md:hidden">
                Chat React
            </span>

            <div className="flex gap-[10px] items-center">
                <img className="h-8 w-8 rounded-[50%] object-cover"
                src={user?.photoURL || undefined} alt="Current User Avatar" />
                <span className="text-[18px]">{user?.displayName}</span>
                <button className="bg-[#5d5b8d] text-[15px] p-1 rounded-md
                hover:bg-blue-600 hover:text-white max-md:absolute max-md:bottom-[10px]"
                onClick={signUserOut}>
                    logout
                </button>
            </div>
            
        </div>
    )
}