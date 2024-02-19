import { useState } from "react"

import Add from "../img/add.png" 

import { Link, useNavigate } from "react-router-dom"

import { useForm } from "react-hook-form" 
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"

import { auth, storage, db } from "../config/firebase"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore"

interface CreateFormData {
    name: string;
    email: string;
    password: string;
    confirm_pass: string;
    photo: string;
}

export const Register = () => {
    const navigate = useNavigate() 

    const [err, setErr] = useState(false)
    const [loading, setLoading] = useState(false)

    // validation
    const schema = yup.object().shape({
        name: yup.string().required("Enter a name"),
        email: yup.string().email().required("Enter a email"),
        password: yup.string().required("Enter a password")
        .min(6, "Password must be at least 6 characters"),
        confirm_pass: yup.string().required("Confirm password is required")
        .oneOf([yup.ref('password')], "Password must match"),
        photo: yup.string().required("Add a photo")
    })
    const {
        register,
        formState: { errors }
    } = useForm<CreateFormData>({
        resolver: yupResolver(schema)
    })
    // add data
    const handleSubmit = async (event: any) => {
        setLoading(true)
        event.preventDefault()
        const name = event.target[0].value
        const email = event.target[1].value
        const password = event.target[2].value
        const photo = event.target[4].files[0]
        
        try {
            // create user
            const res = await createUserWithEmailAndPassword(auth, email, password)

            // add image to storage
            const date = new Date().getTime();
            const storageRef = ref(storage, `img/${name + date}`)
            await uploadBytesResumable(storageRef, photo).then(() => {
                getDownloadURL(storageRef).then(async (downloadURL) => {
                    try {
                        // update profile
                        await updateProfile(res.user, {
                            displayName: name,
                            photoURL: downloadURL
                        })
                        // create user on firestore
                        await setDoc(doc(db, "users", res.user.uid), {
                            uid: res.user.uid,
                            name,
                            email,
                            photoURL: downloadURL
                        })
                        // create empty user chats on firestore
                        await setDoc(doc(db, "userChats", res.user.uid), {})
                        navigate("/") 
                    } catch (err) {
                        setErr(true)
                        setLoading(false)
                    }
                })
            })
        } catch (err) {
            setErr(true)
            setLoading(false)
        }
    }

    return (
        <div className="bg-white p-[20px_60px] rounded-[10px] flex
        flex-col gap-[10px] items-center">

            <span className="text-[#5d5b8d] font-bold text-[24px]">
                Chat React
            </span>
            <span className="text-[#5d5b8d] text-[12px]">
                Register
            </span>

            <form onSubmit={handleSubmit}
            className="flex flex-col gap-[15px]">

                <input className="p-[15px] w-[250px] 
                border-b border-[#a7bcff]" 
                required type="text" placeholder="Name..." {...register("name")} />
                <p className="text-red-600">{errors.name?.message}</p>

                <input className="p-[15px] w-[250px]
                border-b border-[#a7bcff]" 
                required type="email" placeholder="Email..." {...register("email")} />
                <p className="text-red-600">{errors.email?.message}</p>

                <input className="p-[15px] w-[250px]
                border-b border-[#a7bcff]" 
                required type="password" placeholder="Password..." {...register("password")} />
                <p className="text-red-600">{errors.password?.message}</p>

                <input className="p-[15px] w-[250px]
                border-b border-[#a7bcff]" 
                required type="password" placeholder="Confirm password..." 
                {...register("confirm_pass")} />
                <p className="text-red-600">{errors.confirm_pass?.message}</p>

                <input className="hidden" 
                required type="file" placeholder="Photo..." id="photo" {...register("photo")} />
                <label className="flex items-center gap-[10px] text-[#8da4f1]
                text-[12px] cursor-pointer"
                htmlFor="photo">
                    <img className="w-8"
                    src={Add} alt="Add Photo" />
                    <span className="hover:text-indigo-600">Add Photo</span>
                </label>
                <p className="text-red-600">{errors.photo?.message}</p>

                <button disabled={loading}
                className="bg-[#7b96ec] text-white p-[10px]
                font-bold border-none cursor-pointer hover:bg-indigo-600">
                    Sign In
                </button>

            </form>

            {err && <p className="text-red-600">Something went wrong</p>}
            {loading && <p className="text-blue-600">
                Uploading and compressing the image please wait...</p>
            }

            <p className="text-[#5d5b8d] text-[12px] mt-[10px]">
                You do have an account? <Link className="hover:text-indigo-600"
                to="/login">Login</Link>
            </p>

        </div>
    )
}