import { useState } from "react"

import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from "../config/firebase"
import { collection, query, where, getDocs, setDoc,
         doc, updateDoc, serverTimestamp, getDoc } from "firebase/firestore"

type User = {
    name?: string;
    email?: string;
    uid?: string;
    photoURL?: string;
}

export const SearchUser = () => {
    const [currentUser] = useAuthState(auth)
    const [username, setUsername] = useState("")
    const [user, setUser] = useState<User | null>(null)

    const [err, setErr] = useState(false)
    // find user
    const handleSearch = async () => {
        const q = query(
            collection(db, "users"),
            where("name", "==", username)
        )

        try {
            const querySnapshot = await getDocs(q)
            querySnapshot.forEach((doc: any) => {
                setUser(doc.data())
            }) 
        } catch (err) {
            setErr(true)
        }
    }
    const handleKey = (event: any) => {
        event.code === "Enter" && handleSearch()
    }
    // open dialog with user
    const handleSelect = async () => {
        // check whether the group(chats in firestore) exists, if not create
        const combineId = 
            currentUser!.uid > user!.uid!
                ? currentUser!.uid + user!.uid
                : user!.uid + currentUser!.uid
        try {
            const res = await getDoc(doc(db, "chats", combineId))

            if(!res.exists()) {
                // create a chat in chats collection
                await setDoc(doc(db, "chats", combineId), { messages: [] })

                //create user chats
                await updateDoc(doc(db, "userChats", currentUser?.uid!), {
                    [combineId + ".userInfo"]: {
                        uid: user?.uid,
                        displayName: user?.name,
                        photoURL: user?.photoURL,
                    },
                    [combineId + ".date"]: serverTimestamp()
                })
                await updateDoc(doc(db, "userChats", user?.uid!), {
                    [combineId + ".userInfo"]: {
                        uid: currentUser?.uid,
                        displayName: currentUser?.displayName,
                        photoURL: currentUser?.photoURL,
                    },
                    [combineId + ".date"]: serverTimestamp()
                })
            }
        } catch (err) {}

        setUser(null)
        setUsername("")
    }

    return (
        <div className="border-b-[gray]">

            <div className="p-[10px]">
                <input type="text" placeholder="Find a user"
                className="bg-transparent text-white outline-none
                placeholder:text-[lightgray]"
                onKeyDown={handleKey} value={username}
                onChange={(event) => setUsername(event.target.value)} />
            </div>

            {err && <p className="text-red-600">User not found!</p>}

            {user && (
                <div className="p-[10px] flex items-center gap-[10px] text-white
                cursor-pointer hover:bg-[#2f2d52]"
                onClick={handleSelect}>
                    <img className="w-[50px] h-[50px] rounded-[50%] object-cover"
                    src={user.photoURL}
                    alt="User Avatar" />
                    <div>
                        <span className="text-[18px] font-medium">
                            {user.name}
                        </span>
                    </div>
                </div>
            )}

        </div>
    )
}