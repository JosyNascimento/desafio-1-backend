// dao/mongodb/connection.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://joseildatn:coder@clustercoder.f3sfq.mongodb.net/');
    console.log('Conectado ao MongoDB com sucesso');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB: ' + error);
    process.exit(1); // Encerra o processo se a conexão falhar
  }
};

module.exports = connectDB;
