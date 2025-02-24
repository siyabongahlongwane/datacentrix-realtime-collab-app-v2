import DocumentCard from '@/app/components/DocumentCard'
import React from 'react'

const Documents = () => {
    return (
        <DocumentCard document={{ id: "1", title: "Document 1", last_edited: "2023-08-01" }} />
    )
}

export default Documents