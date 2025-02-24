import express, { Router } from 'express';
import { createNewUser } from '../controllers';

const router: Router = express.Router();

router.post('/register', createNewUser);

export default router;