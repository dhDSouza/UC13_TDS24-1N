# 🛡️ Segurança de Senhas com Bcrypt, TypeORM & Express  
## 🌍 *Desde a Terra Média até o continente de Westeros...*

## 🎬 Introdução

> "Guardar uma senha sem hash é como esconder o Um Anel no próprio dedo."  
> – Frodo Baggins _(provavelmente não)_

<div align="center">
    <img src="https://media1.tenor.com/m/9oT8tCjmcIIAAAAd/lotr-frodo.gif">
    <p>Fonte: <em><a href="https://media1.tenor.com/m/9oT8tCjmcIIAAAAd/lotr-frodo.gif" target="_blank">https://media1.tenor.com/m/9oT8tCjmcIIAAAAd/lotr-frodo.gif</a></em></p>
</div>

Salvar senhas **sem criptografia** é como deixar a chave da sua conta bancária em cima da mesa — ou pior, como o Frodo desfilando com o Um Anel no dedo. 👁️🔥  

Se um hacker invadir o sistema, ele vai encontrar as senhas ali, de bandeja. 😱  
Nós não queremos que informações **preciosas** venham a parar nas mãos de outra pessoa.

<div align="center">
    <img src="https://media1.tenor.com/m/A0R9p3ygQw0AAAAC/smeagol-my.gif">
    <p>Fonte: <em><a href="https://media1.tenor.com/m/A0R9p3ygQw0AAAAC/smeagol-my.gif" target="_blank">https://media1.tenor.com/m/A0R9p3ygQw0AAAAC/smeagol-my.gif</a></em></p>
</div>


É por isso que usamos funções de **hashing**, como o poderoso **bcrypt** 🔐 – nosso feitiço de proteção contra as sombras da internet.

---

## 🧠 O Que É Hash?  

**Hashing** é um processo que transforma dados de qualquer tamanho em uma sequência fixa de caracteres, geralmente um número hexadecimal, usando uma função matemática chamada **função hash**. Essa sequência gerada é chamada de **hash** ou **resumo criptográfico**.  

### 📌 Características principais do hashing:

1. **Tamanho fixo** → Independentemente do tamanho da entrada, o hash sempre terá um comprimento fixo (ex: `SHA-256` sempre gera um hash de 256 bits).
2. **Determinístico** → A mesma entrada sempre gera o mesmo hash.
3. **Irreversível** → Não dá para obter a entrada original a partir do hash (hashing é um processo unidirecional).
4. **Efeito avalanche** → Pequenas mudanças na entrada geram um hash completamente diferente.
5. **Rápido de calcular** → A função hash é projetada para ser eficiente em termos computacionais.

### 🛠️ Exemplos de funções hash:

- **MD5** (128 bits) → Antigo, mas vulnerável a ataques de colisão.
- **SHA-1** (160 bits) → Também considerado inseguro para criptografia.
- **SHA-256** (256 bits) → Muito usado em segurança e blockchain.
- **bcrypt, scrypt, Argon2** → Hashes usados para armazenar senhas com maior segurança.

### 🔒 Aplicações do hashing:
✅ **Armazenamento seguro de senhas** (com salting para evitar ataques de dicionário).  
✅ **Verificação de integridade de arquivos** (ex: checksums em downloads).  
✅ **Índices em bancos de dados** (ex: buscas mais rápidas).  
✅ **Estruturas de dados como tabelas hash** (ex: dicionários em Python).  
✅ **Criptografia e blockchain** (ex: Bitcoin usa SHA-256).  

### 🔍 Hashing ≠ Criptografia

| Hashing                       | Criptografia                             |
| ----------------------------- | ---------------------------------------- |
| Unidirecional 🔒              | Bidirecional 🔄                         |
| Não se reverte (senha → hash) | Pode-se descriptografar                  |
| Ideal para senhas             | Ideal para dados sigilosos (ex: cartões) |

### 💍 Analogia:

> A senha original é como o **Um Anel**.  
> Quando você faz o hash, é como jogá-lo no **Fogo da Montanha da Perdição**:  
> ele se transforma em algo **irrecuperável**. 💥

