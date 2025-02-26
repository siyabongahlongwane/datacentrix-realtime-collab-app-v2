import express from 'express';
import { addCollaborator, changeCollaboratorRole, removeCollaborator, getCollaborators } from '../controllers/';
import { authHandler } from '../middleware';
import { authorizeEditCollaborators } from '../middleware/authHandler';

const router = express.Router();

router.use(authHandler)

router.route('/getcollaborators/:documentId').get(authorizeEditCollaborators('Owner'), getCollaborators);
router.route('/addcollaborator/:documentId').post(authorizeEditCollaborators('Owner'), addCollaborator);
router.route('/removecollaborator/:documentId').delete(authorizeEditCollaborators('Owner'), removeCollaborator);
router.route('/changerole/:documentId').put(authorizeEditCollaborators('Owner'), changeCollaboratorRole);


export default router;