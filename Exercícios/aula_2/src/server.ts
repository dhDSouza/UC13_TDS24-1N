import express, { Application, Request, Response, NextFunction } from "express";

const app: Application = express();
const PORT: number = 3000;

app.use(express.json());

// Exercício 2

function horarioMiddleware(req: Request, res: Response, next: NextFunction): void {
    const data: Date = new Date();
    console.log(`Requisição feita em: ${data}`);
    next();
}

app.use(horarioMiddleware);

// Exercício 5 - Bônus

function bloqueioHorarioMiddleware(req: Request, res: Response, next: NextFunction): Response | void {
    const data: Date = new Date();

    if (data.getHours() >= 0 && data.getHours() <= 6) {
        return res.status(403).json({ mensagem: "Acesso Negado!" })
    }
    next();
}

app.use(bloqueioHorarioMiddleware);

// Exercício 1

app.get("/sobre", (req: Request, res: Response): Response => {
    return res.status(200).json({ nome: "Daniel", idade: 29, descricao: "Professor de Programação" })
});

// Exercício 3

app.post("/comentarios", (req: Request, res: Response): Response => {
    const texto: string = req.body.texto;

    if (texto == "" || !texto) {
        return res.status(400).json({ mensagem: "Campo texto é obrigatório!" })
    }

    return res.status(201).json({ mensagem: "Comentário realizado com sucesso!", comentario: texto })
});

// Exercício 4

app.delete("/:id", (req: Request, res: Response): Response => {
    const id: number = Number(req.params.id);

    if (!id) {
        return res.status(400).json({ mensagem: "ID é obrigatório!" })
    }

    return res.status(204).send();
});

// Iniciando o servidor
app.listen(PORT, (): void => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
})