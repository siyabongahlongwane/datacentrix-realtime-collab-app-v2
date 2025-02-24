import { Request, Response } from 'express';
import { prisma } from '../../app';
import asyncHandler from 'express-async-handler';

export const getDocument = asyncHandler(async (req: Request, res: Response) => {
  try {
    const documents = await prisma.document.findUnique({
      where: { id: +req.params.id },
    });
    res.json(documents);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export const getAllDocuments = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    if (!id) {
      res.status(400).json({ error: 'id is required' });
      return;
    }
    const documents = await prisma.document.findMany({
      where: { owner_id: +id },
    });
    res.json(documents);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export const createDocument = asyncHandler(async (req: Request, res: Response) => {
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
        history: []
      },
    });

    res.status(201).json({ success: true, msg: 'Document created successfully', id: document.id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});