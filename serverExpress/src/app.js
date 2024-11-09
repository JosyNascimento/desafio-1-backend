const express = require("express");
const ProductManager = require("./ProductManager");

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
app.get("/products/:pid", async (req, res) => {
  const pid = Number(req.params.pid);

  try {
    const product = await productManager.getProductById(pid);
    return res.json(product);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
});

// Rota para listar todos os produtos, com suporte para limite opcional
app.get("/products", async (req, res) => {
  const limit = Number(req.query.limit); // Obtém o limite dos parâmetros de consulta

  try {
    let products = await productManager.getAllProducts();

    // Aplica o limite se ele for válido
    if (!isNaN(limit) && limit > 0) {
      products = products.slice(0, limit);
    }

    return res.json(products);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
