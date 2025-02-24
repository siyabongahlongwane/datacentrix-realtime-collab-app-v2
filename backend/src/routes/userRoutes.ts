import express, { Router } from 'express';
import { createNewUser, loginUser } from '../controllers';

const router: Router = express.Router();

router.post('/register', createNewUser);
router.post('/login', loginUser);

export default router;