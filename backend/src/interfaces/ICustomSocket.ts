import { Socket } from "socket.io";

export interface ICustomSocket extends Socket {
    documentId?: string;
    userId?: string;
}
