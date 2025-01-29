const express = require('express');
const User = require('../dao/models/user.model');
const router = express.Router();
const { autenticacao } = require('../middlewares/auth.middleware');
const { createHash } = require('../utils/password');
const passport = require('passport');

const ADMIN_EMAIL = 'adminCoder@coder.com'; // Definindo o e-mail do admin

console.log("Iniciando o user.router.js");


// Rota POST para registro de novo usuário
router.post('/register', async (req, res, next) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    // Verificar se o e-mail já está cadastrado
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('E-mail já cadastrado');
    }

    // Criptografar a senha antes de salvar
    const hashedPassword = createHash(password);

    // Salva o novo usuário no banco de dados
    const newUser = await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role: req.body.role || "user",
      avatar: req.body.avatar|| "public/img/sandra.jpg",
    });

    // Responde com sucesso
    return res.status(201).json({ message: "Usuário cadastrado com sucesso", user: newUser });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    return res.status(500).json({ message: "Erro no servidor" });
  }
});

// Rota para perfil do usuário
router.get('/perfil', autenticacao, (req, res) => {
  const { first_name, last_name, email, age } = req.session.user;
  res.render('perfil', { first_name, last_name, email, age });
});

// Rota para resetar senha
router.get('/reset-password', (req, res) => {
  res.render('reset-password');
});

// Rota de falha ao resetar senha
router.get("/failreset", (req, res) => {
  const messages = req.session.messages || [];
  req.session.messages = [];
  const errorMessage = messages.length > 0 ? messages[0] : "Erro ao resetar password";
  res.send(`Erro ao resetar password: ${errorMessage}`);
});

// Rota POST para resetar senha
router.post("/reset-password", passport.authenticate('reset-password', { failureRedirect: '/failreset', failureMessage: true }), async (req, res) => {
  return res.redirect('/login?message=Senha redefinida com sucesso');
});

// Rota para exibir a lista de usuários
router.get('/list', async (req, res) => {
  try {
    const users = await User.find().lean();
    res.render('list', {
      title: 'Lista de Usuários',
      isAdmin: req.user?.role === 'admin', // Verificar se o usuário tem o papel de admin
      users,
    });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).send('Erro ao buscar usuários');
  }
});

module.exports = router;
