import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/db';
import asyncHandler from 'express-async-handler';
import redisClient from '../../config/redis';
import { ModifiedRequest } from '../middleware/authHandler';

export const getDocument = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const documentId = +req.params.id;
    if (!documentId) {
      const error = new Error('id is required');

      Object.assign(error, { status: 400 });
      throw error;
    }
    const cacheKey = `document:${documentId}`;

    // Check if the document is in the cache
    const cachedDocument = await redisClient.get(cacheKey);
    if (cachedDocument) {
      res.json(JSON.parse(cachedDocument));
      return
    }

    // If not in cache, fetch from the database
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      const error = new Error('Document not found');
      Object.assign(error, { status: 404 });
      throw error;
    }

    // Cache the document
    await redisClient.set(cacheKey, JSON.stringify(document), { 'EX': 600 });

    res.json(document);
  } catch (error: any) {
    next(error);
  }
});

export const getAllDocuments = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.query;
    if (!id) {
      const error = new Error('id is required');

      Object.assign(error, { status: 400 });
      throw error;
    }

    const cacheKey = `documents:owner:${id}`;

    // Check if the documents are in the cache
    const cachedDocuments = await redisClient.get(cacheKey);
    if (cachedDocuments) {
      res.json(JSON.parse(cachedDocuments));
      return
    }

    // If not in cache, fetch from the database
    const documents = await prisma.document.findMany({
      where: { owner_id: +id },
    });

    // Cache the documents
    await redisClient.set(cacheKey, JSON.stringify(documents || []), { 'EX': 600 });

    res.json(documents || []);
  } catch (error: any) {
    next(error);
  }
});

export const createDocument = asyncHandler(async (req: ModifiedRequest, res: Response, next: NextFunction) => {
  const { owner_id } = req.body;
  if (!owner_id) {
    const error = new Error('Owner id field is required');
    Object.assign(error, { status: 400 });
    throw error;
  }

  try {
    const document = await prisma.document.create({
      data: {
        content: { ops: [] },
        owner_id,
        collaborators: { create: [] },
        cursor_positions: [],
        history: [],
      },
    });

    if (!document?.id) {
      const error = new Error('Document creation failed');
      Object.assign(error, { status: 500 });
      throw error;
    }

    await prisma.collaborator.create({
      data: {
        user_id: req.user?.id as number,
        document_id: document.id,
        role: "Owner",
      },
    });


    // Invalidate the cache for the owner's documents
    const cacheKey = `documents:owner:${owner_id}`;
    await redisClient.del(cacheKey);

    res.status(201).json({ success: true, msg: 'Document created successfully', id: document.id });
  } catch (error: any) {
    next(error);
  }
});