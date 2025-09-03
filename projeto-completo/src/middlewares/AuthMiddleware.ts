import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../config/auth';

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export class AuthMiddleware {
    async authenticateToken(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Token not provided' });
        }

        try {
            const user = verifyToken(token);
            req.user = user;
            return next();
        } catch {
            return res.status(401).json({ message: 'Invalid token' });
        }
    }
    
    async isAdmin(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        if (req.user?.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        return next();
    }
}