import { humanDateFormat } from "@/utilities/transformDate";
import { IDocumentCard } from "./DocumentCard"
import { IoDocumentTextOutline } from "react-icons/io5";
import Avatar from "./Avatar";
import Link from "next/link";
import axios from 'axios';
import { useState } from 'react';
import { useAuthStore } from "../store/useAuthStore";
import { useRouter } from "next/navigation";
import { useDocumentStore } from "../store/useDocumentStore";

interface IDocumentTableViewProps {
    title: string,
    documents: IDocumentCard[],
    showAddBtn?: boolean,
    error: string
}
const DocumentsTableView = ({ title, documents: initialDocuments, showAddBtn, error: initialError }: IDocumentTableViewProps) => {
    console.log(initialDocuments)
    const { setDocuments } = useDocumentStore();
    const [error, setError] = useState<string>(initialError);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const { user } = useAuthStore(state => state);
    const router = useRouter();

    const createNewDocument = async () => {
        try {
            setIsCreating(true);
            setError('');
            const response = await axios.post<IDocumentCard>(`${process.env.NEXT_PUBLIC_SERVER_URL}/documents/create-document`, { owner_id: user?.id });
            const newDoc = response.data;
            setDocuments([newDoc, ...initialDocuments]);
            router.push(`/documents/${newDoc.id}`);
        } catch (err) {
            console.error('Error creating new document:', err);
            setError('Failed to create a new document. Please try again.');
        } finally {
            setIsCreating(false);
        }
    }

    return (
        <div className='max-h-[320px] overflow-y-auto'>
            <div className="flex justify-between items-center">
                <h1 className='font-bold text-xl text-white'>{title}</h1>
                {showAddBtn && (
                    <button
                        onClick={createNewDocument}
                        className='bg-white p-2 rounded-lg text-[#000] font-semibold hover:bg-[#689bb2] hover:text-white hover:border-white transition-all duration-500 border-black border-[2px]'
                        disabled={isCreating}
                    >
                        {isCreating ? 'Creating...' : '+ Create New Document'}
                    </button>
                )}
            </div>

            {error && <div className='text-red-400'>{error}</div>}

            {!initialDocuments.length ? (
                <div className='text-white'>No documents found</div>
            ) : (
                <div className='flex flex-wrap gap-4 mt-4 box-border'>
                    <div className="w-full border border-gray-200 rounded-lg shadow-sm">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-100 text-gray-600 text-sm">
                                <tr>
                                    <th className="py-3 w-[40%] px-4 text-left">Name</th>
                                    <th className="py-3 w-[20%] px-4 text-left">Owner</th>
                                    <th className="py-3 w-[20%] px-2 text-left">Last Modified</th>
                                    <th className="py-3 w-[20%] px-2 text-left">File Size</th>
                                </tr>
                            </thead>
                        </table>

                        <div className="max-h-[140px] overflow-y-auto">
                            <table className="min-w-full bg-white">
                                <tbody className="divide-y">
                                    {initialDocuments.map((document) => (
                                        <tr key={document.id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 w-[40%] px-4 flex items-center space-x-2">
                                                <IoDocumentTextOutline color="#000" fontSize={20} />
                                                <Link className="text-blue-600 font-medium cursor-pointer hover:scale-[1.05] transition-all duration-500" href={`/documents/${document.id}`}>{document.title}</Link>
                                            </td>
                                            <td className="py-3 w-[20%] px-4">
                                                <div className="flex items-center space-x-2">
                                                    <Avatar width='w-7' height='h-7' bg='bg-[#005d87]' fontSize={10} />
                                                    <small className="text-gray-600 font-semibold">Me</small>
                                                </div>
                                            </td>
                                            <td className="py-3 w-[20%] px-4 text-gray-600">{humanDateFormat(document.last_edited)}</td>
                                            <td className="py-3 w-[20%] px-4 text-gray-600">2.4 MB</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DocumentsTableView