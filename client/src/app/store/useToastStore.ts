import { create } from 'zustand';
import { IToast } from '../interfaces/IToast';

interface ToastStore {
    toast: IToast;
    toggleToast: ({ message, type, open }: IToast) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
    toast: {
        message: '',
        type: 'success',
        open: false,
    },
    toggleToast: ({ message, type, open }: IToast) => {
        set({ toast: { message, type, open } });
    }
}));