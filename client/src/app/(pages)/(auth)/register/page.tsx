'use client'

import { useAuth } from "@/app/hooks/useAuth";
import { RegisterFormData } from "@/app/interfaces/IUser";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as zod from "zod"

const passwordErrorMsg = "Password must contain at least 8 characters, one uppercase letter, one number, and one special character."
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,}$/;

const registerFormSchema = zod.object({
    first_name: zod.string()
        .nonempty("First name is required"),
    last_name: zod.string()
        .nonempty("Last name is required"),
    email: zod.string()
        .nonempty("Email is required").email("Invalid email format"),
    password: zod.string()
        .regex(passwordRegex,
            passwordErrorMsg),
    confirm_password: zod.string()
        .nonempty("Confirm password is required"),
}).refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
});


const Register = () => {
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const { registerHandler, loading } = useAuth();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(registerFormSchema)
    });

    const router = useRouter();

    const onSubmit = async (data: RegisterFormData): Promise<void> => {
        setError(null);
        setSuccessMessage(null);

        delete data.confirm_password;;

        try {
            const { success, message } = await registerHandler(data);
            if (success) {
                setSuccessMessage(message);
                setTimeout(() => {
                    router.push("/login");
                }, 1200)
                return;
            }
            throw new Error(message);
        } catch (error) {
            setError(error instanceof Error ? error.message : String(error));
        }
    };


    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Register</h2>
                {error && <div className="mt-4 text-red-600 text-center">{error}</div>}
                {successMessage && <div className="mt-4 text-green-600 text-center">{successMessage}</div>}
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
                        {errors.first_name && <p className="text-red-600 text-sm">{errors.first_name.message}</p>}
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
                        {errors.last_name && <p className="text-red-600 text-sm">{errors.last_name.message}</p>}
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
                        {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
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
                        {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
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
                        {errors?.confirm_password && <p className="text-red-600 text-sm">{errors.confirm_password?.message}</p>}
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-[#005d87] text-white py-2 rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? "Registering..." : "Register"}
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