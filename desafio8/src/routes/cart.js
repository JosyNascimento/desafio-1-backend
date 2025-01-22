const express = require('express');
const Cart = require("../dao/models/carts.model");
const Product = require("../dao/models/product.model");
const router = express.Router();

// Rota POST para criar um novo carrinho
router.post('/', async (req, res) => {
  try {
    // Exemplo: Criando um novo carrinho
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

// Rota POST para adicionar produto ao carrinho
router.post('/cart', async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    // Verifica se o produto existe no banco
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send('Produto não encontrado');
    }

    // Verifica se já existe um carrinho
    let cart = await Cart.findOne({ userId: req.session.userId }); // Exemplo, assumindo que você tenha um sistema de sessão

    if (!cart) {
      // Se não houver carrinho, cria um novo
      cart = new Cart({
        userId: req.session.userId, // Assumindo que você tem o ID do usuário na sessão
        items: [{ productId: product._id, quantity: parseInt(quantity) }]
      });
      await cart.save();
    } else {
      // Se já houver carrinho, verifica se o produto já está presente
      const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === product._id.toString());

      if (existingItemIndex === -1) {
        // Se o produto não estiver no carrinho, adiciona um novo item
        cart.items.push({ productId: product._id, quantity: parseInt(quantity) });
      } else {
        // Se o produto já estiver no carrinho, apenas atualiza a quantidade
        cart.items[existingItemIndex].quantity += parseInt(quantity);
      }

      await cart.save();
    }

    res.redirect('/cart'); // Redireciona para a página do carrinho
  } catch (error) {
    console.error('Erro ao adicionar ao carrinho:', error);
    res.status(500).send('Erro ao adicionar ao carrinho');
  }
});

// Rota PUT para atualizar quantidade no carrinho
router.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  try {
    const cart = await Cart.findById(cid);
    if (!cart)
      return res.status(404).json({ message: "Carrinho não encontrado!" });

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === pid
    );
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      res.status(200).json({
        status: "success",
        message: "Quantidade atualizada com sucesso!",
        cart,
      });
    } else {
      res.status(404).json({ message: "Produto não encontrado no carrinho!" });
    }
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Rota para exibir o carrinho
router.get("/", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }); // Certifique-se de que "req.user" esteja definido corretamente
    if (!cart) {
      return res.render("cart", {
        title: "Carrinho",
        cart: { items: [] },
        totalQuantity: 0,
        totalPrice: 0,
      });
    }

    const totalQuantity = cart.items.reduce(
      (total, item) => total + item.quantity,
      0
    );
    const totalPrice = cart.items
      .reduce((total, item) => total + item.productId.price * item.quantity, 0)
      .toFixed(2);

    res.render("cart", { title: "Carrinho", cart, totalQuantity, totalPrice });
  } catch (error) {
    console.error("Erro ao carregar o carrinho:", error);
    res.status(500).send("Erro ao carregar o carrinho.");
  }
});

// Rota DELETE para limpar o carrinho
router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await Cart.findById(cid);
    if (!cart)
      return res.status(404).json({ message: "Carrinho não encontrado!" });

    cart.items = [];
    await cart.save();

    res
      .status(200)
      .json({ status: "success", message: "Carrinho limpo com sucesso!" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;
