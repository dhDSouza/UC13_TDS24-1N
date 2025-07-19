# **Aula 2: Rotas, Requisições, Respostas e Middlewares no Express**

## 🎯 **Objetivos da Aula**

* Entender **o que são rotas** no Express.
* Compreender o conceito de **requisição e resposta**.
* Aprender a **estrutura de uma rota**.
* Introduzir **middlewares**, entender seu propósito e como usá-los.

---

## 🛫 **1. O que é uma Rota?**

No Express, uma **rota** define como a aplicação responde a uma **requisição HTTP** feita para um **endereço específico**.

### 🛤 **Analogia para entender melhor**

🔹 **Imagine que você está em uma cidade e precisa encontrar um restaurante.** Você abre um mapa (navegador) e pesquisa pelo nome do restaurante (URL). Ao clicar nele, você recebe informações como horário de funcionamento e cardápio (dados da resposta).

> No Express, o caminho que seu pedido segue é definido por **rotas**, e cada uma responde de maneira diferente dependendo do que você solicitar.

---

## 🔄 **2. O que é uma Requisição e uma Resposta?**

Sempre que interagimos com um site ou aplicativo, estamos enviando **requisições** (requests) e recebendo **respostas** (responses).

|           Termo          |                                          O que significa?                                          |
| :----------------------: | :------------------------------------------------------------------------------------------------: |
| **Requisição (Request)** |   É o pedido feito pelo usuário para o servidor. Pode conter dados como um formulário preenchido.  |
|  **Resposta (Response)** | É o que o servidor retorna para o usuário. Pode ser uma mensagem, um arquivo ou até mesmo um erro. |

---

### 🧪 **Exemplo no Express**

```ts
app.get('/saudacao', (req: Request, res: Response): Response => {
  return res.send('Olá, jovem programador!');
});
```

✅ O navegador **faz uma requisição GET para `/saudacao`**.
✅ O servidor **responde com a mensagem "Olá, jovem programador!"**.

---

## 🚦 **3. Como Criar Rotas no Express?**

Aqui está a estrutura básica de uma rota no Express:

```ts
app.metodo('/caminho', (req: Request, res: Response): Response => {
  return res.resposta();
});
```

---

### 🌍 **Principais Métodos HTTP**

|   Método   |            O que faz?            |     Exemplo     |
| :--------: | :------------------------------: | :-------------: |
|   **GET**  |      Busca dados do servidor     |   `/usuarios`   |
|  **POST**  |    Envia dados para o servidor   |   `/usuarios`   |
|   **PUT**  |    Atualiza um recurso inteiro   | `/usuarios/:id` |
|  **PATCH** | Atualiza parcialmente um recurso | `/usuarios/:id` |
| **DELETE** |         Remove um recurso        | `/usuarios/:id` |

---

### 🔧 **PUT vs PATCH – Qual a diferença?**

| Método | Atualiza tudo? | Usado para...             |
| ------ | -------------- | ------------------------- |
| PUT    | Sim            | Substituir todo o recurso |
| PATCH  | Não            | Alterar parte do recurso  |

---

### 📊 **Principais Status HTTP e Seus Significados**

|  Código |      Significado      |               Quando Usar?               |
| :-----: | :-------------------: | :--------------------------------------: |
| **200** |           OK          |    Quando a requisição é bem-sucedida    |
| **201** |        Created        |      Quando um novo recurso é criado     |
| **204** |       No Content      | Sucesso, mas sem resposta (ex: exclusão) |
| **400** |      Bad Request      |          Requisição mal formada          |
| **404** |       Not Found       |        Rota ou recurso não existe        |
| **500** | Internal Server Error |           Deu ruim no servidor           |

---

## 💡 **Exemplos Práticos com Dados**

```ts
// /usuarios/:id => Parâmetros de rota
app.get('/usuarios/:id', (req: Request, res: Response): Response => {
  const id = req.params.id;
  return res.send(`Usuário de ID: ${id}`);
});

// /buscar?termo=javascript => Query string
app.get('/buscar', (req: Request, res: Response): Response => {
  const termo = req.query.termo;
  return res.send(`Buscando por: ${termo}`);
});

// JSON no corpo (body)
app.post('/dados', (req: Request, res: Response): Response => {
  const { nome } = req.body;
  return res.send(`Nome recebido: ${nome}`);
});
```

