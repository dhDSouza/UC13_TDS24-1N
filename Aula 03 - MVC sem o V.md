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
│   │   ├── User.ts
│   ├── controllers/
│   │   ├── UserController.ts
│   ├── routes/
│   │   ├── UserRoutes.ts
│   ├── server.ts
│── package.json
│── tsconfig.json
```

---

# 🛠 **3. Implementando um CRUD Simples com MVC**  

Agora, vamos criar um CRUD básico de usuários.  

## **📦 Model (Usuário) – `models/User.ts`**  

```ts
export class User {

    public id: number;
    public nome: string;
    public email: string;

    constructor(id: number, nome: string, email: string) {
        this.id = id;
        this.nome = nome;
        this.email = email;
    }
}

export let usuarios: User[] = []; // Simulando o banco de dados com uma lista
```

Esse **model** representa um usuário e armazena os dados em um array (como se fosse um banco de dados).  

---

## **🎯 Controller – `controllers/UserController.ts`**  

```ts
import { Request, Response } from "express"
import { User, usuarios } from "../models/User"

export class UserController {

    createUser(req: Request, res: Response): Response {
        const { id, nome, email } = req.body;

        if (!id || !nome || !email) {
            return res.status(400).json({ mensagem: "Id, nome, email precisam ser informados!" });
        }

        const usuario = new User(id, nome, email);
        usuarios.push(usuario);

        return res.status(201).json({ mensagem: "Usuário criado com sucesso!", usuario: usuario });

    }

    listAllUsers(req: Request, res: Response): Response {
        return res.status(200).json({ users: usuarios });
    }

    updateUser(req: Request, res: Response): Response {
        const id: number = Number(req.params.id);
        const { nome, email } = req.body;

        if (!nome || !email) {
            return res.status(400).json({ mensagem: "Nome e e-mail são obrigatórios!" })
        }

        let usuario = usuarios.find(user => user.id === id);

        if (!usuario) return res.status(404).json({ mensagem: "Usuário não encontrado!" })

        usuario.nome = nome;
        usuario.email = email;

        return res.status(200).json({ mensagem: "Usuário atualizado com sucesso!", usuario_atualizado: usuario })
    }

    deleteUser(req: Request, res: Response): Response {
        const id: number = Number(req.params.id);

        let index = usuarios.findIndex(user => user.id === id);

        if (index === -1) {
            return res.status(404).json({ mensagem: "Usuário não encontrado" })
        }

        usuarios.splice(index, 1);
        return res.status(204).send();
    }
}
```

Esse **Controller** tem funções para **criar, listar, buscar, atualizar e deletar** usuários.  

---

## **🔗 Rotas – `routes/UserRoutes.ts`**  

```ts
import { Router } from "express";
import { UserController } from "../controllers/UserController";

const router = Router();

const controller = new UserController();

router.get('/users', controller.listAllUsers);
router.post('/users', controller.createUser);
router.put('/users/:id', controller.updateUser);
router.delete('/users/:id', controller.deleteUser);

export default router;
```

As **rotas** direcionam as requisições HTTP para os métodos do **Controller**.  

---

## **🚀 Servidor – `server.ts`**  

```ts
import express, { Application } from "express";
import userRoutes from "./routes/UserRoutes";

const app: Application = express();
const PORT: number = 3000;

app.use(express.json()); // DEFINE QUE MINHA API TRABALHA COM JSON

app.use(userRoutes); //QUERO UTILIZAR MINHAS ROTAS

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
})
```

Agora o servidor Express está pronto para **receber requisições**!  

---

# ✅ **4. Testando a API**  

Use o **Thuner Cliente** para testar os endpoints:  

### **Criar Usuário** – `POST /users`  
```json
{
  "id": 1,
  "nome": "Daniel",
  "email": "daniel@email.com"
}
```

### **Listar Usuários** – `GET /users`  
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

### **Atualizar Usuário** – `PUT /users/1`  
```json
{
  "nome": "Daniel Atualizado",
  "email": "email@atualizado.com"
}
```

### **Deletar Usuário** – `DELETE /users/1`  
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
