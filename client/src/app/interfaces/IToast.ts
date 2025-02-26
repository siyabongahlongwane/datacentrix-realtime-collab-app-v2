export interface IToast {
    message: string;
    type: 'success' | 'error';
    open: boolean;
}