<div align="center">
    <img src="https://media1.tenor.com/m/EpOhEGBTLwAAAAAC/the-one-ring.gif">
    <p>Fonte: <em><a href="https://media1.tenor.com/m/EpOhEGBTLwAAAAAC/the-one-ring.gif" target="_blank">https://media1.tenor.com/m/EpOhEGBTLwAAAAAC/the-one-ring.gif</a></em></p>
</div>

---

## 🧊 O Bcrypt – A Muralha de Westeros

**Bcrypt é a Muralha que impede os White Walkers (hackers) de atravessar.**  

<div align="center">
    <img src="https://i.makeagif.com/media/12-11-2018/335rJJ.gif">
    <p>Fonte: <em><a href="https://i.makeagif.com/media/12-11-2018/335rJJ.gif" target="_blank">https://i.makeagif.com/media/12-11-2018/335rJJ.gif</a></em></p>
</div>

O `bcrypt` garante 3 coisas:

1. **Salt**: cada hash é temperado com um valor aleatório (evita ataques por dicionário). 
2. **Hash único**, mesmo para senhas iguais.
3. **Lentidão proposital**, dificultando ataques de força bruta.

---

## ⚙️ Setup do Projeto

```bash
npm i bcryptjs
npm i @types/bcryptjs -D
```

---

## 🧙‍♂️ Hooks do TypeORM – A Magia Automática nos Bastidores

Imagine se você pudesse lançar um feitiço que **executa automaticamente** uma ação toda vez que algo acontece com uma entidade — como salvar ou atualizar um usuário.
É exatamente isso que os **hooks** do TypeORM fazem! 🪄

---

### 🧠 O que são Hooks?

**Hooks** (também chamados de *listeners* ou *lifecycle events*) são **métodos especiais** que são chamados **automaticamente** em momentos específicos do ciclo de vida de uma entidade.

Você pode usá-los para executar lógica personalizada **antes ou depois** de eventos como:

| Evento          | O que significa                                                               |
| --------------- | ----------------------------------------------------------------------------- |
| `@BeforeInsert` | Antes de inserir no banco (ex: novo usuário) ⚠️                               |
| `@AfterInsert`  | Depois que foi inserido no banco ✅                                            |
| `@BeforeUpdate` | Antes de atualizar no banco (ex: alteração de senha) 🛠️                      |
| `@AfterUpdate`  | Depois que foi atualizado                                                     |
| `@BeforeRemove` | Antes de deletar                                                              |
| `@AfterRemove`  | Depois que foi deletado                                                       |
| `@AfterLoad`    | Quando a entidade é carregada do banco (útil para lógica pós-carregamento) 📦 |

---

## 🧱 Model User (com uso dos Hooks @BeforeInsert/@BeforeUpdate/@AfterLoad)

