// Desafio10-ReestruturaçãodoServidor/src/routes/session.router.js
const express = require('express');
const passport = require('passport');
const {
    renderLoginPage,
    githubAuth,
    githubCallback,
    loginUser,
    failLogin,
    logoutUser
} = require('../controllers/session.controller');

const router = express.Router();

router.use((req, res, next) => {
    if (req.session.user) {
        res.locals.user = req.session.user;
    }
    next();
});

router.get('/login', renderLoginPage);
router.get('/github', passport.authenticate('github'));
router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    console.log("Dados de req.user do GitHub:", req.user); // Adicionado console.log aqui
    req.session.user = req.user; // Salva o usuário na sessão
    res.redirect('/perfil'); // Redireciona para a página de perfil
});
router.post('/login', loginUser);
router.get('/faillogin', failLogin);
router.get('/logout', logoutUser);

module.exports = router;