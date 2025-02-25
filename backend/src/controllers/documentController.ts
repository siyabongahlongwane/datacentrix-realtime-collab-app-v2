import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/db';
import asyncHandler from 'express-async-handler';

export const getDocument = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const document = await prisma.document.findUnique({
      where: { id: +req.params.id },
    });

    if (!document) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    res.json(document);
  } catch (error: any) {
    next(error);
  }
});

export const getAllDocuments = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.query;
    if (!id) {
      res.status(400).json({ error: 'id is required' });
      return;
    }

    const documents = await prisma.document.findMany({
      where: { owner_id: +id },
    });

    if (!documents.length) {
      res.status(404).json({ error: 'No documents found' });
      return;
    }

    res.json(documents);
  } catch (error: any) {
    next(error);
  }
});

export const createDocument = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { owner_id } = req.body;
  if (!owner_id) {
    res.status(400).json({ error: 'id field is required' });
    return;
  }

  try {
    const document = await prisma.document.create({
      data: {
        content: { ops: [] },
        owner_id,
        collaborators: [],
        cursor_positions: [],
        history: [],
      },
    });

    if (!document?.id) {
      throw new Error('Document creation failed');
    }

    res.status(201).json({ success: true, msg: 'Document created successfully', id: document.id });
  } catch (error: any) {
    next(error);
  }
});