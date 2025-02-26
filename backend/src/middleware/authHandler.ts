import { Request, Response, NextFunction } from 'express';
import JWT from 'jsonwebtoken';
import { prisma } from '../../app';
import asyncHandler from 'express-async-handler';
interface JwtPayload {
    id: string;
    email: string;
}

export interface ModifiedRequest extends Request {
    user?: import('@prisma/client').User;
}

const authHandler = asyncHandler(async (req: ModifiedRequest, res: Response, next: NextFunction): Promise<any> => {
    const authHeader = (req.headers as any)?.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = JWT.verify(token, process.env.JWT_SECRET!) as JwtPayload;

        const user = await prisma.user.findUnique({
            where: { id: +decoded.id },
        });

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error instanceof JWT.TokenExpiredError) {
            res.status(401)
            throw new Error('Token expired, please login');
        } else if (error instanceof JWT.JsonWebTokenError) {
            res.status(401)
            throw new Error('Invalid token provided');
        } else {
            res.status(500)
            throw new Error('Internal server error');
        }
    }
});

const authorizeEditCollaborators = (userRole: string) => {
    return (req: ModifiedRequest, res: Response, next: NextFunction) => {
        const collaborators = prisma.collaborator.findUnique({
            where: {
                user_id_document_id: {
                    document_id: +req.params.id,
                    user_id: req.user?.id!
                }
            }
        })

        console.log({ collaborators, userRole });
        if (true) {
            next()
        } else {
            res.status(403).json({ message: 'Forbidden, insufficient permissions' })
        }
    }
}

export { authHandler, authorizeEditCollaborators };