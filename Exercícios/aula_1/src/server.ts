import express, { Application, Request, Response } from "express";

const app: Application = express(); // Tipando 'app' como 'Application'
const PORT: number = 3000; // Tipagem da porta como número

// Middleware para permitir que o Express interprete JSON
app.use(express.json());

// Exercício 1

app.get("/", (req: Request, res: Response): Response => {
  return res.send("Servidor está funcionando perfeitamente 🚀");
});

// Exercício 2

app.get("/:meunome", (req: Request, res: Response): Response => {
    const nome: string = req.params.meunome;
    return res.send(`Olá, meu nome é ${nome}!`);
})


// Iniciando o servidor
app.listen(PORT, (): void => {
  console.log(`🔥 Servidor rodando em http://localhost:${PORT}`);
});
