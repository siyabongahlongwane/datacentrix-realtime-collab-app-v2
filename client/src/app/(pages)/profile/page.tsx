'use client'

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axiosInstance from '@/utilities/axiosInterceptor';
import { useAuthStore } from '@/app/store/useAuthStore';
import { IUser } from '@/app/interfaces/IUser';

interface ProfileData {
    first_name: string;
    last_name: string;
    email: string;
}
const profileSchema = z.object({
    first_name: z.string().min(2, 'First name must be at least 2 characters'),
    last_name: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email').nonempty('Email is required'),
});

const ProfilePage = () => {
    const { user, updateLocalUser } = useAuthStore();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            first_name: '',
            last_name: '',
            email: '',
        },
    });

    useEffect(() => {
        if (user) {
            setValue('first_name', user.first_name);
            setValue('last_name', user.last_name);
            setValue('email', user.email);
        }
    }, [user, setValue]);



    const onSubmit = async (data: ProfileData) => {
        try {
            const response = await axiosInstance.put<{ message: string, user: IUser }>(`/users/update`, {
                ...data
            });
            updateLocalUser(response?.data?.user);

            console.log("Profile updated:", response.data);

        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Profile</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-gray-700">First Name</label>
                    <input
                        type="text"
                        {...register('first_name')}
                        className="w-full mt-1 p-2 border rounded"
                    />
                    {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name.message}</p>}
                </div>
                <div>
                    <label className="block text-gray-700">Last Name</label>
                    <input
                        type="text"
                        {...register('last_name')}
                        className="w-full mt-1 p-2 border rounded"
                    />
                    {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name.message}</p>}
                </div>
                <div>
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        {...register('email')}
                        className="w-full mt-1 p-2 border rounded bg-gray-100 cursor-not-allowed"
                        disabled
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Updating...' : 'Update Profile'}
                </button>
            </form>
        </div>
    );
};

export default ProfilePage;
