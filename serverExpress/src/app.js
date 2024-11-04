const express = require('express');
const ProductManager = require('./ProductManager'); 

const app = express();
const port = 3000;

const productManager = new ProductManager();

// Middleware parsear JSON
app.use(express.json());

// Carregar produtos antes de iniciar o servidor
(async () => {
  await productManager.loadProducts();
})();

// Rota para buscar um produto pelo ID
app.get('/products/:pid', async (req, res) => {
  const pid = Number(req.params.pid);
  
  try {
    const product = await productManager.getProductById(pid);
    return res.json(product);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
