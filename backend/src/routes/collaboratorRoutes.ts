import express from 'express';
import { addCollaborator, changeCollaboratorRole, removeCollaborator, getCollaborators } from '../controllers/';
import { authHandler } from '../middleware';
import { authorizeEditCollaborators } from '../middleware/authHandler';

const router = express.Router();

router.use(authHandler)

router.route('/getcollaborators/:document_id').get(getCollaborators);
router.route('/addcollaborator').post(addCollaborator);
router.route('/removecollaborator/:document_id').delete(authorizeEditCollaborators('Owner'), removeCollaborator);
router.route('/changerole/:document_id').put(authorizeEditCollaborators('Owner'), changeCollaboratorRole);


export default router;