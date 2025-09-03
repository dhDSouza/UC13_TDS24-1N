import { Request, Response } from "express";
import { UserRepository } from "../repositories/UserRepository";

const userRepository = new UserRepository();

export class UserController {
  
  // Apenas admins podem listar todos os usuários
  async listAll(req: Request, res: Response): Promise<Response> {
    try {
      const users = await userRepository.findAll();
      return res.json(users);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Apenas admins podem listar todos com posts
  async list(req: Request, res: Response): Promise<Response> {
    try {
      const users = await userRepository.findAllWithPosts();
      return res.json(users);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Mostra perfil próprio, ou outro se admin
  async show(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id) || req.user.id;

      if (req.user.role !== "admin" && id !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      const user = await userRepository.findByIdWithPosts(id);
      if (!user) return res.status(404).json({ message: "User not found" });

      return res.json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Criação de usuário (signup ou admin)
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res
          .status(400)
          .json({ message: "Name, email and password are required" });
      }

      const userExists = await userRepository.findByEmail(email);
      if (userExists) {
        return res.status(409).json({ message: "Email already in use" });
      }

      const user = await userRepository.createAndSave({
        name,
        email,
        password,
      });
      return res.status(201).json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Atualiza perfil próprio ou outro se admin
  async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id) || req.user.id;

      if (req.user.role !== "admin" && id !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      const user = await userRepository.findById(id);
      if (!user) return res.status(404).json({ message: "User not found" });

      const { name, email, password } = req.body;

      if (name) user.name = name;
      if (password) user.password = password; // hash via TypeORM Hook
      if (email) {
        const emailExists = await userRepository.findByEmail(email);
        if (emailExists && emailExists.id !== user.id) {
          return res.status(409).json({ message: "Email already in use" });
        }
        user.email = email;
      }

      const updatedUser = await userRepository.save(user);
      return res.json(updatedUser);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Deleta perfil próprio ou outro se admin
  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id) || req.user.id;

      if (req.user.role !== "admin" && id !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      const user = await userRepository.findById(id);
      if (!user) return res.status(404).json({ message: "User not found" });

      await userRepository.removeUser(user);
      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
