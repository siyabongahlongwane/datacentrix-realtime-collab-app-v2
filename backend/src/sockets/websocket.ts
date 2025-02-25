import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { app } from '../../app';

// WebSocket setup
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

interface CustomSocket extends Socket {
    documentId?: string;
}

io.on('connection', (socket: CustomSocket) => {
    console.log('New client connected');

    socket.on('get-document', async (documentId: string) => {
        socket.documentId = documentId;
        socket.join(documentId);
    });

    socket.on('disconnect', () => {
        console.log('a user disconnected');
    });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export { io as ws };