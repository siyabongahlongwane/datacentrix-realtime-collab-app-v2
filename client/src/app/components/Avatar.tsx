import React, { useEffect, useRef, useState } from 'react';
import { IAvatar } from '../interfaces/IAvatar';
import { useAuthStore } from '../store/useAuthStore';
import { FaFileAlt, FaSignOutAlt, FaUser } from 'react-icons/fa';
import Link from 'next/link';

const Avatar = ({ width, height, bg, fontSize }: IAvatar) => {
  const { user, logout } = useAuthStore();
  const [initials, setInitials] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInitials(`${user?.first_name[0]}${user?.last_name[0]}`);
  }, [user]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    logout();
    // Redirect to login page or perform other logout actions
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={`${bg} ${width} ${height} rounded-full flex items-center justify-center cursor-pointer`}
        onClick={toggleDropdown}
      >
        <span className='text-white' style={{ fontSize: `${fontSize}px` }}>{initials}</span>
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