```ts
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, AfterLoad } from "typeorm"; // Importando as funcionalidades necessárias do TypeORM
import * as bcrypt from "bcryptjs"; // Importando o bcryptjs para o hash da senha

// Decorator para definir a classe como uma entidade do banco de dados
@Entity()
export class User {

  // Define a coluna 'id' como chave primária e auto incrementada
  @PrimaryGeneratedColumn()
  id!: number; // O '!' significa que o valor será atribuído posteriormente, não nulo

  // Define a coluna 'name' com um limite de 100 caracteres e não pode ser nula
  @Column({ length: 100, nullable: false })
  name: string;

  // A coluna 'email' não pode ser nula e deve ser única
  @Column({ nullable: false, unique: true })
  email: string;

  // A coluna 'password' não pode ser nula e tem um limite de 255 caracteres
  @Column({ nullable: false, length: 255 })
  password: string;

  // A coluna 'phone' será do tipo 'varchar' com no máximo 15 caracteres
  @Column({ type: "varchar", length: 15 })
  phone: string;

  // A coluna 'role' será um enum que pode ser 'costumer' ou 'admin', com valor padrão 'costumer'
  @Column({ type: "enum", enum: ["costumer", "admin"], nullable: false, default: 'costumer' })
  role?: string;

  // Variável privada para armazenar a senha anterior para comparação em atualizações de senha
  private previousPassword!: string;

  // Hook BeforeInsert e BeforeUpdate: Esta função será chamada antes de inserir ou atualizar o usuário no banco
  @BeforeInsert() // Antes de inserir um novo usuário
  @BeforeUpdate() // Antes de atualizar um usuário existente
  async hashPassword() {
    // Verifica se a senha foi alterada, para não fazer hash desnecessariamente
    if (this.password && this.password !== this.previousPassword) {
      const salt = await bcrypt.genSalt(10); // Gera um 'salt' com 10 rounds, o salt é uma string aleatória que irá aumentar a segurança do hash
      this.password = await bcrypt.hash(this.password, salt); // Faz o hash da senha com o salt gerado
    }
  }

  // Hook AfterLoad: Este hook é chamado depois de carregar o usuário do banco
  @AfterLoad()
  setPreviousPassword() {
    // Aqui estamos salvando a senha original para comparar em futuras atualizações
    this.previousPassword = this.password;
  }

  // O construtor da classe, que será usado para instanciar o objeto 'User'
  constructor(name: string, email: string, password: string, phone: string) {
    this.name = name; // Atribui o nome passado para a propriedade 'name'
    this.email = email; // Atribui o e-mail passado para a propriedade 'email'
    this.password = password; // Atribui a senha passada para a propriedade 'password'
    this.phone = phone; // Atribui o telefone passado para a propriedade 'phone'
  }
}
```

Antes de inserir ou atualizar um usuário, será feito o hash de sua senha.

---

## 📡 Controller do Usuário

```ts
// Importando os tipos Request e Response do Express
import { Request, Response } from "express";

// Importando a instância do banco de dados configurada com TypeORM
import { AppDataSource } from '../config/data-source';

// Importando o model de usuário que representa a tabela de usuários no banco
import { User } from '../models/User';

// Importando o bcryptjs, uma biblioteca para encriptação de senhas
import * as bcrypt from "bcryptjs";

// Criando um repositório do TypeORM para interagir com a tabela de usuários
const repo = AppDataSource.getRepository(User);

// Classe responsável por controlar as ações relacionadas ao usuário
export class UserController {

  // Método para login do usuário
  async login(req: Request, res: Response): Promise<Response> {
    try {
      // Extraímos o email e a senha do corpo da requisição (body)
      const { email, password } = req.body;

      // Verificamos se o email e a senha foram enviados na requisição
      if(!email || !password) {
        return res.status(400).json({ message: "Email e senha são obrigatórios!" });
      }

      // Buscamos no banco de dados um usuário com o email fornecido
      const user = await repo.findOneBy({ email });

      // Se não encontrar o usuário, retorna erro 404 (não encontrado)
      if (!user) return res.status(404).json({ message: "Usuário não encontrado." });

      // Comparando a senha enviada com a senha criptografada salva no banco
      const isValid = await bcrypt.compare(password, user.password);

      // Se a senha não for válida, retorna erro 401 (não autorizado)
      if (!isValid) return res.status(401).json({ message: "Senha inválida." });

      // Se tudo estiver certo, retorna uma resposta de sucesso
      return res.json({ message: "Login autorizado" });

    } catch (error) {
      // Caso ocorra algum erro inesperado, capturamos e registramos no console
      console.error('Erro ao fazer login!', error);

      // Retornamos um erro 500 (erro interno do servidor)
      return res.status(500).json({ message: "Erro ao fazer login" });
    }
  }
}
```

---

## 🎯 Conclusão

✅ Você aprendeu:

- O que é **hash**, **sal** e por que o `bcrypt` é uma muralha de proteção.  
- Como implementar tudo usando `TypeORM`, `Express`.  
- Como lidar com registro e login de forma segura.  
- E ainda viajou pela Terra Média e Westreos no processo. 😎
