import express from 'express';
import { getAllDocuments, getDocument, getCollaboratorDocuments, createDocument } from '../controllers/documentController';
import { authHandler } from '../middleware';

const router = express.Router();

router.use(authHandler)

/**
 * @swagger
 * /documents/getall:
 *   get:
 *     summary: Get all documents owned by the authenticated user
 *     tags: [Documents]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of documents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   content:
 *                     type: object
 *       401:
 *         description: Unauthorized
 */
router.get('/getall', getAllDocuments);

/**
 * @swagger
 * /documents/getsingle/{id}:
 *   get:
 *     summary: Get a single document by ID
 *     tags: [Documents]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Document details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 content:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Document not found
 */
router.get('/getsingle/:id', getDocument);

/**
 * @swagger
 * /documents/getshared:
 *   get:
 *     summary: Get all documents shared with the authenticated user
 *     tags: [Documents]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of shared documents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   content:
 *                     type: object
 *       401:
 *         description: Unauthorized
 */
router.get('/getshared', getCollaboratorDocuments);

/**
 * @swagger
 * /documents/create-document:
 *   post:
 *     summary: Create a new document
 *     tags: [Documents]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 required: true
 *               content:
 *                 type: object
 *                 default: { ops: [] }
 *     responses:
 *       201:
 *         description: Document created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 content:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Invalid request body
 */
router.post('/create-document', createDocument);

export default router;