'use client'

import { RegisterFormData } from "@/app/interfaces/IUser";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link"
import { useForm } from "react-hook-form";
import * as zod from "zod"

const registerFormSchema = zod.object({
    first_name: zod.string().nonempty("First name is required"),
    last_name: zod.string().nonempty("Last name is required"),
    email: zod.string().email("Invalid email format").nonempty("Email is required"),
    password: zod.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,}$/, "Password must contain at least 8 characters, one uppercase letter, one number, and one special character."),
    confirm_password: zod.string().nonempty("Confirm password is required"),
}).refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
});


const Register = () => {
    const { register, handleSubmit } = useForm({
        resolver: zodResolver(registerFormSchema)
    });

    const onSubmit = async (data: RegisterFormData): Promise<void> => {
        try {
            delete data.confirm_password;
            console.log(data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Register</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="first_name" className="block text-sm font-medium">First Name</label>
                        <input
                            type="text"
                            id="first_name"
                            {...register("first_name")}
                            placeholder="Enter First Name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005d87]"
                        />
                    </div>
                    <div>
                        <label htmlFor="last_name" className="block text-sm font-medium">Last Name</label>
                        <input
                            type="text"
                            id="last_name"
                            {...register("last_name")}
                            placeholder="Enter Last Name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005d87]"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium">Email</label>
                        <input
                            type="text"
                            id="email"
                            {...register("email")}
                            placeholder="Enter Email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005d87]"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium">Password</label>
                        <input
                            type="password"
                            id="password"
                            {...register("password")}
                            placeholder="Enter Password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005d87]"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirm_password" className="block text-sm font-medium">Confirm Password</label>
                        <input
                            type="password"
                            id="confirm_password"
                            {...register("confirm_password")}
                            placeholder="Enter Confirm Password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005d87]"
                        />
                    </div>
                    <button type="submit" className="w-full bg-[#005d87] text-white py-2 rounded-md">
                        Register
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button className="text-sm">
                        Already a user? Login <Link className="text-[#005d87] font-semibold hover:underline" href="/login">here</Link>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Register