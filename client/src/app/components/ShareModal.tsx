import { useEffect, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import axiosInstance from "@/utilities/axiosInterceptor";
import { IUser } from "../interfaces/IUser";
import { useAuthStore } from "../store/useAuthStore";

interface ShareModalProps {
    onClose: () => void;
}

interface Collaborator {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: "Owner" | "Editor" | "Viewer";
}

const ShareModal = ({ onClose }: ShareModalProps) => {
    const [users, setUsers] = useState<Collaborator[]>([]);
    const [email, setEmail] = useState("");
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [role, setRole] = useState<"Editor" | "Viewer">("Viewer");
    const [allUsers, setAllUsers] = useState<IUser[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
    const { user: authUser } = useAuthStore();
    const [documentId] = useState<string>(window.location.href.split('/').pop() || "");

    useEffect(() => {
        const fetchCollaborators = async () => {
            try {
                const res = await axiosInstance.get(`/collaborator/getcollaborators/${documentId}`);
                const docMembers = res?.data?.collaborators?.map(({ user, role }: { user: IUser; role: string }) => ({
                    ...user,
                    role
                }));
                setUsers(docMembers);
            } catch (error) {
                console.error("Error fetching collaborators:", error);
            }
        };
        fetchCollaborators();
    }, [documentId]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axiosInstance.get(`/users/getall`);
                const availableUsers = res.data.users.filter((_user: IUser) => _user.id !== authUser?.id);
                setAllUsers(availableUsers);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, [authUser?.id]);

    const handleSearch = (query: string) => {
        setEmail(query);
        if (query.trim() === "") {
            setFilteredUsers([]);
            return;
        }

        if (allUsers.length === 0) {
            console.warn("No users available for filtering");
            return;
        }

        const lowerQuery = query.toLowerCase();

        // Exclude users who are already collaborators
        const usersWithAccessIds = new Set(users.map(user => user.id));
        const filtered = allUsers
            .filter(user => !usersWithAccessIds.has(user.id)) // Exclude existing collaborators
            .filter(user =>
                user.email.toLowerCase().includes(lowerQuery) ||
                `${user.first_name} ${user.last_name}`.toLowerCase().includes(lowerQuery) ||
                user.first_name.toLowerCase().includes(lowerQuery) ||
                user.last_name.toLowerCase().includes(lowerQuery)
            );

        console.log({ filtered });
        setFilteredUsers(filtered);
    };


    const selectUser = (user: IUser) => {
        setSelectedUser(user);
        setEmail(user.email);
        setFilteredUsers([]);
    };

    const addCollaborator = async () => {
        if (!selectedUser) return;
        try {
            await axiosInstance.post(`/collaborator/addcollaborator/`, {
                document_id: documentId,
                user_id: selectedUser.id,
                role
            });
            setUsers([...users, { ...selectedUser, role }]);
            setEmail("");
            setSelectedUser(null);
            setRole("Viewer");
        } catch (error) {
            console.error("Error adding collaborator:", error);
        }
    };

    const updateUserRole = async (userId: number, newRole: "Editor" | "Viewer") => {
        try {
            await axiosInstance.put(`/collaborator/changerole/${documentId}`, {
                document_id: documentId,
                user_id: userId,
                role: newRole
            });

            // Update local state
            setUsers(prevUsers => prevUsers.map(user =>
                user.id === userId ? { ...user, role: newRole } : user
            ));
        } catch (error) {
            console.error("Error updating role:", error);
        }
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

                <div className="relative mb-4">
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Invite people to this document"
                        className="w-full p-2 border rounded-md"
                    />
                    {filteredUsers.length > 0 && (
                        <ul className="absolute z-10 bg-white border w-full rounded-md shadow-md">
                            {filteredUsers.map(user => (
                                <li
                                    key={user.id}
                                    className="p-2 cursor-pointer hover:bg-gray-100"
                                    onClick={() => selectUser(user)}
                                >
                                    {user.first_name} {user.last_name} ({user.email})
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {selectedUser && (
                    <div className="flex items-center gap-2 mb-4">
                        <label className="text-sm font-medium">Role:</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value as "Editor" | "Viewer")}
                            className="p-2 border rounded-md"
                        >
                            <option value="Editor">Editor</option>
                            <option value="Viewer">Viewer</option>
                        </select>
                    </div>
                )}

                <h3 className="text-sm font-semibold text-gray-600 mb-2">People with access</h3>
                <div className="max-h-[300px] overflow-y-auto">
                    {users.map(user => (
                        <div key={user.id} className="flex justify-between items-center p-2 border-b">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-[#005d87] rounded-full flex items-center justify-center">
                                    <span className="text-lg text-white font-semibold">{user?.first_name[0]}</span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{user?.first_name} {user?.last_name}</p>
                                    <p className="text-xs text-gray-500">{user?.email}</p>
                                </div>
                            </div>
                            {/* Role Selection */}
                            <select
                                value={user.role}
                                onChange={(e) => updateUserRole(user.id, e.target.value as "Editor" | "Viewer")}
                                className="border p-1 rounded-md text-sm"
                                disabled={user.id === authUser?.id}
                            >
                                <option value="Editor">Editor</option>
                                <option value="Viewer">Viewer</option>
                            </select>
                        </div>
                    ))}
                </div>


                {selectedUser && <div className="flex justify-end items-center mt-4">
                    <button
                        onClick={addCollaborator}
                        className="bg-[#005d87] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        disabled={!selectedUser}
                    >
                        Done
                    </button>
                </div>}
            </div>
        </div>
    );
};

export default ShareModal;
