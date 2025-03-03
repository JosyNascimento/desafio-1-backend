const passport = require('../config/passport.config.js');

const renderLoginPage = (req, res) => {
    res.render('login');
};

const githubAuth = passport.authenticate('github');

const githubCallback = passport.authenticate('github', {
    failureRedirect: '/login',
    successRedirect: '/perfil'
});

const loginUser = async (req, res, next) => {
    passport.authenticate("login", (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.redirect('/faillogin');

        req.session.user = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
        };

        res.redirect('/perfil');
    })(req, res, next);
};

const failLogin = (req, res) => {
    console.log("Falha no login - usuário ou senha inválidos");
    res.redirect('/login?message=Usuário ou senha inválidos');
};

const logoutUser = async (req, res) => {
    await req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
};

module.exports = {
    renderLoginPage,
    githubAuth,
    githubCallback,
    loginUser,
    failLogin,
    logoutUser
};