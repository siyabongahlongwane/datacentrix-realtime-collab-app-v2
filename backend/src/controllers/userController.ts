import { Request, Response } from 'express';
import { prisma } from '../../app';
import asyncHandler from 'express-async-handler';

import { comparePasswords, hashPassword, validatePasswordParams } from '../utilities';
import { User } from '@prisma/client';
import JWT from 'jsonwebtoken';

export const createNewUser = asyncHandler(async (req: Request, res: Response) => {
    try {
        const hasMissingData = Object.values(req.body).some(val => !val);
        if (hasMissingData) {
            res.status(400).json({ error: 'Please fill in all required fields.' });
            return;
        }
        const { email, password } = req.body;

        if (!validatePasswordParams(password)) {
            res.status(400).json({
                error: 'Password must contain at least 8 characters, one uppercase letter, one number, and one special character.'
            });
            return;
        }

        const conflictingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (conflictingUser) {
            res.status(409).json({ error: 'User already exists' });
            return;
        }

        const hashedPassword = await hashPassword(req.body.password);

        const result = await prisma.user.create({ data: { ...req.body, password: hashedPassword } });
        if (result?.id) {
            const newUser = { ...result } as Partial<User>;
            delete newUser.password;
            res.status(201).json({ message: 'User created', user: newUser });
            return;
        }
        throw new Error('User registration failed');

    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
})

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
    try {
        const hasMissingData = Object.values(req.body).some(val => !val);
        if (hasMissingData) {
            res.status(400).json({ error: 'Both email and password are required.' });
            return;
        }
        const { email, password } = req.body;

        const result = await prisma.user.findUnique({
            where: { email }
        });

        if (!result) {
            res.status(401).json({ error: 'User not found' });
            return;
        }

        if (!(await comparePasswords(password, result.password))) {
            res.status(401).json({ error: 'Invalid credentials provided.' });
            return;
        }

        const user = { ...result } as Partial<User>;
        delete user.password;
        
        const access_token = JWT.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '4h' })
        res.json({ success: true, user, access_token });

    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
})