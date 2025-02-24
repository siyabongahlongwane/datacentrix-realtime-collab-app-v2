'use client'

import Header from '@/app/components/Header';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const DocumentsLayout = ({ children }: { children: React.ReactNode }) => {
    const { id: documentId } = useParams();
    const [showShareBtn, setShowShareBtn] = useState(false);
    const [showSearchbar, setShowSearchbar] = useState(false);

    useEffect(() => {
        if (documentId) {
            setShowShareBtn(true);
            setShowSearchbar(false);
        } else {
            setShowShareBtn(false);
            setShowSearchbar(true);
        }
    }, [documentId]);

    return (
        <>
            <Header showShareBtn={showShareBtn} showSearchbar={showSearchbar} />
            <div>{children}</div>
        </>
    );
};

export default DocumentsLayout;