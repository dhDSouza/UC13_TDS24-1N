import express, { Application, Request, Response } from "express";
import { connection } from "./database/connection";

const app: Application = express();
app.use(express.json());

app.get("/", async (req: Request, res: Response): Promise<Response> => {
  const [rows] = await connection.query("SELECT NOW() as hora_atual");
  return res.json(rows);
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
