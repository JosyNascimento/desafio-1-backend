// routes/view.router.jss
const express = require("express");
const router = express.Router();


// Página inicial
router.get("/", (req, res) => {
  res.render("home", { title: "Página Inicial", products: [] });
});

router.get('/list', async (req, res) => {
  console.log("na rota list");
  try {
    let users = await userModel.find();
    // console.log(users);
    users = users.map((user) => user.toJSON());

    return res.render('users', { users });
  } catch (error) {
    return res.render('error', { error: error.message });
  }
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let user = await userModel.findById(id);
    user = user.toJSON();
    return res.render('update', { user });
  } catch (error) {
    return res.render('error', { error: error.message });
  }
});

// Rota para exibir os produtos
router.get('/products', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const role = req.session.user.role;
  const username = req.session.user.email;

  res.render('products', {
    username,
    role,
    welcomeMessage: role === 'admin' ? `Bem-vindo, Admin ${username}!` : `Bem-vindo, ${username}!`
  });
});


module.exports = router;
