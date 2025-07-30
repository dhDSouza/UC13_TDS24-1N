# 🎓 **Aula 4: Integração com Banco de Dados MySQL Sem ORM**

## 🎯 **Objetivos da Aula**

* Entender como se conectar a um banco de dados **MySQL** usando **Node.js e TypeScript**.
* Realizar **consultas SQL manualmente** (sem ORM).
* Compreender o risco de **SQL Injection** e como evitá-lo.
* Aprender a usar o pacote `mysql2` com **queries parametrizadas**.

---

## 🗃️ **1. O que é um Banco de Dados Relacional?**

Um **banco de dados relacional** organiza dados em **tabelas** com **colunas e linhas**, como uma planilha.

Exemplo de tabela `usuarios`:

| id | nome    | email             |
|:--:|:-------:|:-----------------:|
| 1  | Rodorfo | rodorfo@email.com |
| 2  | Jamelão | jamelao@email.com |

---

## 🧩 **2. Como conectar o Node.js (TypeScript) ao MySQL?**

Vamos usar o pacote **`mysql2`** (versão moderna do mysql) e fazer as queries "na unha".

> [!NOTE]
> Nesta aula iremos aprimorar o exemplo da aula passada.   
> Faça o [⬇️ download](https://github.com/dhDSouza/UC13_TDS24-1N/raw/refs/heads/main/downloads/projeto-mvc-simples.zip) da aula passada aqui.

> [!TIP]
> No projeto disponível para download não terá a pasta `node_modules`, mas não necessário executar novamente todas as instalações.   
>   
> **Apenas execute o seguinte comando no terminal**
> ```bash
> npm i
> ```
>   
> Esse comando irá instalar todas as dependências contidas no arquivo `package.json` e restaurar a pasta `node_modules`.

### 📦 Instalação das novas dependências

```bash
npm i mysql2
```

---

## 🛠 **3. Configurando a Conexão com o Banco**

### 📁 Crie um arquivo `database.ts` em `src/config/`

```ts
// src/config/database.ts
import mysql from 'mysql2/promise';

export const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'sua_senha',
  database: 'meubanco'
});
```

> [!NOTE]
> Estamos criando uma **pool de conexões**, mais eficiente do que abrir uma nova conexão a cada requisição.

---

## 🧪 **4. Executando Consultas "na unha" (sem ORM)**

### 📁 Criando o Controller: `UserController.ts`

```ts
import { Request, Response } from 'express';
import { connection } from '../config/database';

export class UserController {
  async listUsers(req: Request, res: Response): Promise<Response> {
    const [rows] = await connection.query('SELECT * FROM usuarios');
    return res.status(200).json(rows);
  }

  async createUser(req: Request, res: Response): Promise<Response> {
    const { nome, email } = req.body;
    if (!nome || !email) {
      return res.status(400).json({ mensagem: 'Nome e e-mail obrigatórios.' });
    }

    await connection.query('INSERT INTO usuarios (nome, email) VALUES (?, ?)', [nome, email]);
    return res.status(201).json({ mensagem: 'Usuário criado com sucesso!' });
  }
}
```

### 🧠 **O que são os `?`?**

São **placeholders**, usados para evitar **SQL Injection**.

---

## ⚠️ **5. Entendendo o Risco de SQL Injection**

> [!TIP]
> Assista ao vídeo abaixo que explica em detalhes o que é `SQL Injection` e por que é tão perigoso.

<div align="center">
    <a href="https://www.youtube.com/watch?v=jN8QGOxdhvM" target="_blank">
        <img src="https://img.youtube.com/vi/jN8QGOxdhvM/sddefault.jpg">
    </a>
    <p>
        Fonte: 
        <em>
        <a href="https://www.youtube.com/watch?v=jN8QGOxdhvM" target="_blank">
            https://www.youtube.com/watch?v=jN8QGOxdhvM
        </a>
        </em>
    </p>
</div>

---

Imagine este código (ERRADO):

```ts
// ⚠️ Não use assim
const resultado = await connection.query(
  `SELECT * FROM usuarios WHERE nome = '${req.query.nome}'`
);
```

Se o usuário malicioso enviar:

```
/usuarios?nome=' OR 1=1 --
```

O SQL executado será:

```sql
SELECT * FROM usuarios WHERE nome = '' OR 1=1 --'
```

Isso retorna **todos os usuários**. Pior ainda: pode ser usado para **deletar, alterar ou vazar dados**.

---

## ✅ **6. Como Evitar SQL Injection**

A forma correta é usar **consultas parametrizadas** (com `?`):

```ts
const [rows] = await connection.query(
  'SELECT * FROM usuarios WHERE nome = ?',
  [req.query.nome]
);
```

A biblioteca `mysql2` automaticamente **filtra os valores**, evitando a injeção.

---

## 🏗️ **7. Exemplo Completo de CRUD com MySQL e TypeScript**

> [!IMPORTANT]
> <details>
>   <summary>Explicação: Por que usamos `async/await`?</summary>
>
> ## ❓ Por que usamos `async/await` aqui?
>
> ### 🔄 Operações assíncronas (como acessar banco de dados ou consultar serviços externos) demoram!
>
> * Consultas a bancos de dados são **operações que não são imediatas**: elas levam tempo para responder.
> * O JavaScript/Node.js é **single-threaded**, então não pode *“esperar parado”* por essas operações.
>
> ### ✅ O que `async/await` faz?
>
> * `async` marca uma função como assíncrona — ela sempre retorna uma `Promise`.
> * `await` **pausa** a execução da função até a Promise ser resolvida (ou rejeitada).
> * Com isso, seu código fica **sequencial e mais legível**, como se fosse síncrono, mas sem travar a aplicação.
>
> Exemplo:
>
> ```ts
> // Sem await – precisa usar then/catch
> connection.query('SELECT * FROM usuarios')
>   .then((rows) => res.json(rows))
>   .catch((err) => res.status(500).json({ erro: err }));
>
> // Com await – mais limpo e legível
> const [rows] = await connection.query('SELECT * FROM usuarios');
> ```
>
> ---
>
> ## 🧾 E a tipagem `Promise<Response>`?
>
> Em TypeScript, quando você cria uma função `async`, ela **sempre retorna uma Promise**, mesmo que você não perceba.
>
> ### Por que `Promise<Response>`?
>
> * A função retorna uma `Promise` que, eventualmente, vai **resolver em um `Response`** do Express.
> * Isso permite que o TypeScript valide corretamente a cadeia de execução assíncrona e o tipo retornado.
>
> Exemplo:
>
> ```ts
> async function listUsers(req: Request, res: Response): Promise<Response> {
>   const [rows] = await connection.query('SELECT * FROM usuarios');
>   return res.status(200).json(rows);
> }
> ```
> </details>


### 📁 `UserController.ts` com todas as operações

```ts
import { Request, Response } from 'express';
import { connection } from '../config/database';

export class UserController {
  async list(req: Request, res: Response): Promise<Response> {
    const [rows] = await connection.query('SELECT * FROM usuarios');
    return res.status(200).json(rows);
  }

  async getById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const [rows]: any = await connection.query('SELECT * FROM usuarios WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }
    return res.status(200).json(rows[0]);
  }

  async create(req: Request, res: Response): Promise<Response> {
    const { nome, email } = req.body;
    await connection.query('INSERT INTO usuarios (nome, email) VALUES (?, ?)', [nome, email]);
    return res.status(201).json({ mensagem: 'Usuário criado com sucesso!' });
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { nome, email } = req.body;
    await connection.query('UPDATE usuarios SET nome = ?, email = ? WHERE id = ?', [nome, email, id]);
    return res.status(200).json({ mensagem: 'Usuário atualizado!' });
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    await connection.query('DELETE FROM usuarios WHERE id = ?', [id]);
    return res.status(204).send();
  }
}
```

---

## 🔗 **8. Rotas – `UserRoutes.ts`**

```ts
import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const router = Router();
const controller = new UserController();

router.get('/users', controller.list);
router.get('/users/:id', controller.getById);
router.post('/users', controller.create);
router.put('/users/:id', controller.update);
router.delete('/users/:id', controller.delete);

export default router;
```

---

## 🧪 **9. Exercícios para Praticar**

1️⃣ Crie a tabela `usuarios` no MySQL com:

```sql
CREATE TABLE usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL
);
```

2️⃣ Crie uma nova rota `/users/busca?nome=nome_usuario` para buscar usuários pelo nome (usando query param com `?`).

3️⃣ Implemente uma verificação para impedir e-mails duplicados no cadastro.

4️⃣ Crie uma função de `login` (POST `/login`) que recebe email e nome, e retorna 401 se não bater com nenhum registro.

---

## ✅ **Resumo da Aula**

✅ Conectamos um projeto Node.js + TypeScript ao MySQL   
✅ Fizemos queries SQL diretamente (sem ORM)   
✅ Aprendemos sobre **SQL Injection** e como evitá-lo   
✅ Implementamos um **CRUD completo** com queries seguras   
