import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/db';
import asyncHandler from 'express-async-handler';
import redisClient from '../../config/redis';

export const addCollaborator = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { document_id, user_id, role } = req.body;

    if (!document_id || !user_id) {
        const error = new Error('Document ID and User ID are required');
        Object.assign(error, { status: 400 });
        throw error;
    }

    try {
        const document = await prisma.document.findUnique({
            where: { id: document_id },
            include: { owner: true },
        });

        if (!document) {
            const error = new Error('Document not found');
            Object.assign(error, { status: 404 });
            throw error;
        }

        const existingCollaborator = await prisma.collaborator.findFirst({
            where: { document_id, user_id },
        });

        if (existingCollaborator) {
            const error = new Error('User is already a collaborator');
            Object.assign(error, { status: 400 });
            throw error;
        }

        await prisma.collaborator.create({
            data: { document_id, user_id, role: role || 'Viewer' },
        });

        const cacheKey = `documents:collaborators:${document_id}`;
        await redisClient.del(cacheKey);

        res.status(201).json({ success: true, msg: 'Collaborator added successfully' });
    } catch (error: any) {
        next(error);
    }
});

export const removeCollaborator = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { document_id, user_id } = req.body;

    if (!document_id || !user_id) {
        const error = new Error('Document ID and User ID are required');
        Object.assign(error, { status: 400 });
        throw error;
    }

    try {
        const document = await prisma.document.findUnique({
            where: { id: document_id },
            include: { owner: true },
        });

        if (!document) {
            const error = new Error('Document not found');
            Object.assign(error, { status: 404 });
            throw error;
        }

        const existingCollaborator = await prisma.collaborator.findFirst({
            where: { document_id, user_id },
        });

        if (!existingCollaborator) {
            const error = new Error('User is not a collaborator');
            Object.assign(error, { status: 400 });
            throw error;
        }

        await prisma.collaborator.deleteMany({
            where: { document_id, user_id },
        });

        const cacheKey = `documents:collaborators:${document_id}`;
        await redisClient.del(cacheKey);

        res.status(200).json({ success: true, msg: 'Collaborator removed successfully' });
    } catch (error: any) {
        next(error);
    }
});

export const changeCollaboratorRole = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { document_id, user_id, role } = req.body;

    if (!document_id || !user_id || !role) {
        const error = new Error('Document ID, User ID, and Role are required');
        Object.assign(error, { status: 400 });
        throw error;
    }

    try {
        const document = await prisma.document.findUnique({
            where: { id: document_id },
            include: { owner: true },
        });

        if (!document) {
            const error = new Error('Document not found');
            Object.assign(error, { status: 404 });
            throw error;
        }

        const existingCollaborator = await prisma.collaborator.findFirst({
            where: { document_id, user_id },
        });

        if (!existingCollaborator) {
            const error = new Error('User is not a collaborator');
            Object.assign(error, { status: 400 });
            throw error;
        }

        await prisma.collaborator.updateMany({
            where: { document_id, user_id },
            data: { role },
        });

        const cacheKey = `documents:collaborators:${document_id}`;
        await redisClient.del(cacheKey);

        res.status(200).json({ success: true, msg: 'Collaborator role updated successfully' });
    } catch (error: any) {
        next(error);
    }
});

export const getCollaborators = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { document_id } = req.params;

    if (!document_id) {
        const error = new Error('Document ID is required');
        Object.assign(error, { status: 400 });
        throw error;
    }

    try {
        const cacheKey = `documents:collaborators:${document_id}`;
        const cachedData = await redisClient.get(cacheKey);

        if (cachedData) {
            res.status(200).json({ success: true, collaborators: JSON.parse(cachedData) });
            return
        }

        const collaborators = await prisma.collaborator.findMany({
            where: { document_id: +document_id },
            include: { user: { select: { id: true, email: true, first_name: true, last_name: true } } },
        });

        if (!collaborators.length) {
            res.status(200).json({ success: true, collaborators: [] });
            return
        }

        await redisClient.set(cacheKey, JSON.stringify(collaborators), { 'EX': 300 });

        res.status(200).json({ success: true, collaborators });
    } catch (error: any) {
        next(error);
    }
});
