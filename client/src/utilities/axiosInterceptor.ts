import axios from 'axios';
import { useAuthStore } from '@/app/store/useAuthStore';
import { useToastStore } from '@/app/store/useToastStore';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
});

export const setupAxiosInterceptors = (router: AppRouterInstance) => {
    axiosInstance.interceptors.request.use(
        (config) => {
            const { access_token } = useAuthStore.getState();
            if (access_token) {
                config.headers.Authorization = `Bearer ${access_token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            const { logout } = useAuthStore.getState();
            const { toggleToast } = useToastStore.getState();

            if (error.response?.status === 401) {
                const errorMsg = error.response?.data?.message || 'Session expired. Please log in again.';

                logout();
                toggleToast({ message: errorMsg, type: 'error', open: true });
                router.push('/login');
            }

            return Promise.reject(error);
        }
    );
};

export default axiosInstance;