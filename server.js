// Importando o Framework
const express = require('express');

// cookies e sessions
const session = require('express-session');
const cookieParser = require('cookie-parser');

// Iniciar o express
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: 'Segredosecreto',
  resave: false,
  saveUninitialized: true
}));

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});

// Página inicial
app.get('/', (req, res) => {
  res.send(`
    <style>
      body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
      a { text-decoration: none; color: white; background-color: #007bff; padding: 10px 20px; border-radius: 5px; }
      a:hover { background-color: #0056b3; }
    </style>
    <h1>Bem-vindo!</h1>
    <p><a href="/login">Login</a> | <a href="/seguro">Usuário Cadastrado [Entrar]</a></p>
  `);
});

// Página de login
app.get('/login', (req, res) => {
  res.send(`
    <style>
      body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
      form { display: inline-block; text-align: left; }
      label { display: block; margin-top: 10px; }
      input { width: 100%; padding: 8px; margin-top: 5px; }
      button { margin-top: 15px; padding: 10px 20px; border: none; background-color: #007bff; color: white; border-radius: 5px; }
      button:hover { background-color: #0056b3; }
      .hint { color: gray; font-size: 0.9em; }
    </style>
    <h1>Login</h1>
    <form method="POST" action="/login">
      <label>Usuário:</label>
      <input type="text" name="username" required/>
      <label>Senha:</label>
      <input type="password" name="password" required/>
      <button type="submit">Entrar</button>
    </form>
    <p class="hint">Dica: Usuário: giovane | Senha: senha</p>
  `);
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Validação
  if (username === 'giovane' && password === 'senha') {
    req.session.user = username;
    res.redirect('/seguro');
  } else {
    res.send(`
      <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; color: red; }
        a { text-decoration: none; color: white; background-color: #007bff; padding: 10px 20px; border-radius: 5px; }
        a:hover { background-color: #0056b3; }
      </style>
      <h1>Usuário não cadastrado!</h1>
      <p><a href="/login">Tente novamente</a></p>
    `);
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.send(`
    <style>
      body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
      a { text-decoration: none; color: white; background-color: #007bff; padding: 10px 20px; border-radius: 5px; }
      a:hover { background-color: #0056b3; }
    </style>
    <h1>Você deslogou da sua conta</h1>
    <p><a href="/">Voltar à página inicial</a></p>
  `);
});

app.get('/seguro', (req, res) => {
  if (req.session.user) {
    res.send(`
      <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        a { text-decoration: none; color: white; background-color: #007bff; padding: 10px 20px; border-radius: 5px; }
        a:hover { background-color: #0056b3; }
      </style>
      <h1>Página do Usuário Logado</h1>
      <p>Bem-vindo, ${req.session.user}!</p>
      <p><a href="/logout">Logout</a> | <a href="/">Retornar ao início</a></p>
    `);
  } else {
    res.send(`
      <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        a { text-decoration: none; color: white; background-color: #007bff; padding: 10px 20px; border-radius: 5px; }
        a:hover { background-color: #0056b3; }
      </style>
      <h1>Acesso negado!</h1>
      <p><a href="/login">Faça login para continuar</a></p>
    `);
  }
});

function authMiddleware(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

// Aplicar o middleware na rota protegida
app.get('/seguro', authMiddleware, (req, res) => {
  res.send(`
    <style>
      body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
      a { text-decoration: none; color: white; background-color: #007bff; padding: 10px 20px; border-radius: 5px; }
      a:hover { background-color: #0056b3; }
    </style>
    <h1>Página do Usuário Logado</h1>
    <p>Bem-vindo, ${req.session.user}!</p>
    <p><a href="/logout">Logout</a> | <a href="/">Retornar ao início</a></p>
  `);
});
