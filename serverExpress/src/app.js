const express = require('express');
const ProductManager = require('./ProductManager'); // Ajuste o caminho se necessário

const app = express();
const port = 3000;

const productManager = new ProductManager();

// Middleware para parsear JSON
app.use(express.json());

// Rota para buscar um produto pelo ID
app.get('/products/:pid', async (req, res) => {
  const pid = Number(req.params.pid);
  const product = productManager.getProductById(pid);

  if (!product) {
    return res.status(404).json({ error: 'Produto não encontrado' });
  }
  return res.json(product);
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
