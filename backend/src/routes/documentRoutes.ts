import express from 'express';
import { getAllDocuments, getDocument, createDocument } from '../controllers/documentController';

const router = express.Router();

router.get('/getall', getAllDocuments);
router.get('/getsingle', getDocument);
router.post('/create-document', createDocument);

export default router;