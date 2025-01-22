// routes/cart.js
const express = require('express');
const CartManager = require('../CartManager');
const router = express.Router();
const cartManager = new CartManager();
const cart = await Cart.findOne({ userId: req.user.id }); // Exemplo de busca por ID de usuário

(async () => {
  await cartManager.loadCarts();
  await cartManager.loadProducts();  // Carregar os produtos também
})();

// Criar um novo carrinho
router.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    return res.status(201).json(newCart);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Buscar carrinho por ID
router.get('/:cid', async (req, res) => {
  const cid = Number(req.params.cid);
  try {
    const cart = await cartManager.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ error: 'Carrinho não encontrado' });
    }
    const total = await cartManager.getCartTotal(cid);  // Calculando o total do carrinho
    return res.json({ cart, total });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Adicionar produto ao carrinho
router.post('/:cid/product/:pid', async (req, res) => {
  const cid = Number(req.params.cid);
  const pid = Number(req.params.pid);
  try {
    const updatedCart = await cartManager.addProductToCart(cid, pid);
    if (!updatedCart) {
      return res.status(404).json({ error: 'Carrinho não encontrado ou produto inválido' });
    }
    const total = await cartManager.getCartTotal(cid);  // Atualizando o total
    return res.json({ updatedCart, total });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
// Rota para exibir o carrinho
router.get("/", async (req, res) => {
  try {
    const cart = await Cart.findOne();  // Encontrar o carrinho (ajuste conforme seu modelo)
    if (!cart) {
      return res.render("cart", { message: "Carrinho não encontrado" });
    }

    // Calcular o total
    let totalPrice = 0;
    cart.items.forEach(item => {
      totalPrice += item.quantity * item.productId.price;  // Ajuste aqui conforme seu modelo
    });

    // Renderizar a página do carrinho, passando o totalPrice
    res.render("cart", { title: "Carrinho de Compras", cart, totalPrice });
  } catch (error) {
    console.error('Erro ao carregar o carrinho:', error);
    res.status(500).json({ message: 'Erro ao carregar o carrinho', error: error.message });
  }
});


module.exports = router;
