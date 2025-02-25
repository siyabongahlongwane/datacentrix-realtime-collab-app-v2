'use client'

import React from 'react'
import logo from '../../../public/datacentrix-logo.png';
import Image from 'next/image';
import Searchbar from './Searchbar';
import Avatar from './Avatar';
import { FaShare } from "react-icons/fa";
import Link from 'next/link';
const Header = ({ showShareBtn, showSearchbar }: { showSearchbar?: boolean, showShareBtn?: boolean }) => {
    return (
        <div className='bg-white h-16 flex items-center px-4 datacentrix-header'>
            <div className="flex items-center justify-between w-full">
                <Link href={'/documents'}>
                    <Image src={logo} alt="Logo" width={180} />
                </Link>
                {showSearchbar && <Searchbar />}
                <div className="flex gap-3">
                    {
                        showShareBtn && <button className='bg-[#005d87] text-white px-4 py-2 rounded-lg hover:opacity-80 transition-opacity duration-300'>
                            <div className="flex gap-2 items-center">
                                <FaShare /> Share
                            </div>
                        </button>

                    }
                    <Avatar width='w-10' height='h-10' bg='bg-[#005d87]' fontSize={14} />
                </div>
            </div>
        </div>
    )
}

export default Header