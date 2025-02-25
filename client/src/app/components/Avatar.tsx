import React, { useEffect, useState } from 'react';
import { IAvatar } from '../interfaces/IAvatar';
import { useAuthStore } from '../store/useAuthStore';
import { FaFileAlt, FaSignOutAlt, FaUser } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Avatar = ({ width, height, bg, fontSize }: IAvatar) => {
    const { user, logout } = useAuthStore();
    const [first_name, setFirstName] = useState('-');
    const [last_name, setLastName] = useState('-');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const router = useRouter();
    useEffect(() => {
        setFirstName(user?.first_name || '');
        setLastName(user?.last_name || '');
    }, [user?.first_name, user?.last_name]);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleLogout = () => {
        logout();

        router.push('/login');
    };

    return (
        <div className="relative">
            <div
                className={`${bg} ${width} ${height} rounded-full flex items-center justify-center cursor-pointer`}
                onClick={toggleDropdown}
            >
                <span className='text-white' style={{ fontSize: `${fontSize}px` }}>{`${first_name[0]}${last_name[0]}`}</span>
            </div>
            {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                    <Link href="/documents" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                        <FaFileAlt className="mr-2" />
                        Documents
                    </Link>
                    <Link href="/profile" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                        <FaUser className="mr-2" />
                        Profile
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                        <FaSignOutAlt className="mr-2" />
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default Avatar;