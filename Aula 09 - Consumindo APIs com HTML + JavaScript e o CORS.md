# 🚀 Aula 9: Consumindo APIs com HTML + JavaScript + Entendendo CORS

Nesta aula, vamos aprender como o **frontend (HTML + JS)** se comunica com o **backend (API)** e entender o **CORS**, que é uma proteção de segurança muito importante.

---

## 🤔💭 Relembrando: O que é uma API?

API significa **Application Programming Interface**.
Na web, é um **conjunto de rotas (endpoints)** que permitem que o frontend troque dados com o backend.

Exemplo de endpoint:

```
https://meuservidor.com/api/users
```

➡️ Normalmente, usamos métodos como `GET`, `POST`, `PUT` e `DELETE`.

---

## 📁 Estrutura Básica do Projeto

```
meu-projeto/
│── login.html
│── register.html
│── profile.html
│── js/
│    └── script.js
│    └── profile.js
│── css/
│    └── main.css
```

---

## 📝 Criando os Formulários (Cadastro e Login)

Arquivo `register.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register</title>
    <link rel="stylesheet" href="./css/main.css">
</head>
<body>
    <form id="registerForm">
        <h1>Register Page</h1>
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required>
        <br>
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required>
        <br>
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required>
        <br>
        <button type="submit">Register</button>
        <p>Already have an account? <a href="./login.html">Login</a>
    </form>
    <script src="./js/script.js" defer></script>
</body>
</html>
```

Arquivo `login.html`

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="./css/main.css">
</head>

<body>
    <h1>Login Page</h1>
    <form id="loginForm">
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required>
        <br>
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required>
        <br>
        <button type="submit">Login</button>
        <p>Don't have an account? <a href="./register.html">Sign up</a> here.</p>
    </form>
    <script src="./js/script.js" defer></script>
</body>

