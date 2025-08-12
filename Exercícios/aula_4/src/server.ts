import express, { Application } from "express";
import userRoutes from "./routes/userRoutes";

const app: Application = express();
const PORT: number = 3000;

app.use(express.json()); // DEFINE QUE MINHA API TRABALHA COM JSON

app.use(userRoutes); // USANDO AS ROTAS DE USUÁRIO NA APLICAÇÃO

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
