import { Request, Response } from "express";
import { PostRepository } from "../repositories/PostRepository";
import { UserRepository } from "../repositories/UserRepository";

const postRepository = new PostRepository();
const userRepository = new UserRepository();

export class PostController {
  async list(req: Request, res: Response) {
    try {
      const posts = await postRepository.findAllWithUser();
      return res.json(posts);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async show(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const post = await postRepository.findByIdWithUser(Number(id));
      if (!post) return res.status(404).json({ message: "Post not found" });

      return res.json(post);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { title, content } = req.body;
      const userId = req.user.id;

      if (!title || !content) {
        return res
          .status(400)
          .json({ message: "Title and content are required" });
      }

      const user = await userRepository.findById(Number(userId));
      if (!user) return res.status(404).json({ message: "User not found" });

      const post = await postRepository.createAndSave({ title, content, user });
      return res.status(201).json(post);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const { title, content } = req.body;

      const post = await postRepository.findById(Number(id));
      if (!post) return res.status(404).json({ message: "Post not found" });

      // Permite apenas autor ou admin editar
      if (req.user.role !== "admin" && post.user?.id !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      if (title) post.title = title;
      if (content) post.content = content;

      const updatedPost = await postRepository.save(post);
      return res.json(updatedPost);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const post = await postRepository.findById(Number(id));
      if (!post) return res.status(404).json({ message: "Post not found" });

      // Permite apenas autor ou admin deletar
      if (req.user.role !== "admin" && post.user?.id !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      await postRepository.removePost(post);
      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
