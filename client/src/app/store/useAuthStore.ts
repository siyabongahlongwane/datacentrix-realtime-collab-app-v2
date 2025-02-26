import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { IUser } from "../interfaces/IUser";

type AuthState = {
    user: IUser | null;
    access_token: string | null;
    isAuthenticated: boolean;
    login: (payload: { user: IUser; access_token: string }) => void;
    logout: () => void;
};

export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            (set) => ({
                user: null,
                access_token: null,
                isAuthenticated: false,

                login: ({ user, access_token }) =>
                    set({ user, access_token, isAuthenticated: true }),

                logout: () => {
                    set({ user: null, access_token: null, isAuthenticated: false });
                    window.location.href = '/login';
                }
            }),
            {
                name: "auth-storage",
                partialize: (state) => ({ user: state.user, access_token: state.access_token }),
            }
        ),
        { name: "AuthStore" }
    )
);
