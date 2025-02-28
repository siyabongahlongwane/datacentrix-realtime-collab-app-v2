import express, { Router } from 'express';
import { createNewUser, loginUser, getAllUsers, updateProfile } from '../controllers';
import { authHandler } from '../middleware';

const router: Router = express.Router();

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Missing required fields or invalid password format
 *       409:
 *         description: User already exists
 */
router.post('/register', createNewUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     tags: [User Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Missing required fields or invalid password format
 *       401:
 *         description: Unauthorized access
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /users/getall:
 *   get:
 *     summary: Get all users
 *     tags: [User Management]
 *     responses:
 *       200:
 *         description: User data retrieved successfully
 *       401:
 *         description: Unauthorized access
 */
router.get('/getall', authHandler, getAllUsers);

/**
 * @swagger
 * /users/update:
 *   put:
 *     summary: Update user profile
 *     tags: [User Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *       400:
 *         description: Missing required fields or invalid password format
 *       401:
 *         description: Unauthorized access
 */
router.put('/update', authHandler, updateProfile);


export default router;