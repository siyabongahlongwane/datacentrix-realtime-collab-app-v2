import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/useAuthStore"; // Adjust based on your setup

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuthStore();
    const router = useRouter();
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        if (!checkingAuth && !user) {
            router.push("/login");
        } else {
            router.push("/documents");
        }
        setCheckingAuth(false);
    }, [user, router, checkingAuth]);

    if (checkingAuth || user === null) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
