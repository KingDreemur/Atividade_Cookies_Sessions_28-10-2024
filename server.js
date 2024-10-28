//Importando o Framework
const express = require('express');

//cookies e sessions
const session = require('express-session');
const cookieParser = require('cookie-parser');

//Iniciar o express
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
  res.send('<h1>Bem-vindo <a href="/login">Login</a> | <a href="/seguro">Usuário Cadastrado[Entrar]</a></h1>');
});

// Página de login
app.get('/login', (req, res) => {
  res.send('<form method="POST" action="/login">Usuário: <input type="text" name="username"/><br>Senha: <input type="password" name="password"/><br><button type="submit">Login</button></form> <br><a>Usuário:giovane</br></a><br><a>Senha:senha</br></a>');
});


app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Validação
  if (username === 'giovane' && password === 'senha') {
    req.session.user = username;
    res.redirect('/seguro');
  } else {
    res.send('Usuário não Cadastrado, <a href="/login">Tente novamente</a>');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.send('Você Deslogou da Sua Conta <a href="/">Voltar à página inicial</a>');
});

app.get('/seguro', (req, res) => {
  if (req.session.user) {
    res.send(`<h1>Página Do Usuário Logado</h1><p>Bem-vindo, ${req.session.user}! </p> <p> <a href="/logout">Logout</a> ,ou, <a href="/">Retornar Ao Inicio</a> </p>`);
  } else {
    res.send('Acesso negado <a href="/login">Faça login para continuar</a>');
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
  res.send(`<h1>Página Do Usuário Logado</h1><p>Bem-vindo, ${req.session.user}! </p> <p> <a href="/logout">Logout</a> ,ou, <a href="/">Retornar Ao Inicio</a> </p>`);
});