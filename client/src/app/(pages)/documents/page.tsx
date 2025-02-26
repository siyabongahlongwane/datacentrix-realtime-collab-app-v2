'use client'

import DocumentsList from '@/app/components/DocumentsList'
import DocumentsTableView from '@/app/components/DocumentsTableView'
import { IDocumentCard } from '@/app/interfaces/IDocumentCard'
import { useAuthStore } from '@/app/store/useAuthStore'
import { useDocumentStore } from '@/app/store/useDocumentStore'
import axiosInstance from '@/utilities/axiosInterceptor'
import React, { useCallback, useEffect, useState } from 'react'

const Documents = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const { user, access_token } = useAuthStore(state => state);
    const { setDocuments, filterDocuments, filteredDocuments } = useDocumentStore();

    const fetchDocuments = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            
            const response = await axiosInstance.get<IDocumentCard[]>(`/documents/getall?id=${user?.id}`);

            setDocuments(response.data);
            filterDocuments();
        } catch (err) {
            setError('Failed to fetch documents. Please try again later.');
            console.error('Error fetching documents:', err);
        } finally {
            setLoading(false);
        }
    }, [setDocuments, user, filterDocuments])

    useEffect(() => {
        if (user) {
            fetchDocuments();
        }
    }, [user, fetchDocuments, access_token]);

    if (loading) {
        return <div>Loading documents...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className='bg-[#005d87]'>
            <div className='flex flex-col gap-3 p-4'>
                <DocumentsList title='Recently Viewed' documents={filteredDocuments.slice(0, 3)} error={error} />
                <DocumentsTableView title='My Documents' documents={filteredDocuments} showAddBtn error={error} />
                <DocumentsTableView title='Shared With Me' documents={filteredDocuments} error={error} />
            </div>
        </div>
    );
};

export default Documents;