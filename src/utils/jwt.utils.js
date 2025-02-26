// Desafio10/src/utils/jwt.utils.js
const jwt = require("jsonwebtoken");

const PRIVATE_KEY = process.env.JWT_SECRET || "default_secret"; // Use variável de ambiente

const generateToken = (user) => {
  return jwt.sign(user, PRIVATE_KEY, { expiresIn: "1h" });
};

// Middleware
const authToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).send({ error: "Não esta autenticado" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, PRIVATE_KEY, (err, credentials) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ error: "Não esta autorizado" });
    }
    req.user = credentials;
    next();
  });
};

module.exports = {
  generateToken,
  authToken,
};
