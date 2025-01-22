// user.router.js 
const express = require('express');
const User = require('../dao/models/user.model');
const path = require('path');
const router = express.Router();
const bcrypt = require('bcryptjs');

const ADMIN_EMAIL = 'adminCoder@coder.com'; // Definindo o e-mail do admin

console.log("Iniciando o user.router.js");

// Rota para a página de registro (GET)
router.get('/register', (req, res) => {
  res.render('register');
});

// Rota para registrar usuários (POST)
router.post('/register', async (req, res) => {
  console.log('Rota /register acessada');  // Verifique se a rota está sendo chamada
  const { first_name, last_name, email, age, password } = req.body; // Extraia o role aqui
  try {
    // Verificar se o usuário já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Usuário cadastrado com sucesso!.' });
    }
    
     // Hashar a senha
     const hashedPassword = await bcrypt.hash(password, 10);


    // Definir o role
    const role = email === ADMIN_EMAIL ? 'admin' : 'user';
     // Criar um novo usuário
     const newUser = new User({
      first_name,
      last_name,
      email,
      age,
      password,
      role, // Função padrão para usuários
    });

    if (existingUser) {
      return res.status(409).json({ message: 'Usuário já cadastrado.' });
    }
    

    await newUser.save(); // Salva o novo usuário no MongoDB


    // Redirecionar para a página de login com uma mensagem de sucesso
    res.redirect('/register?message=Usuário cadastrado com sucesso!');
  } catch (error) {
    console.log('Erro ao cadastrar no banco', error);
    res.status(500).send('Erro ao cadastrar no banco');
  }
});

// Rota para listar usuários
router.get('/users', async (req, res) => {
  try {
    const users = await User.find(); // Busca todos os usuários
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});


// Rota para exibir a lista de usuários
router.get('/list', async (req, res) => {
  try {
      const users = await User.find(); 
      console.log(users); 
      res.render('list', { users }); 
  } catch (error) {
      console.error('Erro ao carregar usuários:', error); 
      res.status(500).send('Erro ao carregar usuários');
  }
});



module.exports = router;
