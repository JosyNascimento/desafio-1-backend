// Desafio10/src/routes/carts.router.js
const express = require("express");
const router = express.Router();
const {
  createCart,
  getCartById,
  addProductToCart,
  updateCartProductQuantity,
  displayCart,
  clearCart,
} = require("../controllers/cart.controller");

router.post("/", createCart);
router.get("/:cid", getCartById);
router.post("/cart", addProductToCart);
router.put("/:cid/products/:pid", updateCartProductQuantity);
router.get("/", displayCart);
router.delete("/:cid", clearCart);

module.exports = router;
