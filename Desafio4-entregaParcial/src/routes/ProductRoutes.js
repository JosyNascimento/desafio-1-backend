// src/routes/productsRoutes.js

const express = require("express");
const router = express.Router();
const fs = require("fs").promises;
const path = require("path");

const productsFilePath = path.join(__dirname, "../data/products.json");

// Rota para buscar todos os produtos
router.get("/", async (req, res) => {
  try {
    const data = await fs.readFile(productsFilePath, "utf-8");
    const products = JSON.parse(data).products;
    res.json(products);
  } catch (error) {
    console.error("Erro ao acessar os produtos:", error);
    res.status(500).json({ error: "Erro ao acessar os produtos" });
  }
});

// Rota para buscar um produto por ID
router.get("/:pid", async (req, res) => {
  try {
    const data = await fs.readFile(productsFilePath, "utf-8");
    const products = JSON.parse(data).products;
    
    const productId = parseInt(req.params.pid, 10);
    const product = products.find((p) => p.id === productId);

    if (!product) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.json(product);
  } catch (error) {
    console.error("Erro ao acessar os produtos:", error);
    res.status(500).json({ error: "Erro ao acessar os produtos" });
  }
});

// Rota para adicionar um novo produto
router.post("/", async (req, res) => {
  try {
    const { name, price, description } = req.body;

    if (!name || !price || !description) {
      return res.status(400).json({ error: "Faltando dados para criar o produto" });
    }

    const data = await fs.readFile(productsFilePath, "utf-8");
    const productsData = JSON.parse(data);

    const products = productsData.products || [];

    const newid = products.length> 0 ? products[products.length - 1]. id + 1 : 1;

    
    // Cria um novo produto
    const newProduct = { id: newId, // Definindo um ID único para o produto
      name,
      price,
      description,
      quantity,
      stock,
      category,
      thumbnails,
      status: status || "true "
    };

    products.push(newProduct);

    // Salva novamente os dados no arquivo JSON
    await fs.writeFile(productsFilePath, JSON.stringify({ products }, null, 2));

    res.status(201).json({ message: "Produto adicionado com sucesso", productId: newProduct.id });
  } catch (error) {
    console.error("Erro ao adicionar produto:", error);
    res.status(500).json({ error: "Erro ao adicionar produto" });
  }
});

// // Rota PUT para atualizar um produto
router.put("/:pid", async (req, res) => {
  try {
    const productId = parseInt(req.params.pid, 10);


     const data = await fs.readFile(productsFilePath, "utf-8");
    const productsData = JSON.parse(data);

    const products = productsData.products || [];
    const productIndex = products.findIndex((p) => p.id === productId);

    if (productIndex === -1) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    // Atualiza o produto
    //products[productindex] = { id: productid, name, price, description};
    products[productIndex] = { ...products[productIndex], ...updatedProduct };

    // Salva novamente os dados no arquivo JSON
    await fs.writeFile(productsFilePath, JSON.stringify({ products }, null, 2));

    res.status(200).json({ message: "Produto atualizado com sucesso", productId });
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    res.status(500).json({ error: "Erro ao atualizar produto" });
  }
});

// Rota DELETE para remover um produto
router.delete("/:pid", async (req, res) => {
  try {
    const productId = parseInt(req.params.pid, 10);

    const data = await fs.readFile(productsFilePath, "utf-8");
    const productsData = JSON.parse(data);

    const products = productsData.products || [];
    const productIndex = products.findIndex((p) => p.id === productId);

    if (productIndex === -1) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    // Remove o produto
    products.splice(productIndex, 1);

    // Salva novamente os dados no arquivo JSON
    await fs.writeFile(productsFilePath, JSON.stringify({ products }, null, 2));

    res.status(200).json({ message: "Produto removido com sucesso" });
  } catch (error) {
    console.error("Erro ao remover produto:", error);
    res.status(500).json({ error: "Erro ao remover produto" });
  }
});

module.exports = router;
