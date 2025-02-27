import React from 'react'
import { IActiveUserBadge } from '../interfaces/IActiveUserBadge'

const ActiveUsersList = ({ activeUsers }: { activeUsers: IActiveUserBadge[] }) => {
    console.log(activeUsers)
    return (
        <div className="flex gap-2 items-center">
            <span className="text-white">Active Users:</span>
            <div className="flex gap-1">
                {activeUsers?.slice(0, 3).map((user, index) => (
                    <div key={index} className="relative flex items-center">
                        <div className="group relative flex items-center justify-center w-10 h-10 bg-blue-500 text-white font-bold rounded-full shadow-md cursor-pointer">
                            {user?.first_name[0]}{user?.last_name[0]}
                            <span className="absolute left-1/2 bottom-full mb-2 w-auto px-3 py-1 text-sm text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1/2 whitespace-nowrap">
                                {user?.first_name} {user?.last_name}
                            </span>
                        </div>
                    </div>
                ))}
                {activeUsers?.length > 5 && (
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-600 text-white font-bold rounded-full shadow-md">
                        +{activeUsers.length - 5}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ActiveUsersList