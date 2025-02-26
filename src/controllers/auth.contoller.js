require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../../dao/models/user.model");
const passport = require("passport");

const renderLoginPage = (req, res) => {
  res.render("login");
};

const githubAuth = passport.authenticate("github", { scope: ["user:email"] });

const githubCallback = passport.authenticate("github", { failureRedirect: "/login" });

const handleGithubCallback = (req, res) => {
  req.session.user = req.user;
  res.redirect("/perfil");
};

const loginUser = (req, res, next) => {
  passport.authenticate("login", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: "Usuário ou senha inválidos" });

    req.logIn(user, (err) => {
      if (err) return next(err);

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({
        message: "Login bem-sucedido",
        token,
        user: {
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
        },
      });
    });
  })(req, res, next);
};

const failLogin = (req, res) => {
  res.status(401).json({ message: "Usuário ou senha inválidos" });
};

const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (!err) {
      res.redirect("/login");
    } else {
      res.status(500).json({ message: "Erro no logout", error: err });
    }
  });
};

module.exports = {
  renderLoginPage,
  githubAuth,
  githubCallback,
  handleGithubCallback,
  loginUser,
  failLogin,
  logoutUser,
};
