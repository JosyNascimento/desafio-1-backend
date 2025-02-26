const Cart = require("../dao/models/cart.model");
const Product = require("../dao/models/product.model");

const createCart = async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    return res.status(201).json(newCart);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getCartById = async (req, res) => {
  const cid = Number(req.params.cid);
  try {
    const cart = await cartManager.getCartById(cid);
    if (!cart) return res.status(404).json({ error: "Carrinho não encontrado" });

    const total = await cartManager.getCartTotal(cid);
    return res.json({ cart, total });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const addProductToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).send("Produto não encontrado");

    let cart = await Cart.findOne({ userId: req.session.userId });

    if (!cart) {
      cart = new Cart({
        userId: req.session.userId,
        items: [{ productId: product._id, quantity: parseInt(quantity) }],
      });
    } else {
      const existingItemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === product._id.toString()
      );

      if (existingItemIndex === -1) {
        cart.items.push({ productId: product._id, quantity: parseInt(quantity) });
      } else {
        cart.items[existingItemIndex].quantity += parseInt(quantity);
      }
    }

    await cart.save();
    res.redirect("/cart");
  } catch (error) {
    console.error("Erro ao adicionar ao carrinho:", error);
    res.status(500).send("Erro ao adicionar ao carrinho");
  }
};

const updateCartProductQuantity = async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ message: "Carrinho não encontrado!" });

    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === pid);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      res.status(200).json({ status: "success", message: "Quantidade atualizada!", cart });
    } else {
      res.status(404).json({ message: "Produto não encontrado no carrinho!" });
    }
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

const displayCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.render("cart", {
        title: "Carrinho",
        cart: { items: [] },
        totalQuantity: 0,
        totalPrice: 0,
      });
    }

    const totalQuantity = cart.items.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cart.items
      .reduce((total, item) => total + item.productId.price * item.quantity, 0)
      .toFixed(2);

    res.render("cart", { title: "Carrinho", cart, totalQuantity, totalPrice });
  } catch (error) {
    console.error("Erro ao carregar o carrinho:", error);
    res.status(500).send("Erro ao carregar o carrinho.");
  }
};

const clearCart = async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ message: "Carrinho não encontrado!" });

    cart.items = [];
    await cart.save();

    res.status(200).json({ status: "success", message: "Carrinho limpo com sucesso!" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = {
  createCart,
  getCartById,
  addProductToCart,
  updateCartProductQuantity,
  displayCart,
  clearCart,
};
