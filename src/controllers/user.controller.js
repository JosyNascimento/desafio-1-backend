const User = require('../dao/models/user.model');
const { createHash } = require('../utils/password');

const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password, role, avatar } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('E-mail já cadastrado');
    }

    const hashedPassword = createHash(password);

    const newUser = await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role: role || "user",
      avatar: avatar || "public/img/sandra.jpg",
    });

    return res.status(201).json({ message: "Usuário cadastrado com sucesso", user: newUser });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    return res.status(500).json({ message: "Erro no servidor" });
  }
};

const getUserProfile = (req, res) => {
  const { first_name, last_name, email, age } = req.session.user;
  res.render('perfil', { first_name, last_name, email, age });
};

const renderResetPasswordPage = (req, res) => {
  res.render('reset-password');
};

const failResetPassword = (req, res) => {
  const messages = req.session.messages || [];
  req.session.messages = [];
  const errorMessage = messages.length > 0 ? messages[0] : "Erro ao resetar password";
  res.send(`Erro ao resetar password: ${errorMessage}`);
};

const resetPassword = async (req, res) => {
  return res.redirect('/login?message=Senha redefinida com sucesso');
};

const listUsers = async (req, res) => {
  try {
    const users = await User.find().lean();
    res.render('list', {
      title: 'Lista de Usuários',
      isAdmin: req.user?.role === 'admin',
      users,
    });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).send('Erro ao buscar usuários');
  }
};

module.exports = {
  registerUser,
  getUserProfile,
  renderResetPasswordPage,
  failResetPassword,
  resetPassword,
  listUsers,
};
