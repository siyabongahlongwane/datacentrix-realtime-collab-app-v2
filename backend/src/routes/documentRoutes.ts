import express from 'express';
import { getAllDocuments, getDocument, createDocument } from '../controllers/documentController';
import { authHandler } from '../middleware';

const router = express.Router();

router.use(authHandler)

router.get('/getall', getAllDocuments);
router.get('/getsingle/:id', getDocument);
router.post('/create-document', createDocument);

export default router;