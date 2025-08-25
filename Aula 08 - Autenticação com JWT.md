# 🧠 Autenticação com JWT (JSON Web Token)

## 📌 Objetivo da aula

Ao final desta aula, você será capaz de:

✅ Entender o que é JWT e por que ele é usado  
✅ Compreender como funciona a autenticação baseada em tokens  
✅ Implementar JWT em uma aplicação com Node.js + TypeScript  
✅ Proteger rotas usando middleware JWT

---

## 🧩 1. O que é JWT?

**JWT (JSON Web Token)** é um formato leve e seguro para transmitir **informações de autenticação** entre cliente e servidor.

> 🧾 **Pense no JWT como um crachá digital**. Você faz login, recebe esse crachá e o usa para acessar áreas restritas sem se identificar novamente.

---

### 🔐 Analogia com a vida real

Imagine que você vai a um evento:

- Você se **cadastra na entrada** (login)
- Recebe um **crachá** com seu nome e permissões (JWT)
- O segurança do evento **valida seu crachá** para liberar acesso às áreas restritas

---

## 📦 2. Estrutura de um JWT

Um JWT é composto por **três partes**, separadas por ponto (`.`):

```
HEADER.PAYLOAD.SIGNATURE
```

### Explicando cada parte:

#### 🧩 1. Header (Cabeçalho)

Define o tipo de token e o algoritmo de assinatura.

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

#### 📦 2. Payload (Informações)

Contém os **dados que você quer guardar**, como o ID do usuário e sua função (role):

```json
{
  "id": 1,
  "email": "joao@email.com",
  "role": "admin"
}
```

#### 🔏 3. Signature (Assinatura)

Garante que o token **não foi alterado**:

```ts
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  SECRET_KEY
);
```

---

## 🚀 3. Quando usar JWT?

**✅ Use quando:**

- Você tem uma API REST separada do frontend
- Seu frontend é React, Vue ou Angular (SPA)
- Você está construindo um app mobile (Flutter, React Native)
- Você usa microserviços

**❌ Evite quando:**

- Você precisa invalidar tokens com frequência
- Você quer logout global imediato

---

## 🛠️ 4. Instalando as dependências

```bash
npm install jsonwebtoken
npm install @types/jsonwebtoken -D
```

---

## 🔨 5. Geração e verificação de token

### 📁 `auth.ts`

```ts
import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET não definido no arquivo .env");
}

const secret: Secret = JWT_SECRET;

export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, secret, { expiresIn: "1h" });
}

export function verifyToken(token: string): JwtPayload | string {
  return jwt.verify(token, secret);
}
```

---

## 👤 Exemplo de uso no Controller

### 📁 `UserController.ts`

```ts
import { Request, Response } from "express";
import { UserRepository } from "../repositories/UserRepository";
import bcrypt from "bcryptjs";
import { generateToken } from "../auth";

const repo = new UserRepository();

export class UserController {
  static async register(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password, phone, role } = req.body;

      const existing = await repo.findUserByEmail(email);
      if (existing) {
        return res.status(400).json({ message: "Email já em uso." });
      }

      const user = await repo.createUser(name, email, password, phone, role);
      return res.status(201).json(user);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao registrar", error });
    }
  }

  static async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      const user = await repo.findUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Senha inválida" });
      }

      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      return res.json({ message: "Login realizado", token });
    } catch (error) {
      return res.status(500).json({ message: "Erro no login", error });
    }
  }

  static async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const users = await repo.findAllUsers();
      return res.json(users);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro ao buscar usuários", error });
    }
  }

  static async getById(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      const user = await repo.findUserById(id);

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      return res.json(user);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar usuário", error });
    }
  }

  static async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      const { name, email, password, phone, role } = req.body;

      const updated = await repo.updateUser(id, {
        name,
        email,
        password,
        phone,
        role,
      });

      if (!updated) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      return res.json({ message: "Usuário atualizado", updated });
    } catch (error) {
      return res.status(500).json({ message: "Erro ao atualizar", error });
    }
  }

  static async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      const deleted = await repo.deleteUser(id);

      if (!deleted) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      return res.json({ message: "Usuário deletado" });
    } catch (error) {
      return res.status(500).json({ message: "Erro ao deletar", error });
    }
  }
}
```

---

## 🛡️ 6. Middleware de autenticação

### 📁 `middlewares/authMiddleware.ts`

```ts
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../auth";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export class AuthMiddleware {
  async authenticateToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1]; // Formato: Bearer <token>

    if (!token) {
      return res.status(401).json({ message: "Token não fornecido" });
    }

    try {
      const user = verifyToken(token);
      req.user = user;
      return next();
    } catch (error) {
      return res.status(403).json({ message: "Token inválido ou expirado" });
    }
  }
}
```

---

### 🧩 Exemplo de rota protegida

```ts
import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

const router = Router();
const middleware = new AuthMiddleware();

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/users", middleware.authenticateToken, UserController.getAll);

export default router;
```

---

## ✅ 7. Boas práticas com JWT

- 🔐 Nunca envie token em query string
- 🔒 Sempre que possível use HTTPS
- ⏳ Use tokens com curta duração (15 min a 1h)
- 🔁 Implemente refresh tokens se necessário
