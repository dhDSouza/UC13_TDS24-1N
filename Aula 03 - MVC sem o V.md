# **Aula 3: Models, Views não, e Controllers no Express 🚀**

## 🎯 **Objetivos da Aula**  
- Entender o conceito de **MVC (Model-View-Controller)** e sua importância.  
- Aprender a estruturar um projeto Express usando MVC.  
- Criar um **CRUD básico** já seguindo essa estrutura.  

---

# 📌 **1. O que é MVC?**  

O **MVC (Model-View-Controller)** é um padrão de arquitetura que **organiza o código** separando as responsabilidades da aplicação.  

✅ **Model (Modelo)** → Lida com os **dados e a lógica do banco de dados**.     
✅ **View (Visão)** → Responsável pela **interface** com o usuário (nesta unidade curricular, focaremos só na API, então não usaremos Views agora).     
✅ **Controller (Controlador)** → Contém a **lógica de negócio**, processando requisições e chamando os **models**.   

💡 **Por que usar MVC?** 

✔ Código mais **organizado e modular**.     
✔ **Facilita manutenção e reuso**.     
✔ Separa a **lógica da aplicação** da parte que interage com os dados.     

---

# 🏗 **2. Criando um Projeto Express com MVC**  

Vamos iniciar um projeto do zero para aplicar MVC.  

### **Passo 1: Criando o Projeto**  
```sh
npm init -y
npm install express
npm install typescript ts-node-dev @types/node @types/express -D
```

Adicione `"dev": "npx ts-node-dev src/server.ts"` no `package.json` para facilitar a execução.  

---

### **Passo 2: Estruturando as Pastas**  
Crie a seguinte estrutura:  

```
express-mvc/
│── src/
│   ├── models/
│   │   ├── Usuario.ts
│   ├── controllers/
│   │   ├── usuarioController.ts
│   ├── routes/
│   │   ├── usuarioRoutes.ts
│   ├── server.ts
│── package.json
│── tsconfig.json
```

---

# 🛠 **3. Implementando um CRUD Simples com MVC**  

Agora, vamos criar um CRUD básico de usuários.  

## **📦 Model (Usuário) – `models/Usuario.ts`**  

```ts
export class Usuario {
  constructor(public id: number, public nome: string, public email: string) {}
}

export const usuarios: Usuario[] = []; // Simulando um "banco de dados" temporário
```

Esse **model** representa um usuário e armazena os dados em um array (como se fosse um banco de dados).  

---

## **🎯 Controller – `controllers/usuarioController.ts`**  

```ts
import { Request, Response } from "express";
import { Usuario, usuarios } from "../models/Usuario";

// Criar um novo usuário
export const criarUsuario = (req: Request, res: Response): Response => {
  const { id, nome, email } = req.body;
  const novoUsuario = new Usuario(id, nome, email);
  usuarios.push(novoUsuario);
  return res.status(201).json({ mensagem: "Usuário criado com sucesso!", usuario: novoUsuario });
};

// Listar todos os usuários
export const listarUsuarios = (req: Request, res: Response) => {
  res.status(200).json(usuarios);
};

// Buscar um usuário por ID
export const buscarUsuarioPorId = (req: Request, res: Response): Response => {
  const id = Number(req.params.id);
  const usuario = usuarios.find(u => u.id === id);
  if (!usuario) return res.status(404).json({ mensagem: "Usuário não encontrado" });
  return res.status(200).json(usuario);
};

// Atualizar um usuário
export const atualizarUsuario = (req: Request, res: Response): Response => {
  const id = Number(req.params.id);
  const { nome, email } = req.body;
  const usuario = usuarios.find(u => u.id === id);
  if (!usuario) return res.status(404).json({ mensagem: "Usuário não encontrado" });

  usuario.nome = nome || usuario.nome;
  usuario.email = email || usuario.email;
  return res.status(200).json({ mensagem: "Usuário atualizado com sucesso!", usuario });
};

// Deletar um usuário
export const deletarUsuario = (req: Request, res: Response): Response => {
  const id = Number(req.params.id);
  const index = usuarios.findIndex(u => u.id === id);
  if (index === -1) return res.status(404).json({ mensagem: "Usuário não encontrado" });

  usuarios.splice(index, 1);
  return res.status(200).json({ mensagem: "Usuário deletado com sucesso!" });
};
```

Esse **Controller** tem funções para **criar, listar, buscar, atualizar e deletar** usuários.  

---

## **🔗 Rotas – `routes/usuarioRoutes.ts`**  

```ts
import { Router } from "express";
import { criarUsuario, listarUsuarios, buscarUsuarioPorId, atualizarUsuario, deletarUsuario } from "../controllers/usuarioController";

const router = Router();

router.post("/usuarios", criarUsuario);
router.get("/usuarios", listarUsuarios);
router.get("/usuarios/:id", buscarUsuarioPorId);
router.put("/usuarios/:id", atualizarUsuario);
router.delete("/usuarios/:id", deletarUsuario);

export default router;
```

As **rotas** direcionam as requisições HTTP para os métodos do **Controller**.  

---

## **🚀 Servidor – `server.ts`**  

```ts
import express, { Application } from "express";
import usuarioRoutes from "./routes/usuarioRoutes";

const app: Application = express();
const PORT: number = 3000;
app.use(express.json());
app.use("/api", usuarioRoutes);

app.listen(PORT, () => console.log(`🚀 Servidor rodando em http://localhost:${PORT}`));
```

Agora o servidor Express está pronto para **receber requisições**!  

---

# ✅ **4. Testando a API**  

Use o **Thuner Cliente** para testar os endpoints:  

### **Criar Usuário** – `POST /api/usuarios`  
```json
{
  "id": 1,
  "nome": "Daniel",
  "email": "daniel@email.com"
}
```

### **Listar Usuários** – `GET /api/usuarios`  
Resposta esperada:
```json
[
  {
    "id": 1,
    "nome": "Daniel",
    "email": "daniel@email.com"
  }
]
```

### **Buscar Usuário por ID** – `GET /api/usuarios/1`  
Retorna o usuário com ID **1**.  

### **Atualizar Usuário** – `PUT /api/usuarios/1`  
```json
{
  "nome": "Daniel Atualizado"
}
```

### **Deletar Usuário** – `DELETE /api/usuarios/1`  
Remove o usuário **1** da lista.  

---

# 🎯 **5. Exercícios para Praticar**  

1️⃣ **Crie um Model e um Controller para "Produtos"**.  
2️⃣ **Separe a lógica dos produtos seguindo o padrão MVC**.  
3️⃣ **Teste as novas rotas usando o Postman**.  

---

# 🔥 **Resumo da Aula**  

✅ **Aprendemos o que é MVC** e como organizar um projeto Express.  
✅ **Criamos um CRUD de usuários** seguindo a estrutura **Model-Controller-Routes**.  
✅ **Testamos a API** usando ferramentas como Thunder Client.  
