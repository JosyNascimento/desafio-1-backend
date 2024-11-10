const express = require('express');
const ProductManager = require('../ProductManager');
const router = express.Router();
const productManager = new ProductManager();

(async () => {
  await productManager.loadProducts();
})();

router.get('/', async (req, res) => {
  const limit = Number(req.query.limit);
  try {
    let products = await productManager.getAllProducts();
    if (!isNaN(limit) && limit > 0) {
      products = products.slice(0, limit);
    }
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/:pid', async (req, res) => {
  const pid = Number(req.params.pid);
  try {
    const product = await productManager.getProductById(pid);
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    return res.json(product);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  const productData = req.body;
  try {
    const newProduct = await productManager.addProduct(productData);
    return res.status(201).json(newProduct);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put('/:pid', async (req, res) => {
  const pid = Number(req.params.pid);
  const productData = req.body;
  try {
    const updatedProduct = await productManager.updateProduct(pid, productData);
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    return res.json(updatedProduct);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/:pid', async (req, res) => {
  const pid = Number(req.params.pid);
  try {
    const deletedProduct = await productManager.deleteProduct(pid);
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
