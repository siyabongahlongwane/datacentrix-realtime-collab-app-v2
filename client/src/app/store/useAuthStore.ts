import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { IUser } from "../interfaces/IUser";
import { useToastStore } from "./useToastStore";

type AuthState = {
    user: IUser | null;
    access_token: string | null;
    isAuthenticated: boolean;
    login: (payload: { user: IUser; access_token: string }) => void;
    logout: () => void;
    updateLocalUser: (user: IUser) => void;
};

export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            (set) => ({
                user: null,
                access_token: null,
                isAuthenticated: false,

                login: ({ user, access_token }) => {
                    set({ user, access_token, isAuthenticated: true });
                    useToastStore.getState().toggleToast({
                        message: "Logged in successfully.", type: "success", open: true,
                    });
                },
                logout: () => {
                    set({ user: null, access_token: null, isAuthenticated: false });
                },
                updateLocalUser: (user: IUser) => {
                    set({ user: { ...user } });
                },
            }),
            {
                name: "auth-storage",
                partialize: (state) => ({ user: state.user, access_token: state.access_token }),
            }
        ),
        { name: "AuthStore" }
    )
);
