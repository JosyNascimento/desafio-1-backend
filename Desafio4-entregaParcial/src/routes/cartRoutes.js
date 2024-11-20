// src/routes/cartRoutes.js

const express = require("express");
const router = express.Router();
const fs = require("fs").promises;
const path = require("path");

const cartsFilePath = path.join(__dirname, "../data/carts.json");

// Rota para adicionar carrinho
router.post("/", async (req, res) => {
  try {
    const { products } = req.body;

    // Verifica se o campo 'products' é um array
    if (!Array.isArray(products)) {
      return res.status(400).json({ error: "Formato inválido. Envie um array de produtos." });
    }

    const data = await fs.readFile(cartsFilePath, "utf-8");
    const cartsData = JSON.parse(data);

    // Verifica se o arquivo JSON contém a chave 'carts', caso contrário, cria
    const carts = cartsData.carts || [];

    // Cria um novo carrinho
    const newCart = {
      id: carts.length + 1, // Define um ID único para o carrinho
      products,
    };

    // Adiciona o novo carrinho à lista de carrinhos
    carts.push(newCart);

    // Salva novamente os dados no arquivo JSON
    await fs.writeFile(cartsFilePath, JSON.stringify({ carts }, null, 2));

    res.status(201).json({ message: "Carrinho adicionado com sucesso", cartId: newCart.id });
  } catch (error) {
    console.error("Erro ao adicionar carrinho:", error);
    res.status(500).json({ error: "Erro ao adicionar carrinho" });
  }
});

// Rota para buscar carrinho por ID
router.get("/:cid", async (req, res) => {
  try {
    const data = await fs.readFile(cartsFilePath, "utf-8");
    const carts = JSON.parse(data).carts;

    const cartId = parseInt(req.params.cid, 10);
    const cart = carts.find((c) => c.id === cartId);

    if (!cart) {
      return res.status(404).json({ error: "Carrinho não encontrado" });
    }

    res.json(cart);
  } catch (error) {
    console.error("Erro ao acessar os dados dos carrinhos:", error);
    res.status(500).json({ error: "Erro ao acessar os dados dos carrinhos" });
  }
});


// Rota para adicionar um produto a um carrinho específico
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const data = await fs.readFile(cartsFilePath, "utf-8");
    const carts = JSON.parse(data).carts;

    const cartId = parseInt(cid, 10);
    const productId = parseInt(pid, 10);

    const cart = carts.find((c) => c.id === cartId);

    if (!cart) {
      return res.status(404).json({ error: "Carrinho não encontrado" });
    }

    // Verifica se o produto já está no carrinho
    const existingProduct = cart.products.find(p => p.product === productId);
    if (existingProduct) {
      return res.status(400).json({ error: "Produto já está no carrinho" });
    }

    // Adiciona o produto ao carrinho com o ID do produto
    cart.products.push({ product: productId, quantity: 1 });

    // Salva novamente os dados no arquivo JSON
    await fs.writeFile(cartsFilePath, JSON.stringify({ carts }, null, 2));

    res.status(201).json({ message: "Produto adicionado ao carrinho", cart });
  } catch (error) {
    console.error("Erro ao adicionar produto ao carrinho:", error);
    res.status(500).json({ error: "Erro ao adicionar produto ao carrinho" });
  }
});

module.exports = router;
