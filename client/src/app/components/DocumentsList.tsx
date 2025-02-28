import React from 'react'
import DocumentCard from './DocumentCard'
import { IDocumentCard } from '../interfaces/IDocumentCard'

const DocumentsList = ({ title, documents, error }: { title: string, documents: IDocumentCard[], error: string }) => {
    return (
        <div>
            <h1 className='font-bold text-xl text-white'>{title}</h1>

            <div className='flex flex-wrap gap-4 mt-2 box-border'>
                {
                    error ? <div className='text-red-400'>{error}</div>
                        :
                        !documents.length ? <div className='text-white'>No documents found</div>
                            :
                            documents.map((document) => (
                                <div key={document.id} className='w-1/5'>
                                    <DocumentCard key={document.id} document={document} />
                                </div>
                            ))
                }
            </div>
        </div>
    )
}

export default DocumentsList