const express = require('express');
const passport = require('passport');
const { 
    renderLoginPage, 
    githubAuth, 
    githubCallback, 
    loginUser, 
    failLogin, 
    logoutUser 
} = require('../controllers/session.controller'); // Importa as funções do controller

const router = express.Router();

// Middleware para adicionar usuário à resposta local
router.use((req, res, next) => {
    if (req.session.user) {
        res.locals.user = req.session.user;
    }
    next();
});

// Definição das rotas
router.get('/login', renderLoginPage);
router.get('/github', githubAuth);
router.get('/githubcallback', githubCallback);
router.post('/login', loginUser);
router.get('/faillogin', failLogin);
router.get('/logout', logoutUser);

module.exports = router;
