const express = require('express');
const passport = require('passport');
const {
    registerUser,
    getUserProfile,
    renderResetPasswordPage,
    failResetPassword,
    resetPassword,
    listUsers
} = require('../controllers/user.controller');

const router = express.Router();

router.post('/register', registerUser);

router.get('/perfil', (req, res, next) => {
    if (req.session.user) {
        getUserProfile(req, res, next);
    } else {
        // Se a sessão não existir, use o middleware de autenticação (JWT)
        require('../middlewares/auth.middleware').autenticacao(req, res, next);
    }
});

router.get('/reset-password', renderResetPasswordPage);
router.get('/failreset', failResetPassword);
router.post("/reset-password", passport.authenticate('reset-password', { failureRedirect: '/failreset', failureMessage: true }), resetPassword);
router.get('/list', listUsers);

module.exports = router;