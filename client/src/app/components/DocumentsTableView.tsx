import { humanDateFormat } from "@/utilities/transformDate";
import { IoDocumentTextOutline } from "react-icons/io5";
import Link from "next/link";
import { useState } from 'react';
import { useAuthStore } from "../store/useAuthStore";
import { useRouter } from "next/navigation";
import { useDocumentStore } from "../store/useDocumentStore";
import { useToastStore } from "../store/useToastStore";
import axiosInstance from "@/utilities/axiosInterceptor";
import { IDocumentCard } from "../interfaces/IDocumentCard";

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

    const { toggleToast } = useToastStore();

    const createNewDocument = async () => {
        try {
            setIsCreating(true);
            setError('');
            const response = await axiosInstance.post<IDocumentCard>(`${process.env.NEXT_PUBLIC_SERVER_URL}/documents/create-document`, { owner_id: user?.id });
            const newDoc = response.data;
            setDocuments([newDoc, ...initialDocuments]);
            router.push(`/documents/${newDoc.id}`);
        } catch (err) {
            console.error('Error creating new document:', err);
            setError('Failed to create a new document. Please try again.');
            toggleToast({ message: 'Failed to create a new document. Please try again.', type: 'error', open: true });
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
                                    <th className="py-3 w-[20%] px-2 text-left"></th>
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
                                                    <div
                                                        className={`w-7 h-7 bg-[#005d87] rounded-full flex items-center justify-center cursor-pointer`}
                                                    >
                                                        <span className='text-white' style={{ fontSize: `10px` }}>
                                                            {
                                                                document?.owner_id == user?.id ? (`${user?.first_name[0]}${user?.last_name[0]}`) : (`${document.owner?.first_name[0]}${document.owner?.last_name[0]}`)
                                                            }
                                                        </span>
                                                    </div>
                                                    <small className="text-gray-600 font-semibold">{
                                                        document?.owner_id == user?.id ? 'Me' : (`${document.owner?.first_name} ${document.owner?.last_name}`)
                                                    }</small>
                                                </div>
                                            </td>
                                            <td className="py-3 w-[20%] px-4 text-gray-600">{humanDateFormat(document.last_edited)}</td>
                                            <td className="py-3 w-[20%] px-4 text-gray-600"></td>
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