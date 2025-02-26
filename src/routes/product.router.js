const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  addProduct,
  deleteProduct,
} = require("../controllers/product.controller");

router.get("/products", getAllProducts);
router.post("/products", addProduct);
router.delete("/products/:id", deleteProduct);

module.exports = router;
