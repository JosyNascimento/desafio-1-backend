
const bcrypt = require('bcrypt');

// Função para criar hash de password
const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

// alidar password
const isValidPassword = (password, userPassword) => bcrypt.compareSync(password, userPassword);

module.exports = { createHash, isValidPassword };