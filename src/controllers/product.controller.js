const Product = require("../dao/models/product.model");
const productService = require('../services/productService');

// Controlador para listar os produtos
const listProducts = async (req, res) => {
  try {
    const products = await productService.getProducts();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar produtos', error: err });
  }
};

// Controlador para adicionar um produto
const createProduct = async (req, res) => {
  try {
    const newProduct = await productService.addProduct(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar produto', error: err });
  }
};

const getAllProducts = async (req, res) => {
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
};

const addProduct = async (req, res) => {
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
};

// Controlador para excluir um produto
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Produto excluído com sucesso" });
  } catch (error) {
    res.status(400).json({ message: "Erro ao excluir produto", error: error.message });
  }
};

module.exports = { listProducts, 
  createProduct,
  getAllProducts,
  addProduct,
  deleteProduct,
};
