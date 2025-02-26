import { useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";

interface ShareModalProps {
    onClose: () => void;
}

const collaborators = [
    { id: 1, first_name: "Siyabonga", last_name: "Hlongwane", email: "hlongwanesiyabonga6@gmail.com", role: "Owner" },
    { id: 2, first_name: "Abel", last_name: "Hlongwani", email: "abelH@datacentrix.co.za", role: "Editor" },
    { id: 3, first_name: "Garsen ", last_name: "Subramoney", email: "garsenS@datacentrix.co.za", role: "Viewer" }
];

const ShareModal = ({ onClose }: ShareModalProps) => {
    const [users, setUsers] = useState(collaborators);

    const updateUserRole = (id: number, role: string) => {
        setUsers(users.map(user => (user.id === id ? { ...user, role } : user)));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-[450px] p-5 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Share Document</h2>
                    <button onClick={onClose}>
                        <IoCloseCircleOutline className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                    </button>
                </div>

                <input
                    type="text"
                    placeholder="Invite people to this document"
                    className="w-full p-2 border rounded-md mb-4"
                />

                <h3 className="text-sm font-semibold text-gray-600 mb-2">People with access</h3>
                <div className="max-h-[300px] overflow-y-auto">
                {users.map(user => (
                    <div key={user.id} className="flex justify-between items-center p-2">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#005d87] rounded-full flex items-center justify-center">
                                <span className="text-lg text-white font-semibold">{user.first_name[0]}</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium">{user.first_name}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                        </div>
                        <select
                            value={user.role}
                            onChange={e => updateUserRole(user.id, e.target.value)}
                            className="border rounded px-2 py-1 text-sm"
                        >
                            <option>Editor</option>
                            <option>Viewer</option>
                        </select>
                    </div>
                ))}
                </div>

                <div className="flex justify-end items-center mt-4">
                    <button
                        onClick={onClose}
                        className="bg-[#005d87] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
