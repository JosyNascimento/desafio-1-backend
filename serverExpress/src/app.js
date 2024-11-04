const express = require('express');
const ProductManager = require('./ProductManager'); 

const app = express();
const port = 8080; // Porta em que o servidor irá rodar

const productManager = new ProductManager();

// Middleware para parsear JSON
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

// Nova rota para listar todos os produtos
app.get('/products', async (req, res) => {
  try {
    const products = await productManager.getAllProducts();
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
