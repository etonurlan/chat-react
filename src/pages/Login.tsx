import { useState } from "react"

import { Link, useNavigate } from "react-router-dom"

import { useForm } from "react-hook-form" 
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"

import { auth } from "../config/firebase"
import { signInWithEmailAndPassword } from "firebase/auth"

interface CreateFormData {
    email: string;
    password: string;
}

export const Login = () => {
    const [err, setErr] = useState(false)

    const navigate = useNavigate()

    // validation
    const schema = yup.object().shape({
        email: yup.string().email().required("Enter a email"),
        password: yup.string().required("Enter a password"),
    })
    const {
        register,
        formState: { errors }
    } = useForm<CreateFormData>({
        resolver: yupResolver(schema)
    })
    // sign in
    const handleSubmit = async (event: any) => {
        event.preventDefault()
        const email = event.target[0].value
        const password = event.target[1].value

        try {
            await signInWithEmailAndPassword(auth, email, password)
            navigate("/")
        } catch (err) {
            setErr(true)
        }
    }

    return (
        <div className="bg-white p-[20px_60px] rounded-[10px] flex
        flex-col gap-[10px] items-center">

            <span className="text-[#5d5b8d] font-bold text-[24px]">
                Chat React
            </span>
            <span className="text-[#5d5b8d] text-[12px]">
                Login
            </span>

            <form onSubmit={handleSubmit}
            className="flex flex-col gap-[15px]">

                <input className="p-[15px] w-[250px]
                border-b border-[#a7bcff]" 
                required type="email" placeholder="Email..." {...register("email")} />
                <p className="text-red-600">{errors.email?.message}</p>

                <input className="p-[15px] w-[250px]
                border-b border-[#a7bcff]" 
                required type="text" placeholder="Password..." {...register("password")} />
                <p className="text-red-600">{errors.password?.message}</p>

                <button className="bg-[#7b96ec] text-white p-[10px]
                font-bold border-none cursor-pointer hover:bg-indigo-600">
                    Sign Up
                </button>

            </form>

            {err && <p className="text-red-600">Something went wrong</p>}

            <p className="text-[#5d5b8d] text-[12px] mt-[10px]">
                You do have an account? <Link className="hover:text-indigo-600"
                to="/register">Register</Link>
            </p>

        </div>
    )
}