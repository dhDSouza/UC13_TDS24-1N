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
npm i jsonwebtoken
npm i @types/jsonwebtoken -D
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

## 📦 Exemplo de Model

```ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert, BeforeUpdate, AfterLoad } from "typeorm";
import * as bcrypt from "bcryptjs";
import { Post } from "./Post";

@Entity("users") // Informa para o ORM que essa classe será uma Entidade do Banco de Dados
export class User {
  @PrimaryGeneratedColumn() // Define que o campo será uma Chave Primária (PK) e Auto Incrementável (AI)
  id!: number;

  @Column({ length: 100, nullable: false }) // Define que o tamanho do campo é de 100 caracteres, e não pode ser nulo.
  name: string;

  @Column({ unique: true }) // Define que o campo é Único (UK)
  email: string;

  @Column({ length: 255, nullable: false })
  password: string;

  private originalPassword!: string;

  @Column({ type: "enum", enum: ['admin', 'user', 'hacker'], nullable: false, default: 'user' })
  role: string;

  @BeforeInsert()
  @BeforeUpdate()
  private async hashPassword(): Promise<void> {
    if (this.password && this.password !== this.originalPassword) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  @AfterLoad()
  private setPreviousPassword() {
    this.originalPassword = this.password;
  }

  /*
        - Indica para o ORM que existe uma relação de 1 para Muitos (1:N) com a Entidade Posts.
        - Essa Relação será indicada da outra entidade também, e o ORM irá criar a Chave Estrangeira (FK) automaticamente.
        - Essa prática é extremamente importante para que possam ser realizadas consultas em múltiplas tabelas posteriormente.
    */
  @OneToMany(() => Post, (post) => post.user)
  posts?: Post[];

  constructor(name: string, email: string, password: string, role: string = "user") {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }
}
```

---

## 👤 Exemplo de uso no Controller

### 📁 `UserController.ts`

```ts
import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../models/User";
import * as bcrypt from "bcryptjs";
import { generateToken } from "../config/auth";

const userRepository = AppDataSource.getRepository(User);

export class UserController {
  // Listar todos os usuários com posts (GET /users)
  /*
  SELECT * FROM users 
  LEFT JOIN posts ON users.id = posts.userId 
  ORDER BY users.id ASC
*/
  // Lista todos os usuários e os seus posts (se não tiver post retorna null)
  async list(req: Request, res: Response): Promise<Response> {
    try {
      const users = await userRepository.find({
        relations: ["posts"],
        order: { id: "ASC" },
      });
      return res.status(200).json(users);
    } catch (error) {
      console.error("Internal server error.\nError: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Obter um usuário específico (GET /users/:id)
  /*
  SELECT * FROM users 
  LEFT JOIN posts ON users.id = posts.userId 
  WHERE users.id = ?
*/
  // Retorna um usuário com seus posts (se não tiver post retorna null)
  async show(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await userRepository.findOne({
        where: { id: Number(id) },
        relations: ["posts"],
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error("Internal server error\nError: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Criar novo usuário (POST /users)
  /*
  INSERT INTO users (name, email) 
  VALUES (?, ?)
*/
  // Verifica se email já existe antes de inserir
  async create(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res
          .status(400)
          .json({ message: "Name email and password are required" });
      }

      const userExists = await userRepository.findOneBy({ email: email });
      if (userExists) {
        return res.status(409).json({ message: "Email already in use" });
      }

      const user = userRepository.create({ name, email, password });
      await userRepository.save(user);

      return res.status(201).json(user);
    } catch (error) {
      console.error("Internal server error", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Atualizar usuário (PATCH /users/:id)
  /*
  SELECT * FROM users WHERE id = ?;

  [opcional] SELECT * FROM users WHERE email = ?;

  UPDATE users 
  SET name = ?, email = ? 
  WHERE id = ?
*/
  // Atualiza apenas os campos fornecidos
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, email, password } = req.body;

      const user = await userRepository.findOneBy({ id: Number(id) });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (name) {
        user.name = name;
      }

      if (password) {
        user.password = password;
      }

      if (email) {
        const emailExists = await userRepository.findOneBy({ email });
        if (emailExists && emailExists.id !== user.id) {
          return res
            .status(409)
            .json({ message: "Email already in use by another user" });
        }
        user.email = email;
      }

      await userRepository.save(user);
      return res.status(200).json(user);
    } catch (error) {
      console.error("Internal server error", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Deletar usuário (DELETE /users/:id)
  /*
  SELECT * FROM users WHERE id = ?;

  DELETE FROM users WHERE id = ?
*/
  // Remove o usuário se ele existir
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await userRepository.findOneBy({ id: Number(id) });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await userRepository.remove(user);
      return res.status(204).send(); // No Content
    } catch (error) {
      console.error("Internal server error", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required!" });
    }

    const user = await userRepository.findOneBy({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ message: "Access denied!" });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return res.status(200).json({ message: "Logged successfully", token: token });
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
import { AuthMiddleware } from "../middlewares/authMiddleware";

const routes = Router();
const userController = new UserController();
const authMiddleware = new AuthMiddleware();

// Todas as rotas com `authMiddleware.authenticateToken` são protegidas
// Ou seja só podem ser acessadas após ser efetuado o login.
// As rotas com authMiddleware.isAdmin, além de autenticadas só podem ser acessadas por usuário do tipo Admin.

// Rotas de Usuários
routes.get("/users", authMiddleware.authenticateToken ,userController.list); // Listar todos
routes.get("/users/:id", authMiddleware.authenticateToken, authMiddleware.isAdmin, userController.show); // Mostrar um
routes.post("/users", userController.create); // Criar
routes.patch("/users/:id", authMiddleware.authenticateToken, userController.update); // Atualizar
routes.delete("/users/:id", authMiddleware.authenticateToken, userController.delete); // Deletar
routes.post("/login", userController.login); // Logar

export default routes;
```

---

## ✅ 7. Boas práticas com JWT

- 🔐 Nunca envie token em query string
- 🔒 Sempre que possível use HTTPS
- ⏳ Use tokens com curta duração (15 min a 1h)
- 🔁 Implemente refresh tokens se necessário
