import express from 'express';
import { addCollaborator, changeCollaboratorRole, removeCollaborator, getCollaborators } from '../controllers/';
import { authHandler } from '../middleware';
import { authorizeEditCollaborators } from '../middleware/authHandler';

const router = express.Router();

router.use(authHandler)

/**
 * @swagger
 * /api/collaborators/getcollaborators/{document_id}:
 *   get:
 *     summary: Get all collaborators for a document
 *     tags: [Collaborators]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: document_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of collaborators
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 collaborators:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           email:
 *                             type: string
 *                           first_name:
 *                             type: string
 *                           last_name:
 *                             type: string
 *       400:
 *         description: Document ID is required
 *       401:
 *         description: Unauthorized
 */
router.route('/getcollaborators/:document_id').get(getCollaborators);

/**
 * @swagger
 * /api/collaborators/addcollaborator:
 *   post:
 *     summary: Add a collaborator to a document
 *     tags: [Collaborators]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - document_id
 *               - user_id
 *             properties:
 *               document_id:
 *                 type: integer
 *               user_id:
 *                 type: integer
 *               role:
 *                 type: string
 *                 enum: [Viewer, Editor]
 *                 default: Viewer
 *     responses:
 *       201:
 *         description: Collaborator added successfully
 *       400:
 *         description: Invalid request / User already a collaborator
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Document not found
 */
router.route('/addcollaborator').post(addCollaborator);

/**
 * @swagger
 * /api/collaborators/removecollaborator/{document_id}:
 *   delete:
 *     summary: Remove a collaborator from a document
 *     tags: [Collaborators]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: document_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *             properties:
 *               user_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Collaborator removed successfully
 *       400:
 *         description: Invalid request / User not a collaborator
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not document owner
 *       404:
 *         description: Document not found
 */
router.route('/removecollaborator/:document_id').delete(authorizeEditCollaborators('Owner'), removeCollaborator);

/**
 * @swagger
 * /api/collaborators/changerole/{document_id}:
 *   put:
 *     summary: Change a collaborator's role
 *     tags: [Collaborators]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: document_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - role
 *             properties:
 *               user_id:
 *                 type: integer
 *               role:
 *                 type: string
 *                 enum: [Viewer, Editor]
 *     responses:
 *       200:
 *         description: Collaborator role updated successfully
 *       400:
 *         description: Invalid request / User not a collaborator
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not document owner
 *       404:
 *         description: Document not found
 */
router.route('/changerole/:document_id').put(authorizeEditCollaborators('Owner'), changeCollaboratorRole);

export default router;