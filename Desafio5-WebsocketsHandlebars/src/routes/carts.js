const express = require('express');
const CartManager = require('../CartManager');
const router = express.Router();
const cartManager = new CartManager();

(async () => {
  await cartManager.loadCarts();
})();

router.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    return res.status(201).json(newCart);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/:cid', async (req, res) => {
  const cid = Number(req.params.cid);
  try {
    const cart = await cartManager.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ error: 'Carrinho não encontrado' });
    }
    return res.json(cart);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/:cid/product/:pid', async (req, res) => {
  const cid = Number(req.params.cid);
  const pid = Number(req.params.pid);
  try {
    const updatedCart = await cartManager.addProductToCart(cid, pid);
    if (!updatedCart) {
      return res.status(404).json({ error: 'Carrinho não encontrado' });
    }
    return res.json(updatedCart);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
