import { useState, useEffect } from "react";

interface DocumentNameInputProps {
  documentName: string;
  documentId: string;
  onUpdateFileName: (newFileName: string) => void;
}

export default function DocumentNameInput({ documentName, onUpdateFileName }: DocumentNameInputProps) {
  const [editing, setEditing] = useState(false);
  const [fileName, setFileName] = useState(documentName);

  useEffect(() => {
    setFileName(documentName);
  }, [documentName]);

  const handleBlur = () => {
    if (!fileName.trim()) {
      setFileName('Untitled Document');
    } else {
      onUpdateFileName(fileName);
    }
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleBlur();
    } else if (e.key === "Escape") {
      setFileName(documentName);
      setEditing(false);
    }
  };

  return (
    <div className="relative">
      {editing ? (
        <input
          type="text"
          className="w-60 px-2 py-1 text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <div
          className="w-60 px-2 py-1 font-medium text-lg text-white border border-white truncate cursor-pointer hover:text-black hover:bg-gray-100 rounded"
          onClick={() => setEditing(true)}
        >
          {fileName}
        </div>
      )}
    </div>
  );
}