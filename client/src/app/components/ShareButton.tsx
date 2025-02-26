import { useState } from "react";
import { FaShare } from "react-icons/fa";
import ShareModal from "./ShareModal";
const ShareButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button onClick={() => setIsOpen(true)} className='bg-[#005d87] text-white px-4 py-2 rounded-lg hover:opacity-80 transition-opacity duration-300'>
                <div className="flex gap-2 items-center">
                    <FaShare /> Share
                </div>
            </button>
            {isOpen && <ShareModal onClose={() => setIsOpen(false)} />}
        </>
    )
}

export default ShareButton


