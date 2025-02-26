const express = require('express');
const passport = require('passport');
const { autenticacao } = require('../middlewares/auth.middleware');
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
router.get('/perfil', autenticacao, getUserProfile);
router.get('/reset-password', renderResetPasswordPage);
router.get('/failreset', failResetPassword);
router.post("/reset-password", passport.authenticate('reset-password', { failureRedirect: '/failreset', failureMessage: true }), resetPassword);
router.get('/list', listUsers);

module.exports = router;
