
const authenticate = (req, res, next) => {
    console.log(req.session?.user); 
    // Verifique a autenticação, como um token JWT ou sessão
    if (req.session?.user) {
      req.user = req.session.user;  // Defina req.user com as informações do usuário
      return next();  // Se autenticado, continue para o próximo middleware
    }
  
    return res.status(401).json({ message: 'Usuário não autenticado' });
  };
  
  module.exports = authenticate;
  
