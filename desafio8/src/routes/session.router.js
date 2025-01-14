// routes/session.router.js
const express = require('express');
const router = express.Router();
const User = require('../dao/mongodb/user.model');
const bcrypt = require('bcrypt');

// Rota para Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });
  
  if (!user || !(await user.comparePassword(password))) {
    return res.status(400).send('Email ou senha incorretos');
  }

  req.session.user = user; // Armazena os dados do usuário na sessão
  res.redirect('/products'); // Redireciona para a página de produtos após o login
});

// Rota para Logout
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Erro ao encerrar a sessão');
    }
    res.redirect('/login');
  });
});

module.exports = router;
