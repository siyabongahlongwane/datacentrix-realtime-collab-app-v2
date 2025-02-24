import { useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";
import { RegisterFormData } from "../interfaces/IUser";

export const useAuth = () => {
    const login = useAuthStore.getState().login;

    const serverURL: string = process.env.NEXT_PUBLIC_SERVER_URL!;
    const [loading, setLoading] = useState(false);

    const registerHandler = async (data: RegisterFormData) => {
        setLoading(true);
        try {
            const response = await axios.post(`${serverURL}/users/register`, data);
            const { user, access_token } = response.data;
            login({ user, access_token });
            return { success: true, message: response?.data?.message };
        } catch (error) {
            console.error("Registration error:", error);
            if (axios.isAxiosError(error)) {
                return { success: false, message: error.response?.data?.error || "Registration failed." };
            } else {
                return { success: false, message: "Registration failed." };
            }
        } finally {
            setLoading(false);
        }
    };

    return { registerHandler, loading };
};
