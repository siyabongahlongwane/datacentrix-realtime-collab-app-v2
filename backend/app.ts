import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { prisma, db } from './config/db';
import { collaboratorRoutes, documentRoutes, userRoutes } from './src/routes';
import redisClient from './config/redis';
import { errorHandler, notFound } from './src/middleware';

dotenv.config();

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '1mb' }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/collaborator', collaboratorRoutes);

app.use(errorHandler); // Handle errors thrown in the app
app.use(notFound); // Handle invalid routes

export { app, prisma, db, redisClient };