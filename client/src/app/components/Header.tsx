'use client'

import React from 'react'
import logo from '../../../public/datacentrix-logo.png';
import Image from 'next/image';
import Searchbar from './Searchbar';
import Avatar from './Avatar';
import Link from 'next/link';
import ShareButton from './ShareButton';
const Header = ({ showShareBtn, showSearchbar }: { showSearchbar?: boolean, showShareBtn?: boolean }) => {
    return (
        <div className='bg-white h-16 flex items-center px-4 datacentrix-header position-sticky top-0 z-[10]'>
            <div className="flex items-center justify-between w-full">
                <Link href={'/documents'}>
                    <Image src={logo} alt="Logo" width={180} />
                </Link>
                {showSearchbar && <Searchbar />}
                <div className="flex gap-3">
                    {
                        showShareBtn && <ShareButton />

                    }
                    <Avatar width='w-10' height='h-10' bg='bg-[#005d87]' fontSize={14} />
                </div>
            </div>
        </div>
    )
}

export default Header