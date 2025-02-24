export interface IUser {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    created_at: string;
    updated_at: string;
};

export interface RegisterFormData extends Omit<IUser, 'id' | 'created_at' | 'updated_at'> {
    confirm_password?: string;
}