---

## 🛠 **Exemplo completo com todas as rotas básicas**

```ts
import express, { Application, Request, Response } from 'express';

const app: Application = express();
const PORT: number = 3000;

app.use(express.json());

// 🔹 GET
app.get('/usuarios', (req: Request, res: Response): Response => {
  return res.status(200).json({ mensagem: 'Lista de usuários' });
});

// 🔹 POST
app.post('/usuarios', (req: Request, res: Response): Response => {
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ mensagem: 'Nome é obrigatório!' });
  return res.status(201).json({ mensagem: `Usuário ${nome} criado com sucesso!` });
});

// 🔹 PUT
app.put('/usuarios/:id', (req: Request, res: Response): Response => {
  return res.status(200).json({ mensagem: 'Usuário atualizado completamente!' });
});

// 🔹 PATCH
app.patch('/usuarios/:id', (req: Request, res: Response): Response => {
  return res.status(200).json({ mensagem: 'Usuário atualizado parcialmente!' });
});

// 🔹 DELETE
app.delete('/usuarios/:id', (req: Request, res: Response): Response => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ mensagem: 'ID não enviado' });
  return res.status(204).send(); // Sem conteúdo
});
```

---

## 🏗 **4. O que é um Middleware?**

Um **middleware** é uma função que roda **entre** a requisição e a resposta. Ele pode:

✔️ Modificar ou validar a requisição   
✔️ Bloquear ou liberar o acesso a certas rotas   
✔️ Adicionar logs, cabeçalhos, etc.    

---

### 🧙 **Analogias para facilitar**  

🔹 **O porteiro do seu prédio:** Antes de entrar, ele pode verificar se você é um morador ou um visitante.  

🔹 **Gandalf na ponte de Khazad-dûm (Senhor dos Anéis):**

  - Ele analisa quem está tentando passar *(requisição)*.  
  - Se for um membro da `Sociedade do Anel`, ele permite a passagem *(`next()`)*.  
  - Se for um `Balrog` *(requisição errada)*, ele bloqueia o caminho *(`res.status(403)` - acesso negado)*.

<div align="center">
    <img src="https://media.tenor.com/uUnfd6BfpEgAAAAC/you-shall-not-pass.gif" alt="Gandalf falando You Shall Not Pass">
    <p>
        Fonte: <em><a href="https://ar.inspiredpencil.com/pictures-2023/gandalf-you-shall-not-pass-gif" target="_blank">https://ar.inspiredpencil.com/pictures-2023/gandalf-you-shall-not-pass-gif</a></em>
    </p>
</div>

```ts
const porteiroMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log(`📢 Requisição recebida em: ${req.url}`);
  next(); // Libera a requisição para seguir
};

app.use(porteiroMiddleware); // Middleware global
```

---


## ❌ **Rota 404 para caminhos inválidos**

```ts
app.use((req: Request, res: Response): Response => {
  return res.status(404).json({ mensagem: 'Rota não encontrada!' });
});
```

---

## 🧪 **5. Exercícios para Praticar**

1️⃣ **Crie uma rota GET `/sobre` que retorna JSON com seu nome, idade e descrição.**

2️⃣ **Adicione um middleware que registre a hora exata da requisição no console.**

```
Requisição feita em: 2025-02-17T18:30:12.345Z
```

3️⃣ **Crie uma rota POST `/comentarios` que recebe JSON com "texto".**

* Retorne 400 se estiver vazio
* Retorne 201 se recebido corretamente

4️⃣ **Crie uma rota DELETE `/comentarios/:id`**

* Retorne 204 ao excluir
* Retorne 400 se o ID não for enviado

5️⃣ (**Desafio bônus**) **Crie um middleware que bloqueie requisições feitas entre 00h e 06h.**

---

## ✅ **Resumo da Aula**

✅ Entendemos **requisições, respostas e rotas** no Express    
✅ Aprendemos **os métodos HTTP mais comuns**    
✅ Diferenciamos **PUT vs PATCH**    
✅ Usamos e entendemos **middlewares** com analogias    
✅ Criamos rotas práticas e exercícios para fixar    
✅ Implementamos uma **rota fallback 404**    
