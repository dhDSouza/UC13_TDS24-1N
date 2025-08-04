# 📝 **Atividade: CRUD com Relacionamento (MySQL2/Promise + Express + TypeScript)**

## 🎯 **Objetivo**

Criar uma API RESTful com **Express**, **TypeScript** e **MySQL2/Promise** usando **padrão MVC**, realizando operações **CRUD** com **no mínimo duas tabelas relacionadas**.
Todas as rotas devem ser testadas no **Thunder Client**.

---

## 📂 **Tema da Atividade**

O tema é **livre**, contanto que:

* Tenha pelo menos **2 tabelas** no banco de dados.
* Haja **relacionamento entre essas tabelas** (`1:N` ou `N:N`).
* Todas as rotas sejam implementadas seguindo o padrão MVC.

💡 **Exemplo de tema:** Sistema de gerenciamento de cursos e alunos

* **Tabela `courses`** – Cursos disponíveis
* **Tabela `students`** – Alunos matriculados
* Cada curso pode ter vários alunos (**1\:N**).

---

## 📑 **Requisitos**

### 1️⃣ Estrutura do Projeto

```
src/
 ├── controllers/
 │     ├── entity1Controller.ts
 │     └── entity2Controller.ts
 ├── models/
 │     ├── entity1Model.ts
 │     └── entity2Model.ts
 ├── routes/
 │     ├── entity1Routes.ts
 │     └── entity2Routes.ts
 ├── database/
 │     └── connection.ts
 ├── app.ts
 └── server.ts
```

---

### 2️⃣ Banco de Dados

Criar duas (ou mais) tabelas relacionadas.
Exemplo (caso escolha **Curso x Aluno**):

```sql
CREATE TABLE courses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT
);

CREATE TABLE students (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  course_id INT,
  FOREIGN KEY (course_id) REFERENCES courses(id)
);
```

---

### 3️⃣ Funcionalidades do CRUD

Implementar para **cada entidade**:

* `GET /entidade` → Listar todos
* `GET /entidade/:id` → Buscar por ID
* `POST /entidade` → Criar
* `PUT /entidade/:id` → Atualizar
* `DELETE /entidade/:id` → Excluir

➡️ Se houver relacionamento, usar **JOIN** nas rotas de listagem para trazer dados combinados.

---

### 4️⃣ Regras

* Usar `mysql2/promise` para conexão e queries.
* Seguir padrão **MCR** (`Models`, `Controllers`, `Routes` por enquanto não usaremos `Views`).
* Usar **JOIN** sempre que houver listagem envolvendo relacionamento.
* Tratar erros e retornar status `HTTP` corretos.
* Criar `.env` para dados de conexão.
* Testar **todas as rotas** no `Thunder Client` (incluindo casos de erro).

---

### 5️⃣ Extras (Desafio)

* Criar rota que retorna quantidade de registros relacionados (`JOIN` + `COUNT`).
* Implementar paginação (`GET /entidade?page=1&limit=10`).
* Criar rota que retorna todos os registros de uma entidade relacionados a outra
  (ex: `GET /courses/:id/students`).

---

### ✅ **Critérios de Avaliação**

* Estrutura MVC correta
* CRUD funcional em ambas as tabelas
* Uso correto de **JOIN**
* Testes completos no Thunder Client
* Tratamento de erros e códigos HTTP adequados
* Organização e boas práticas de código
