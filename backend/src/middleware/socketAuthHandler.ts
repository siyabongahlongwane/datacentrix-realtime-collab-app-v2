import JWT from 'jsonwebtoken';
import { ICustomSocket } from '../interfaces/ICustomSocket';

const checkSocketAuthSession = (socket: ICustomSocket, documentId: string) => {
    socket.join(documentId);
    const token = socket.handshake.auth.token;
    if (!token) {
        return socket.emit('error', { message: 'Authentication error: No token provided', clearData: true });
    }

    try {
        const decoded = JWT.verify(token, process.env.JWT_SECRET!) as { id: string };
        socket.userId = decoded.id;
    } catch (error) {
        console.error(error);
        if (error instanceof JWT.TokenExpiredError) {
            return socket.emit('error', { message: 'Authentication error: Token expired', clearData: true });
        } else if (error instanceof JWT.JsonWebTokenError) {
            return socket.emit('error', { message: 'Authentication error: Invalid token', clearData: true });
        } else {
            return socket.emit('error', { message: 'Authentication error: Internal server error', redirect: true, clearData: true });
        }
    }
}

export { checkSocketAuthSession };