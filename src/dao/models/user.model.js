// dao/models/user.model.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userCollection = "users"; // Definindo o nome da coleção

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  avatar: { 
    type: String, 
    default: '/public/img/gustavo.jpeg' // Caminho para a imagem padrão
  }
});

// Método para criptografar a senha antes de salvar
userSchema.pre('save', async function(next) {
  try {
    const saltRounds = 10; // Número de rounds de hash
    this.password = await bcrypt.hash(this.password, saltRounds); 
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar a senha fornecida com a senha criptografada
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;