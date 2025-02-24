'use client'

import DocumentsList from '@/app/components/DocumentsList'
import DocumentsTableView from '@/app/components/DocumentsTableView'
import React from 'react'

const Documents = () => {
    const dummyDocs = [
        { id: "1", title: "Document 1", last_edited: "2023-08-01" },
        { id: "2", title: "Document 2", last_edited: "2023-08-02" },
        { id: "3", title: "Document 3", last_edited: "2023-08-03" },
        { id: "4", title: "Document 4", last_edited: "2023-08-04" },
        { id: "5", title: "Document 5", last_edited: "2023-08-05" },
        { id: "6", title: "Document 6", last_edited: "2023-08-06" },
    ]
    return (
        <div>
            <DocumentsList title="Recently Viewed" documents={dummyDocs} error="" />
            <DocumentsTableView 
                title="My Documents" 
                documents={dummyDocs} 
                initials="SH" 
                showAddBtn
            />
            <DocumentsTableView 
                title="Shared With Me" 
                documents={dummyDocs} 
                initials="SH" 
            />
        </div>
    )
}

export default Documents