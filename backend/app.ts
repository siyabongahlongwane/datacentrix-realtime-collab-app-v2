import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, 'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE' }));
app.use(express.json({ limit: '1mb' }));

// Test route to determine whether the server is up
app.get('/', (req: Request, res: Response) => {
    res.send('Collab Server Is Up.');
});

export { app };