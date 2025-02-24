"use client";

import { useAuth } from "@/app/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const loginSchema = zod.object({
    email: zod.string().email("Invalid email format").nonempty("Email is required"),
    password: zod.string().nonempty("Password is required"),
});

type LoginFormData = zod.infer<typeof loginSchema>;

const Login = () => {
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const { loginHandler, loading } = useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const router = useRouter();

    const onSubmit = async (data: LoginFormData): Promise<void> => {
        setError(null);
        setSuccessMessage(null);

        try {
            const { success, message } = await loginHandler(data);
            if (success) {
                setSuccessMessage(message);
                setTimeout(() => {
                    router.push("/documents");
                }, 1200)
                return;
            }
            throw new Error(message);
        } catch (error) {
            setError(error instanceof Error ? error.message : String(error));
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-96">
                <h2 className="text-2xl font-semibold text-[#005d87] mb-4 text-center">
                    Login
                </h2>
                {error && <div className="mt-4 text-red-600 text-center">{error}</div>}
                {successMessage && <div className="mt-4 text-green-600 text-center">{successMessage}</div>}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full p-2 border border-gray-300 rounded-lg mb-1 focus:outline-[#005d87]"
                            {...register("email")}
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full p-2 border border-gray-300 rounded-lg mb-1 focus:outline-[#005d87]"
                            {...register("password")}
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>
                    <div className="mb-2 text-end">
                        <Link className="text-[#005d87] font-semibold underline text-xs" href="/register">
                            Forgot Password?
                        </Link>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-[#005d87] text-white py-2 rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <span className="text-sm">
                        Not a user? Register{" "}
                        <Link className="text-[#005d87] font-semibold hover:underline" href="/register">
                            here
                        </Link>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Login;
