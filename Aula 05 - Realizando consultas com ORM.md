# 🎓 **Aula 5 – Realizando consultas com ORM**

## 🎯 **Objetivos da Aula**

* Entender o que é um **ORM** e como o TypeORM facilita o trabalho com banco de dados.
* Comparar o uso de SQL manual (`mysql2/promise`) com ORM.
* Criar entidades e mapear para tabelas com **decorators**.
* Implementar **relacionamentos** (One-to-Many, Many-to-One) no TypeORM.
* Usar `relations` para simular **JOINs** automaticamente.

---

## 🧩 O que é um ORM?

ORM significa **Object-Relational Mapping** (*Mapeamento Objeto-Relacional*).
Basicamente, é uma ferramenta que permite interagir com o banco de dados **usando objetos e métodos** ao invés de escrever SQL puro.

💡 **Por que usar ORM?**

* 📉 Menos repetição de código SQL
* 🛡️ Menos risco de SQL Injection (ele faz o tratamento automático)
* 🗂️ Melhor organização do código
* 🔄 Portabilidade entre diferentes bancos de dados

## 🧠 **Retomando o que já aprendemos**

Até agora:

* Usamos `mysql2/promise` para **escrever queries SQL diretamente**.
* Controlávamos tudo: desde o `SELECT` até as condições, paginação e `JOINs`.

Exemplo no **mysql2/promise**:

```ts
const [rows] = await connection.query(
  'SELECT * FROM usuarios WHERE id = ?',
  [id]
);
```

---

Agora, no **TypeORM**:

```ts
const user = await userRepository.findOneBy({ id });
```

💡 A diferença:

* No mysql2 → você escreve o SQL manualmente.
* No TypeORM → você descreve *o que quer*, e ele gera o SQL.

---

## 🏗️ **Configurando o TypeORM**

O TypeORM é um ORM para JavaScript e TypeScript que facilita a interação com bancos de dados relacionais de forma orientada a objetos, através do uso de decoradores.

## **🤔 Como iniciar um projeto com TypeORM?**

Instalar dependências:

```bash
npm install express typeorm reflect-metadata mysql2 dotenv
npm install -D typescript @types/express @types/node
```

Arquivo `src/config/data-source.ts`:

```ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from "dotenv";

dotenv.config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: DB_HOST,
    port: Number(DB_PORT || "3306"),
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    synchronize: true, // CUIDADO! Apenas em desenvolvimento (em ambiente de produção será false)
    logging: true,
    entities: ['src/models/*.ts'],
});
```

---

## 📦 **Criando Entidades**

O TypeORM usa **classes** para representar tabelas.

### `src/models/User.ts`

```ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Post } from './Post';

@Entity('users') // Informa para o ORM que essa classe será uma Entidade do Banco de Dados
export class User {
    @PrimaryGeneratedColumn() // Define que o campo será uma Chave Primária (PK) e Auto Incrementável (AI)
    id: number;

    @Column({ length: 100, nullable: false }) // Define que o tamanho do campo é de 100 caracteres, e não pode ser nulo.
    name: string;

    @Column({ unique: true }) // Define que o campo é Único (UK)
    email: string;

    /*
        - Indica para o ORM que existe uma relação de 1 para Muitos (1:N) com a Entidade Posts.
        - Essa Relação será indicada da outra entidade também, e o ORM irá criar a Chave Estrangeira (FK) automaticamente.
        - Essa prática é extremamente importante para que possam ser realizadas consultas em múltiplas tabelas posteriormente.
    */
    @OneToMany(() => Post, post => post.user)
    posts: Post[];
}
```

### `src/models/Post.ts`

```ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity('posts')
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    /*
        - Define o campo como sendo um VARCHAR.
        - Essa definição é opcional pois o ORM identifica pelo tipo da propriedade no TypeScript.
    */
    @Column({ type: "varchar", length: 100, nullable: false })
    title: string;


    /*
        - Indica para o ORM que existe uma relação de Muitos para 1 (N:1) com a Entidade Users.
        - Essa Relação foi indicada da outra entidade também, e o ORM irá criar a Chave Estrangeira (FK) automaticamente.
        - Sempre que ouver relacões entre entidades precisamos declarar a "ida e a volta".
        - Ou seja, se a relação entre Users e Posts for de 1:N a relação entre Posts e Users será de N:1.
        - Essa referência cruzada é obrigatória para que o ORM crie corretamente as Chaves Estrangeiras (FK)
    */
    @ManyToOne(() => User, user => user.posts)
    user: User;
}
```

---

## 🔗 **Relacionamentos e JOINs**

No MySQL puro, um **INNER JOIN** ficaria assim:

```sql
SELECT u.*, p.*
FROM users u
INNER JOIN posts p ON p.user_id = u.id;
```

No TypeORM, a mesma coisa:

```ts
const users = await userRepository.find({
    relations: ['posts']
});
```

* `relations` → diz quais tabelas devem ser carregadas junto.
* TypeORM **gera o JOIN automaticamente**.

---

## 🚦 **Criando Controllers**

### `src/controllers/UserController.ts`

```ts
import { Request, Response } from 'express';
import { AppDataSource } from '../database/data-source';
import { User } from '../models/User';

const userRepository = AppDataSource.getRepository(User);

export class UserController {
    async list(req: Request, res: Response) {
        const users = await userRepository.find({ relations: ['posts'] });
        return res.json(users);
    }

    async create(req: Request, res: Response) {
        const { name, email } = req.body;
        const user = userRepository.create({ name, email });
        await userRepository.save(user);
        return res.status(201).json(user);
    }
}
```

### `src/controllers/PostController.ts`

```ts
import { Request, Response } from 'express';
import { AppDataSource } from '../database/data-source';
import { Post } from '../models/Post';
import { User } from '../models/User';

const postRepository = AppDataSource.getRepository(Post);
const userRepository = AppDataSource.getRepository(User);

export class PostController {
    async create(req: Request, res: Response) {
        const { title, userId } = req.body;
        const user = await userRepository.findOneBy({ id: userId });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const post = postRepository.create({ title, user });
        await postRepository.save(post);
        return res.status(201).json(post);
    }
}
```

---

## 🌐 **Rotas**

`src/routes/index.ts`

```ts
import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { PostController } from '../controllers/PostController';

const routes = Router();
const userController = new UserController();
const postController = new PostController();

routes.get('/users', userController.list);
routes.post('/users', userController.create);

routes.post('/posts', postController.create);

export default routes;
```

---

## 📝 **Exercícios Práticos**

1. Criar as entidades `Category` e `Product`.
2. Relacione `Category` com `Product` (One-to-Many).
3. Criar rota `/products` que já traga junto a categoria (usando `relations`).
4. Criar rota `/users/posts` que traga todos usuários e seus posts.

---

## ✅ **Resumo da Aula**

* ORM = camada que converte **objetos/classe** em **tabelas**.
* TypeORM usa **decorators** para mapear tabelas.
* `relations` carrega dados de outras tabelas (JOIN).
* Relacionamentos no TypeORM:

  * `@OneToMany`
  * `@ManyToOne`

* Dá pra fazer tudo que fizemos com SQL puro, mas com menos código repetitivo.
