'use client'

import { useAuthStore } from '@/app/store/useAuthStore';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuthStore();
    const router = useRouter();
    
    useEffect(() => {
        if (user) {
            router.push('/documents');
        }
    }, [user, router]);


    return (
        <>
            <div>{children}</div>
        </>
    );
};

export default AuthLayout;