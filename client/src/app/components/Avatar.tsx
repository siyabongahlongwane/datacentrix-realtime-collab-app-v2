import React, { useEffect, useState } from 'react'
import { IAvatar } from '../interfaces/IAvatar'
import { useAuthStore } from '../store/useAuthStore';

const Avatar = ({ width, height, bg, fontSize }: IAvatar) => {
    const { user } = useAuthStore();

    const [first_name, setFirstName] = useState('-');
    const [last_name, setlastName] = useState('-');
    
    useEffect(() => {
        setFirstName(user?.first_name || '');
        setlastName(user?.last_name || '');
    }, [user?.first_name, user?.last_name])

    return (
        <div className={`${bg} ${width} ${height} rounded-full flex items-center justify-center`}>
            <span className='text-white' style={{ fontSize: `${fontSize}px` }}>{`${first_name[0]}${last_name[0]}`}</span>
        </div>
    )
}

export default Avatar