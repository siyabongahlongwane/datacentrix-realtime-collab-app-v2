import { createServer } from 'http';
import { Server } from 'socket.io';
import { app, prisma, redisClient } from '../../app';
import Delta from 'quill-delta';
import { ICustomSocket } from '../interfaces/ICustomSocket';
import { checkSocketAuthSession } from '../middleware';

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

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

io.on('connection', (socket: ICustomSocket) => {
    console.log('New client connected attempt to connect');

    socket.on('get-document', async ([documentId, userId]: [string, string]) => {

        checkSocketAuthSession(socket, documentId);
        console.log(`Fetching document ${documentId}`);

        try {
            let document = await redisClient.get(`document:${documentId}`);
            if (!document) {
                const doc = await prisma.document.findUnique({ where: { id: +documentId } });

                if (doc) {
                    document = JSON.stringify(doc.content);
                    await redisClient.set(`document:${documentId}`, document, { EX: 600 });
                } else {
                    socket.emit('error', { message: `Document with id '${documentId}' not found`, redirect: true });
                    return;
                }
            }

            // // Check if user attempting to join is owner or at least a collaborator
            const docAssoc = await prisma.document.findFirst({ where: { id: +documentId }, select: { title: true, collaborators: true } }) as { title: string, collaborators: any[] };

            const existingCollaborator = docAssoc?.collaborators?.find(collaborator => collaborator.user_id === +userId);

            if (!existingCollaborator) {
                console.error('error', 'You are not authorized to view this document');
                socket.emit('error', { message: 'You are not authorized to view this document', redirect: true });
                return;
            }

            socket.emit('load-document', { doc: JSON.parse(document), title: docAssoc.title, role: existingCollaborator?.role });
        } catch (error) {
            console.error('Error fetching document:', error);
        }
    });


    socket.on('send-changes', async ({ documentId, delta: changes }: any) => {
        checkSocketAuthSession(socket, documentId);
        console.log(`Processing changes for document ${documentId}`);
        console.log('Changes:', changes);

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

            console.log('Transformed changes:', transformedChanges);
            console.log('documentId', documentId);

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
        checkSocketAuthSession(socket, documentId);

        // console.log(`Saving document ${documentId}`);

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

            console.log(`Saving document ${documentId}`);

            // Save to Database
            await prisma.document.update({
                where: { id: +documentId },
                data: { content, last_edited: new Date() },
            }).then(result => {
                console.log('RESULT', { result })
            });

            // Clear Redis deltas after saving
            await redisClient.del(`deltas:${documentId}`);
            await redisClient.set(`document:${documentId}`, JSON.stringify(content), { EX: 600 });

        } catch (error) {
            console.error('Error saving document:', error);
        }
    });

    socket.on('update-document-title', async ({ documentId, title }: { documentId: string, title: string }) => {
        checkSocketAuthSession(socket, documentId);

        try {
            const updatedDocument = await prisma.document.update({
                where: { id: +documentId },
                data: { title },
            });

            if (updatedDocument) {
                io.to(documentId).emit('document-title-updated', { documentId, title });
            }
        } catch (error) {
            console.error('Error updating document title:', error);
            socket.emit('error', { message: 'Failed to update document title' });
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
