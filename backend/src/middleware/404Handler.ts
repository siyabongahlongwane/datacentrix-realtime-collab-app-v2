import { NextFunction, Request, Response } from 'express'

const notFound = (req: Request, res: Response, next: NextFunction) => {
    new Promise((resolve, reject) => {
        reject(new Error(`Route ${req.originalUrl} Not Found`))
    }).catch(next)
}

export { notFound }