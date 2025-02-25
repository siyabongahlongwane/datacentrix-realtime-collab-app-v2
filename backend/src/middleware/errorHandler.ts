import { Request, Response, NextFunction } from 'express';

interface Error {
    status?: number;
    message?: string;
}

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    console.error(`[Error] ${status} - ${message}`);

    res.status(status).json({
        success: false,
        message,
    });
};

export { errorHandler };