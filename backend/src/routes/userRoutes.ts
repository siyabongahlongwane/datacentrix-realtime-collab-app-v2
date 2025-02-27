import express, { Router } from 'express';
import { createNewUser, loginUser, getAllUsers, updateProfile } from '../controllers';
import { authHandler } from '../middleware';

const router: Router = express.Router();

router.post('/register', createNewUser);
router.post('/login', loginUser);
router.get('/getall', authHandler, getAllUsers);
router.put('/update', authHandler, updateProfile);

export default router;