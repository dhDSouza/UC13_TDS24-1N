import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import * as dotenv from "dotenv";

dotenv.config();

const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in .env file");
}

const secret: Secret = JWT_SECRET;

export function generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, secret, { expiresIn: "1h" })
}

export function verifyToken(token: string): JwtPayload | null {
    try {
        return jwt.verify(token, secret) as JwtPayload;
    } catch (error) {
        console.error("Token verification failed:", error);
        return null;
    }
}