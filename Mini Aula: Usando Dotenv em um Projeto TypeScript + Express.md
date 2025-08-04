# 🌱 **Mini Aula: Usando Dotenv em um Projeto TypeScript + Express**

## 🎯 Objetivo

Aprender a **esconder informações sensíveis** (como credenciais do banco de dados) usando o pacote **dotenv**, deixando o projeto mais seguro e organizado.

---

## 1️⃣ **O que é o dotenv?**

📦 O **dotenv** é um pacote que lê variáveis de ambiente de um arquivo `.env` e as disponibiliza no código através do objeto `process.env`.

🔑 **Por que usar?**

* Evita deixar senhas/usuários hardcoded no código.
* Facilita a troca de credenciais em diferentes ambientes (dev, homolog, production).
* Ajuda a manter boas práticas de segurança.

---

## 2️⃣ **Instalação**

No terminal:

```bash
npm install dotenv
```

---

## 3️⃣ **Criando o arquivo `.env`**

Na raiz do projeto, crie um arquivo chamado `.env`:

> [!NOTE]
> A `raiz do projeto` refere-se a pasta principal da aplicação, ou seja, fora da pasta `src`.   
> Jutamente com os arquivos `package.json`, `package-lock.json`, `tsconfig.json` e `.gitignore`

```env
DB_HOST=localhost   //host do banco de dados
DB_USER=root        //usuário do banco de dados
DB_PASSWORD=123456  //senha do banco de dados
DB_NAME=meu_banco   //nome do banco de dados -- Lembrando que é necessário criar o banco primeiro
DB_PORT=3306        //porta padrão do servidor do MySQL
```

> [!IMPORTANT]
> Adicionar `.env` no `.gitignore` para não versionar credenciais.

---

## 4️⃣ **Configurando o dotenv**

Crie uma pasta `src/config` com o arquivo `env.ts`:

```typescript
// src/config/env.ts
import dotenv from "dotenv";

dotenv.config();

export const env = {
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_USER: process.env.DB_USER || "root",
  DB_PASSWORD: process.env.DB_PASSWORD || "",
  DB_NAME: process.env.DB_NAME || "test",
  DB_PORT: Number(process.env.DB_PORT) || 3306,
};
```

---

## 5️⃣ **Usando no projeto**

Exemplo de conexão com MySQL usando `mysql2/promise`:

```typescript
// src/database/connection.ts
import mysql from "mysql2/promise";
import { env } from "../config/env";

export const connection = mysql.createPool({
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  port: env.DB_PORT,
});
```

---

## 6️⃣ **Usando na aplicação Express**

```typescript
// src/index.ts
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
```

---

## ✅ **Testando**

1. Rodar o servidor:

   ```bash
   npm run dev
   ```
2. Acessar `http://localhost:3000` → deve retornar a hora atual do MySQL.
