'use client'

import { humanDateFormat } from '@/utilities/transformDate';
import Link from 'next/link';
import React from 'react'
import { IoDocumentTextOutline } from "react-icons/io5";

export interface IDocumentCard {
    id: string;
    title: string;
    last_edited: string;
}

const DocumentCard = ({ document }: { document: IDocumentCard }) => {
    const { id, title, last_edited } = document;

    return (
        <Link href={`/documents/${id}`}>
            <div className='bg-white text-black py-5 px-4 shadow-md rounded-[8px] cursor-pointer hover:bg-[#689bb2] hover:scale-[1.05] hover:text-white transition-all duration-500 w-100'>
                <IoDocumentTextOutline fontSize={25} />
                <h3 className='font-bold'>{title}</h3>
                <p className='hover:text-white'>Modified {humanDateFormat(last_edited)}</p>
            </div>
        </Link>
    )
}

export default DocumentCard;