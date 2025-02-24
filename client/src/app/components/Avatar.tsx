import React from 'react'
import { IAvatar } from '../interfaces/IAvatar'

const Avatar = ({ width, height, bg, fontSize, initials }: IAvatar) => {
    return (
        <div className={`${bg} ${width} ${height} rounded-full flex items-center justify-center`}>
            <span className='text-white' style={{ fontSize: `${fontSize}px` }}>{initials}</span>
        </div>
    )
}

export default Avatar