</html>
```

---

## ⚡ Enviando Dados para a API (Fetch)

Arquivo `js/script.js`:

```js
// Espera todo o conteúdo da página (HTML) carregar antes de rodar o script
document.addEventListener('DOMContentLoaded', () => {

    // URL base da nossa API (nesse caso local, rodando na porta 3000)
    const apiUrl = 'http://localhost:3000/api';

    // Capturamos os formulários de login e registro do HTML
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // ----------------------
    // BLOCO DE LOGIN
    // ----------------------
    if (loginForm) {
        // Quando o formulário de login for enviado, interceptamos o evento
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // impede o refresh automático da página

            // Pegamos os valores digitados pelo usuário
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                // Fazemos uma requisição POST para a rota /login da API
                const response = await fetch(`${apiUrl}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }, // avisamos que os dados são JSON
                    body: JSON.stringify({ email, password }) // enviamos o corpo da requisição
                });

                // Convertendo a resposta da API em JSON
                const data = await response.json();

                if (response.ok) {
                    // Se a resposta foi 200 (OK), significa login bem-sucedido
                    const token = data.token; // pegamos o token JWT da API
                    localStorage.setItem('token', token); // salvamos no localStorage para usar depois
                    window.location.href = 'profile.html'; // redirecionamos para a página de perfil
                } else {
                    // Se a API retornou erro (ex: senha incorreta)
                    alert(data.message || 'Login failed');
                    window.location.reload(); // recarrega a página para tentar de novo
                }
            } catch (error) {
                // Se houve algum problema (ex: servidor offline)
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
                window.location.reload();
            }
        })
    }

    // ----------------------
    // BLOCO DE REGISTRO
    // ----------------------
    if (registerForm) {
        // Quando o formulário de registro for enviado
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Pegamos os dados do formulário de cadastro
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                // Fazemos a requisição POST para a rota /users da API
                const response = await fetch(`${apiUrl}/users`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password }) // enviamos o JSON
                });

                const data = await response.json();

                if (response.ok) {
                    // Cadastro bem-sucedido
                    alert('Registration successful! You can now log in.');
                    window.location.href = 'login.html'; // manda para a tela de login
                } else {
                    // Algum erro (ex: e-mail já existente)
                    alert(data.message || 'Registration failed');
                    window.location.reload();
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
                window.location.reload();
            }
        })
    }
});
```

---

## 👤 Página de Perfil (Protegida)

Arquivo `profile.html` 

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>User Profile</title>
    <link rel="stylesheet" href="css/main.css">
</head>

<body>
    <h1>My Profile</h1>

    <div class="profile-info">
        <h2 id="profileName"></h2>
        <p id="profileEmail"></p>
        <div id="profileActions" class="profile-actions"></div>
    </div>

    <div id="userPosts" class="posts-container"></div>


    <h2>My Posts</h2>
    <div id="posts">Loading posts...</div>

    <script src="./js/profile.js" defer></script>
</body>

</html>
```

Arquivo `js/profile.js`:

```js
// URL base da nossa API
const apiUrl = 'http://localhost:3000/api';

// Recupera o token que foi salvo no localStorage no momento do login
const token = localStorage.getItem('token');

// Se não tiver token, significa que o usuário não está logado → manda pra tela de login
if (!token) window.location.href = 'login.html';

// ----------------------
// FUNÇÃO: Carregar Perfil do Usuário
// ----------------------
async function loadProfile() {
    try {
        // Faz uma requisição GET para a rota /me (dados do usuário logado)
        const res = await fetch(`${apiUrl}/me`, {
            headers: { Authorization: `Bearer ${token}` } // envia o token no cabeçalho
        });
        if (!res.ok) throw new Error('Failed to fetch profile');

        // Converte a resposta para JSON (objeto usuário)
        const user = await res.json();

        // Mostra os dados do usuário na tela (HTML)
        document.getElementById('profileName').innerText = user.name;
        document.getElementById('profileEmail').innerText = user.email;

        // Cria os botões de ação (editar perfil, criar post, voltar e logout)
        const actionsContainer = document.getElementById('profileActions');
        actionsContainer.innerHTML = `
            <a href="edit-profile.html">Edit Profile</a>
            <a href="create-post.html">Create Post</a>
            <a href="index.html">Back to Home</a>
            <button id="logoutBtn">Logout</button>
        `;

        // Evento do botão logout → remove token e redireciona pro login
        document.getElementById('logoutBtn').addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        });
    } catch (err) {
        console.error(err);
        alert('Error loading profile');
    }
}

// ----------------------
// FUNÇÃO: Carregar Posts do Usuário
// ----------------------
async function loadPosts() {
    try {
        // Busca todos os posts cadastrados
        const res = await fetch(`${apiUrl}/posts`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch posts');

        const posts = await res.json();
        const container = document.getElementById('userPosts');
        container.innerHTML = ''; // limpa antes de renderizar

        // Busca dados do usuário logado para filtrar só os posts dele
        const resUser = await fetch(`${apiUrl}/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const currentUser = await resUser.json();

        // Filtra os posts que pertencem ao usuário logado
        const userPosts = posts.filter(p => p.user.id === currentUser.id);

        // Se não houver posts → mostra mensagem
        if (userPosts.length === 0) {
            container.innerHTML = '<p>No posts yet.</p>';
            return;
        }

        // Para cada post do usuário, cria um card na tela
        userPosts.forEach(post => {
            const card = document.createElement('div');
            card.classList.add('post-card'); // adiciona classe para estilizar
            card.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content}</p>
                <small>By ${post.user.name}</small>
                <div class="post-actions">
                    <a href="edit-post.html?id=${post.id}">Edit</a>
                    <button data-id="${post.id}" class="deleteBtn">Delete</button>
                </div>
            `;
            container.appendChild(card);
        });

    } catch (err) {
        console.error(err);
        alert('Error loading posts');
    }
}

// ----------------------
// Chamadas iniciais → carrega perfil e posts assim que abrir a página
// ----------------------
loadProfile();
loadPosts();
```

---

## 🔥 Mas e o tal do CORS?

Agora entra a parte importante: **CORS (Cross-Origin Resource Sharing)**.

👉 Se seu **frontend** roda em `http://localhost:5500` e seu **backend** em `http://localhost:3000`, o navegador entende que são **origens diferentes**.

Por padrão, o navegador **bloqueia** a requisição para proteger o usuário.

---

## 🛡️ Como o CORS funciona

Quando o navegador tenta acessar a API, ele envia um **pré-pedido (preflight)** com `OPTIONS` perguntando:

*"Ei servidor, posso fazer requisições daqui (frontend) para você?"*

Se o backend permitir, ele responde com cabeçalhos como:

```http
Access-Control-Allow-Origin: http://localhost:5500
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

Se não responder corretamente ➡️ o navegador bloqueia e você vê um erro de **CORS** no console.

---

## ⚙️ Como Resolver Problemas de CORS

### 🖥️ No Backend (correto ✅)

Exemplo em **Express (Node.js)**:

```js
import express, { Application, Request, Response } from "express";
import cors from "cors";

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: ["http://localhost:5500", "http://127.0.0.1:5500"] })); // Libera o acesso apenas ao seu frontend (rodando no Live Server).
```

Ou, durante o desenvolvimento, liberar tudo (não recomendado em produção):

```js
app.use(cors()); 
```

### 🌐 No Frontend (não tem como ❌)

Não existe gambiarra para "desativar" o CORS no navegador.
O jeito certo é **configurar o backend** para aceitar o domínio do frontend.

---

## ✅ Conclusão

* O **HTML** cria a interface.
* O **JavaScript** usa `fetch` para enviar/receber dados.
* O **backend** responde (e precisa estar configurado com **CORS**).
* Em **desenvolvimento**, pode liberar tudo.
* Em **produção**, configure apenas os domínios autorizados.

👉 Agora você sabe não só **consumir APIs no frontend** como também **o que é CORS e por que ele é essencial**. 🚀
