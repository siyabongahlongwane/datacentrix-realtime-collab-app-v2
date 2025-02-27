import express from 'express';
import { getAllDocuments, getDocument, createDocument, getCollaboratorDocuments } from '../controllers/documentController';
import { authHandler } from '../middleware';

const router = express.Router();

router.use(authHandler)

router.get('/getall', getAllDocuments);
router.get('/getsingle/:id', getDocument);
router.get('/getshared', getCollaboratorDocuments);
router.post('/create-document', createDocument);

export default router;