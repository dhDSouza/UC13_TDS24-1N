import { Request, Response } from 'express';
import { connection } from '../config/database';

export class UserController {
  async list(req: Request, res: Response): Promise<Response> {
    const [rows] = await connection.query('SELECT * FROM usuarios');
    return res.status(200).json(rows);
  }

  async getById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const [rows]: any = await connection.query('SELECT * FROM usuarios WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }
    return res.status(200).json(rows[0]);
  }

  // Exercício 2 - Rota para buscar por nome
  async getByName(req: Request, res: Response): Promise<Response> {
    const nome: string = String(req.query.nome);
    const [rows]: any = await connection.query('SELECT * FROM usuarios WHERE nome = ?', [nome]);
    if (rows.length === 0) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }
    return res.status(200).json(rows[0]);
  }

  async create(req: Request, res: Response): Promise<Response> {
    const { nome, email } = req.body;

    // Exercício 3 - Verificação de email existente

    const [existente]: any = await connection.query('SELECT * FROM usuarios WHERE email = ?', [email]);

    if (existente.length > 0) {
        return res.status(409).json({ mensagem: "Este email já está em uso!" });
    }

    await connection.query('INSERT INTO usuarios (nome, email) VALUES (?, ?)', [nome, email]);
    return res.status(201).json({ mensagem: 'Usuário criado com sucesso!' });
  }

  // Exercício 4 - Rota de Login
  async login(req: Request, res: Response): Promise<Response> {
    const { nome, email } = req.body;

    const [rows]: any = await connection.query('SELECT * FROM usuarios WHERE nome = ? AND email = ?', [nome, email])

    if (rows.length === 0) {
        return res.status(401).json({ mensagem: "Acesso Negado! Credenciais inválidas!" })
    }

    return res.status(200).json({ mensagem: "Login efetuado com sucesso!" })
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { nome, email } = req.body;
    await connection.query('UPDATE usuarios SET nome = ?, email = ? WHERE id = ?', [nome, email, id]);
    return res.status(200).json({ mensagem: 'Usuário atualizado!' });
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    await connection.query('DELETE FROM usuarios WHERE id = ?', [id]);
    return res.status(204).send();
  }
}