import { Request, Response } from "express";
import { UserRepository } from "../repositories/UserRepository";
import { generateToken } from "../config/auth";

import * as bcrypt from "bcryptjs";

const userRepository = new UserRepository();

export class AuthController {
    async login(req: Request, res: Response): Promise<Response> {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: "Email and password are required" });
            }

            const user = await userRepository.findByEmail(email);

            if (!user) {
                return res.status(401).json({ message: "Invalid email or password" });
            }

            const isValid = await bcrypt.compare(password, user.password);

            if (!isValid) {
                return res.status(401).json({ message: "Invalid email or password" });
            }

            const token = generateToken({ id: user.id, role: user.role });
            return res.status(200).json({ message: "Logged in successfully!", token: token });

        } catch(error) {
            console.error("Login error: ", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async me(req: Request, res: Response): Promise<Response> {
        try {
            const id = req.user.id;
            const user = await userRepository.findById(id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.json(user);
        } catch(error) {
            console.error("Me error: ", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async logout(req: Request, res: Response): Promise<Response> {
        try {
            return res.status(200).json({ message: "Logged out successfully" });
        } catch(error) {
            console.error("Logout error: ", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}