import { useState } from "react";

export default function DocumentNameInput() {
    const [fileName, setFileName] = useState("Untitled Document");
    const [editing, setEditing] = useState(false);
    const [tempName, setTempName] = useState(fileName);

    const handleBlur = () => {
        if (!tempName.trim()) setTempName(fileName);
        else {
            setFileName(tempName);
        }
        setEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleBlur();
        } else if (e.key === "Escape") {
            setTempName(fileName);
            setEditing(false);
        }
    };

    return (
        <div className="relative">
            {editing ? (
                <input
                    type="text"
                    className="w-48 px-2 py-1 text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                />
            ) : (
                <div
                    className="w-48 px-2 py-1 font-medium text-lg text-white border border-white truncate cursor-pointer hover:text-black hover:bg-gray-100 rounded"
                    onClick={() => setEditing(true)}
                >
                    {fileName}
                </div>
            )}
        </div>
    );
}
