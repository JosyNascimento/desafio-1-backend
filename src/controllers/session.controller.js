const passport = require('passport');

const renderLoginPage = (req, res) => {
    res.render('login');
};

const githubAuth = passport.authenticate('github', { scope: ['user:email'] });

const githubCallback = passport.authenticate('github', { failureRedirect: '/login' }, (req, res) => {
    req.session.user = req.user;
    res.redirect('/perfil');
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

const logoutUser = (req, res) => {
    req.session.destroy(err => {
        if (!err) {
            res.send('Logout efetuado com sucesso!');
        } else {
            res.send({ status: 'Erro no logout', body: err });
        }
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
