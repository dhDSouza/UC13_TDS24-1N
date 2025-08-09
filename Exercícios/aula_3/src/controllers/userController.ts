import { Request, Response } from "express";
import { User, usuarios } from "../models/User";

export class UserController {
  createUser(req: Request, res: Response): Response {
    const { id, nome, email } = req.body;

    if (!id || !nome || !email) {
      return res
        .status(400)
        .json({ mensagem: "Id, nome, email precisam ser informados!" });
    }

    const usuario = new User(id, nome, email);
    usuarios.push(usuario);

    return res
      .status(201)
      .json({ mensagem: "Usuário criado com sucesso!", usuario: usuario });
  }

  listAllUsers(req: Request, res: Response): Response {
    return res.status(200).json({ users: usuarios });
  }

  updateUser(req: Request, res: Response): Response {
    const id: number = Number(req.params.id);
    const { nome, email } = req.body;

    if (!nome || !email) {
      return res
        .status(400)
        .json({ mensagem: "Nome e e-mail são obrigatórios!" });
    }

    let usuario = usuarios.find((user) => user.id === id);

    if (!usuario)
      return res.status(404).json({ mensagem: "Usuário não encontrado!" });

    usuario.nome = nome;
    usuario.email = email;

    return res
      .status(200)
      .json({
        mensagem: "Usuário atualizado com sucesso!",
        usuario_atualizado: usuario,
      });
  }

  deleteUser(req: Request, res: Response): Response {
    const id: number = Number(req.params.id);

    let index = usuarios.findIndex((user) => user.id === id);

    if (index === -1) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    usuarios.splice(index, 1);
    return res.status(204).send();
  }
}
