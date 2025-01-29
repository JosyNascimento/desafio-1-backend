const express = require('express');
const passport = require('passport');
const router = express.Router();

router.use((req, res, next) => {
    if (req.session.user) {
        res.locals.user = req.session.user;
    }
    next();
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/github', passport.authenticate('github', scope = ['user:email']), (req, res) => {
    console.log(req.session);
}); 

router.get('githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    req.session.user = req.user; // Salva o usuário na sessão
    res.redirect('/perfil'); // Redireciona para a página de perfil
});

router.post('/login', async (req, res, next) => {
    passport.authenticate("login", (err, user, info) => {
        if (err) {
            return next(err); // Tratar erro de autenticação
        }
        if (!user) {
            return res.redirect('/faillogin'); // Redireciona para página de falha
        }

        // Sucesso na autenticação
        req.session.user = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
        };

        res.redirect('/perfil'); // Redireciona para o perfil do usuário
    })(req, res, next); // Necessário chamar a função diretamente
});


router.get("/faillogin", (req, res) => {
    console.log("Falha no login - usuário ou senha inválidos");
    res.redirect('/login?message=Usuário ou senha inválidos')
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (!err) {
            res.send('Logout efetuado com sucesso!');
        } else {
            res.send({ status: 'Erro no logout', body: err });
        }
    });
});

module.exports = router;