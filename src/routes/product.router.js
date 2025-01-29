const express = require("express");
const Product = require("../dao/models/product.model");
const productService = require("../dao/MongoDB/productService");


const router = express.Router();

// Rota para obter todos os produtos
router.get("/products", async (req, res) => {
  try {
    const { query, sort, page = 1, limit = 10 } = req.query;

    // Filtros e busca
    const filters = query === "inStock" ? { stock: { $gt: 0 } } : query ? { category: query } : {};

    // Ordenação
    const sortOption = sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {};

    // Paginação
    const skip = (page - 1) * limit;
    const products = await Product.find(filters)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const totalProducts = await Product.countDocuments(filters);
    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({
      status: "success",
      payload: products,
      totalPages,
      page: Number(page),
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Rota para adicionar um produto
router.post("/products", async (req, res) => {
  try {
    const { title, description, price, category, stock, image } = req.body;

    const newProduct = new Product({
      title,
      description,
      price,
      category,
      stock,
      image,
    });

    await newProduct.save();

    res.status(201).json({ message: "Produto adicionado com sucesso", product: newProduct });
  } catch (error) {
    res.status(400).json({ message: "Erro ao adicionar produto", error: error.message });
  }
});

// Rota para excluir um produto
router.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Produto excluído com sucesso" });
  } catch (error) {
    res.status(400).json({ message: "Erro ao excluir produto", error: error.message });
  }
});

module.exports = router;
