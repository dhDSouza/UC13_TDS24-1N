import { Request, Response } from "express";
import { Product, produtos } from "../models/Product";


export class ProductController {

  createProduct(req: Request, res: Response): Response {
    const { id, nome, preco } = req.body;

    if (!id || !nome || !preco) {
      return res
        .status(400)
        .json({ mensagem: "Id, nome, preco precisam ser informados!" });
    }

    const produto = new Product(id, nome, preco);
    produtos.push(produto);

    return res
      .status(201)
      .json({ mensagem: "Produto criado com sucesso!", produto: produto });
  }

  listAllProducts(req: Request, res: Response): Response {
    return res.status(200).json({ products: produtos });
  }

  updateProduct(req: Request, res: Response): Response {
    const id: number = Number(req.params.id);
    const { nome, preco } = req.body;

    if (!nome || !preco) {
      return res
        .status(400)
        .json({ mensagem: "Nome e preco são obrigatórios!" });
    }

    let produto = produtos.find((product) => product.id === id);

    if (!produto)
      return res.status(404).json({ mensagem: "Produto não encontrado!" });

    produto.nome = nome;
    produto.preco = preco;

    return res
      .status(200)
      .json({
        mensagem: "Produto atualizado com sucesso!",
        produto_atualizado: produto,
      });
  }

  deleteProduct(req: Request, res: Response): Response {
    const id: number = Number(req.params.id);

    let index = produtos.findIndex((product) => product.id === id);

    if (index === -1) {
      return res.status(404).json({ mensagem: "Produto não encontrado" });
    }

    produtos.splice(index, 1);
    return res.status(204).send();
  }
}
