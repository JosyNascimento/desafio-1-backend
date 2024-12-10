const Product = require('../models/product.model');

const getProducts = async () => {
  return await Product.find();
};

const addProduct = async (product) => {
  return await Product.create(product);
};

module.exports = { getProducts, addProduct };
