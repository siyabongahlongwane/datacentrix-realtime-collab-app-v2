'use client'

import DocumentsList from '@/app/components/DocumentsList'
import DocumentsTableView from '@/app/components/DocumentsTableView'
import { IDocumentCard } from '@/app/interfaces/IDocumentCard'
import { useAuthStore } from '@/app/store/useAuthStore'
import { useDocumentStore } from '@/app/store/useDocumentStore'
import axios from 'axios'
import React, {useEffect, useState } from 'react'

const Documents = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const { user } = useAuthStore(state => state);
    const setDocuments = useDocumentStore((state) => state.setDocuments);
    
    const filteredDocuments = useDocumentStore((state) => state.filteredDocuments);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                setLoading(true);
                setError('');
                const response = await axios.get<IDocumentCard[]>(`${process.env.NEXT_PUBLIC_SERVER_URL}/documents/getall?id=${user?.id}`);
                console.log(response.data);
                setDocuments(response.data);
            } catch (err) {
                setError('Failed to fetch documents. Please try again later.');
                console.error('Error fetching documents:', err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchDocuments();
        }
    }, [user, setDocuments]);

    if (loading) {
        return <div>Loading documents...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className='bg-[#005d87] min-h-screen'>
            <div className='flex flex-col gap-3 p-4'>
                <DocumentsList title='Recently Viewed' documents={filteredDocuments.slice(0, 2)} error={error} />
                <DocumentsTableView title='My Documents' documents={filteredDocuments.slice()} showAddBtn error={error} />
                <DocumentsTableView title='Shared With Me' documents={filteredDocuments.slice()} error={error} />
            </div>
        </div>
    );
};

export default Documents;