// Desafio8/src/routes/session.JSON
const express = require('express');
const router = express.Router();
const User = require('../dao/models/user.model');
const bcrypt = require('bcrypt');

// Usuário admin hardcoded
const ADMIN_EMAIL = 'adminCoder@coder.com';
const ADMIN_PASSWORD = 'adminCod3r123';

// Middleware para adicionar o usuário à variável locals
router.use((req, res, next) => {
  if (req.session.user) {
    res.locals = { user: req.session.user };
  };
  next();
});

// Rota para renderizar a página de login
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Substitua esta lógica pela validação que você configurou no seu projeto
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send('Usuário não encontrado');
    }

      // Compara a senha inserida com a armazenada (hash)
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).send('Senha incorreta');
      }

    // Autenticação bem-sucedida
    res.send('Login bem-sucedido');
  } catch (error) {
    console.error('Erro ao realizar login:', error);
    res.status(500).send('Erro interno no servidor');
  }
});

// Rota para logout
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (!err) {
      res.send('Logout efetuado com sucesso!');
    } else {
      res.send({ status: 'Erro no logout', body: err });
    }
  });
});

module.exports = router;
