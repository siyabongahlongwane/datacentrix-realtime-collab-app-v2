import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { app, prisma, redisClient } from '../../app';
import Delta from 'quill-delta'; // Ensure installed: npm install quill-delta

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

// Helper function to apply operational transforms
const applyOT = (currentContent: any, changes: any) => {
    try {
        let content = new Delta(currentContent?.ops || []);
        let delta = new Delta(changes?.ops || []);
        return content.compose(delta);
    } catch (error) {
        console.error("Error applying OT:", error);
        return currentContent;
    }
};

io.on('connection', (socket: CustomSocket) => {
    console.log('New client connected');

    socket.on('get-document', async (documentId: string) => {
        console.log(`Fetching document ${documentId}`);
    
        try {
            let document = await redisClient.get(`document:${documentId}`);
            if (!document) {
                const doc = await prisma.document.findUnique({ where: { id: +documentId } });
    
                if (doc) {
                    document = JSON.stringify(doc.content);
                    await redisClient.set(`document:${documentId}`, document, { EX: 600 });
                } else {
                    document = JSON.stringify({ ops: [] }); // Initialize empty document
                }
            }
    
            socket.join(documentId);
            socket.emit('load-document', JSON.parse(document)); // ✅ Ensure correct JSON parsing
        } catch (error) {
            console.error('Error fetching document:', error);
        }
    });
    

    socket.on('send-changes', async ([documentId, changes]: any) => {
        console.log(`Processing changes for document ${documentId}`);
    
        try {
            let document = await redisClient.get(`document:${documentId}`);
            let currentContent = document ? JSON.parse(document) : { ops: [] };
    
            // Prevent duplicate deltas
            const lastDelta = await redisClient.lIndex(`deltas:${documentId}`, -1);
            if (lastDelta) {
                const lastDeltaParsed = JSON.parse(lastDelta.toString());
                if (JSON.stringify(lastDeltaParsed) === JSON.stringify(changes)) return;
            }
    
            // Apply Operational Transformation (OT)
            const transformedChanges = applyOT(currentContent, changes);
    
            // Save to Redis in order
            await redisClient.multi()
                .set(`document:${documentId}`, JSON.stringify(transformedChanges), { 'EX': 600 })
                .rPush(`deltas:${documentId}`, JSON.stringify(changes))
                .exec();
    
            // Send only the new delta, not the whole document
            socket.broadcast.to(documentId).emit('receive-changes', changes);
        } catch (error) {
            console.error('Error processing changes:', error);
        }
    });
    

    socket.on('save-document', async (documentId: string) => {
        console.log(`Saving document ${documentId}`);
    
        try {
            const deltas = await redisClient.lRange(`deltas:${documentId}`, 0, -1);
            if (deltas.length === 0) return;
    
            let contentString = await redisClient.get(`document:${documentId}`);
            let content = contentString ? JSON.parse(contentString) : { ops: [] };
    
            // Apply only new deltas
            deltas.forEach((delta: any) => {
                delta = typeof delta === 'string' ? JSON.parse(delta) : delta;
                content = applyOT(content, delta);
            });
    
            // Save to Database
            await prisma.document.update({
                where: { id: +documentId },
                data: { content, last_edited: new Date() },
            });
    
            // Clear Redis deltas after saving
            await redisClient.del(`deltas:${documentId}`);
            await redisClient.set(`document:${documentId}`, JSON.stringify(content), { EX: 600 });
    
        } catch (error) {
            console.error('Error saving document:', error);
        }
    });
    

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export { io as ws };
