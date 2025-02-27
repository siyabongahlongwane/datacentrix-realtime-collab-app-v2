'use client'

import Header from '@/app/components/Header';
import ProtectedRoute from '@/app/components/ProtectedRoutes';
import React from 'react';

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {

    return (
        <ProtectedRoute>
            <>
                <Header showShareBtn={false} showSearchbar={false} />
                <div>{children}</div>
            </>
        </ProtectedRoute>
    );
};

export default ProfileLayout;