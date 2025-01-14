const express = require('express');
const router = express.Router();
const User = require('../dao/mongodb/user.model');

// Rota para a página de registro (GET)
router.get('/register', (req, res) => {
  res.render('register');
});

// Rota para Registro de Usuário (POST)
router.post('/register', async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  try {
    // Verificar se o usuário já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('Usuário já cadastrado');
    }

    // Criar um novo usuário
    const newUser = new User({
      first_name,
      last_name,
      email,
      age,
      password,
      role: 'user', // Função padrão para usuários
    });

    // Salvar o novo usuário no banco
    await newUser.save();

    // Redirecionar para a página de login com uma mensagem de sucesso
    res.redirect('/login?message=Usuário cadastrado com sucesso');
  } catch (error) {
    console.log('Erro ao cadastrar no banco', error);
    res.status(500).send('Erro ao cadastrar no banco');
  }
});

// Rota para o perfil do usuário (GET)
router.get('/profile', (req, res) => {
  if (!req.session.user) {
    return res.status(401).send('Acesso não autorizado');
  }

  // Exibir os dados do perfil
  const { first_name, last_name, age } = req.session.user;
  res.render('profile', { first_name, last_name, age });
});

module.exports = router;
