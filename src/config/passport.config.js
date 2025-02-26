// Desafio9/src/config/passport.config.js
const passport = require('passport');
const local = require('passport-local');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../dao/models/user.model');
const bcrypt = require('bcrypt');  // Importando bcrypt


const localStrategy = local.Strategy;

// Função utilitária para buscar usuário
const findUserByEmail = async (email) => {
  try {
    return await User.findOne({ email });
  } catch (error) {
    throw new Error(`Erro ao buscar usuário: ${error.message}`);
  }
};

// Função utilitária para verificar a senha
const isValidPassword = (password, userPassword) => {
  return bcrypt.compareSync(password, userPassword);
};

const initializePassport = () => {
  passport.use('register', new localStrategy({
    passReqToCallback: true, usernameField: 'email', passwordField: 'password'
  }, async (req, username, password, done) => {
    const { first_name, last_name, email } = req.body;
    try {
      let user = await User.findOne({ email: username });
      if (user) {
        console.log("User already exists");
        return done(null, false, { message: 'E-mail já registrado' });
      }

      const newUser = new User({ first_name, last_name, email, password: createHash(password) });

      let result = await newUser.save();
      return done(null, result);
    } catch (error) {
      console.error(`Erro ao registrar usuário: ${error}`);
      return done(null, false, { message: 'Erro interno ao registrar o usuário' });
    }
  }));

  passport.use('github', new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'http://localhost:8080/githubcallback',
  }, 
  async (accessToken, refreshToken, profile, done) => {
     console.log('Access Token:', accessToken);
  console.log('Refresh Token:', refreshToken);
    try {
      console.log(profile);
      let user = await User.findOne({ email: profile._json.email });
      if (!user) {
        let newUser = {
          first_name: profile._json.name.split(' ')[0],
          last_name: profile._json.name.split(' ')[1],
          email: profile._json.email,
          password: "",
        };
        let result = await User.create(newUser);
        return done(null, result);
      }
      return done(null, user);
    } catch (error) {
      return done(`Erro ao autenticar usuário: ${error}`);
    }
  }));

  passport.use('login', new localStrategy({ usernameField: 'email', passwordField: 'password' }, async (username, password, done) => {
    try {
      let user = await User.findOne({ email: username });
      if (!user) {
        console.log("User not found");
        return done(null, false, { message: 'Usuário não encontrado' });
      }

      console.log("✅ Usuário encontrado:", user.email);
      console.log("🔑 Senha salva no banco:", user.password);
      
// Usando a versão assíncrona
const passwordMatch = await isValidPassword(password, user.password);
console.log("🔍 Comparação:", passwordMatch);


if (!passwordMatch) {
  console.log("❌ Senha inválida");
  return done(null, false, { message: 'Senha inválida' });
}

return done(null, user);
} catch (error) {
return done(`Erro ao autenticar usuário: ${error}`);
}
}));
  function createHash(password) {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
}

  passport.use('reset-password', new localStrategy({ usernameField: 'email', passwordField: 'password'}, async (username, password, done) => {
    try {
      const userFound = await User.findOne({ email: username });
      if (!userFound) {
        console.log("User not found");
        return done(null, false, { message: 'Usuário não encontrado' });
      }

      const newPass = createHash(password);
      await User.updateOne({ email: username }, { password: newPass });
      return done(null, userFound);
    } catch (error) {
      return done(null, false, { message: `Erro ao alterar a senha: ${error}` });
    }
  }));

  
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      let user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(`Erro ao buscar usuário: ${error}`);
    }
  });
};

module.exports = initializePassport;
