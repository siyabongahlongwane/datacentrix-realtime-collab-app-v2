export interface IDocumentCard {
    id: string;
    title: string;
    last_edited: string;
    owner_id?: number
    owner?: {
        first_name: string;
        last_name: string;
        email: string;
    } 
}