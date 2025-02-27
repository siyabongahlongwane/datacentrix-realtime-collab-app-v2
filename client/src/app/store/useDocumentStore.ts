import { create } from 'zustand';
import { IDocumentCard } from '../interfaces/IDocumentCard';

interface DocumentStoreState {
    search: string;
    setSearch: (search: string) => void;
    documents: IDocumentCard[];
    setDocuments: (documents: IDocumentCard[]) => void;
    filteredDocuments: IDocumentCard[];
    filterDocuments: () => void;
}

export const useDocumentStore = create<DocumentStoreState>((set, get) => ({
    search: '',
    setSearch: (search) => set({ search }),
    documents: [],
    setDocuments: (documents) => set({ documents }),
    filteredDocuments: [],
    filterDocuments: () => {
        const { search, documents } = get();
        const filteredDocuments = documents?.sort((a, b) => {
            return new Date(b.last_edited).getTime() - new Date(a.last_edited).getTime();
        })?.filter((doc) => {
            if (!search) {
                return doc;
            }
            return doc.title.toLowerCase().includes(search.toLowerCase());
        });
        set({ filteredDocuments });
    },
}));