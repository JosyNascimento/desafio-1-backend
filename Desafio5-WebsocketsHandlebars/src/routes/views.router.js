const express = require("express");
const router = express.Router();

// Página inicial
router.get("/", (req, res) => {
  res.render("home", { title: "Página Inicial", products: [] });
});

// Página de produtos em tempo real
app.get('/', (req, res) => {
    res.render('home', {
      title: 'Página Inicial',
      products: [
        {
          id: 1,
          title: 'Notebook Dell Inspiron 15',
          description: 'Notebook com processador Intel i5, 8GB de RAM e 512GB SSD.',
          price: 3500.0,
        },
        {
          id: 2,
          title: 'Smartphone Samsung Galaxy S22',
          description: 'Smartphone com tela AMOLED de 6.1" e 128GB de armazenamento.',
          price: 3800.0,
        },
      ],
    });
  });

module.exports = router;
