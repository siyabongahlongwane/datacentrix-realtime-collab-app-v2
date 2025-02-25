'use client'

import DocumentsList from '@/app/components/DocumentsList'
import DocumentsTableView from '@/app/components/DocumentsTableView'
import { useAuthStore } from '@/app/store/useAuthStore'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Documents = () => {

    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const { user } = useAuthStore(state => state);

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await axios.get<any[]>(`${process.env.NEXT_PUBLIC_SERVER_URL}/documents/getall?id=${user?.id}`);
            setDocuments(response.data);
        } catch (err) {
            setError('Failed to fetch documents. Please try again later.');
            console.error('Error fetching documents:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if(user) {
            fetchDocuments();
        }
    }, [!user?.id]);


    if (loading) {
        return <div>Loading documents...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className='bg-[#005d87] min-h-screen'>
            <div className='flex flex-col gap-3 p-4'>
                <DocumentsList title='Recently Viewed' documents={documents.slice(0, 2)} error={error} />
                <DocumentsTableView title='My Documents' documents={documents} showAddBtn error={error} />
                <DocumentsTableView title='Shared With Me' documents={documents} error={error} />
            </div>
        </div>
    )
}

export default Documents;