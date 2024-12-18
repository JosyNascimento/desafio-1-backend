const express = require("express");
const handlebars = require("express-handlebars");
const path = require('path');
const { Server } = require("socket.io");
const http = require("http");
const { engine } = require('express-handlebars');


const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração do Handlebars como Template Engine
app.engine("handlebars", handlebars.engine({
  defaultLayout: 'main'  // Define 'main.handlebars' como o layout padrão
}));

app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

// Configuração para arquivos estáticos

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  console.log('Requisição recebida para:', req.url);
  next();
});

// Lista de produtos inicial
let products = [
  { id: 1, title: "Notebook Dell Inspiron 15", description: "Notebook com processador Intel i5, 8GB de RAM e 512GB SSD.", price: 3500.00 },
  { id: 2, title: "Smartphone Samsung Galaxy S22", description: "Smartphone com tela AMOLED de 6.1\" e 128GB de armazenamento.", price: 3800.00 },
  { id: 3, title: "Cadeira Gamer DXRacer", description: "Cadeira ergonômica para jogos com ajuste de altura e apoio lombar.", price: 899.99 },
  { id: 4, title: "Smart TV 50\" LG OLED", description: "Smart TV com tela OLED, resolução 4K e sistema operacional webOS.", price: 4750.00 },
  { id: 5, title: "Fones de Ouvido Bluetooth Sony", description: "Fones de ouvido sem fio com cancelamento de ruído ativo e bateria de longa duração.", price: 950.00 }
];

// Roteador para views
app.get("/", (req, res) => {
  res.render("home", { title: "Página Inicial", products });
});

app.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", { title: "Produtos em Tempo Real" });
});

// Comunicação via WebSocket
io.on("connection", (socket) => {
  console.log("Novo cliente conectado");

  // Atualiza os produtos em tempo real
  socket.emit("updateProducts", products);

  socket.on("addProduct", (product) => {
    products.push(product);
    io.emit("updateProducts", products);
  });

  socket.on("deleteProduct", (productId) => {
    products = products.filter((p) => p.id !== productId);
    io.emit("updateProducts", products);
  });
  socket.on('connect', () => {
    console.log('Conectado ao WebSocket');
  });
  
  socket.on('updateProducts', (products) => {
    const productList = document.getElementById("productList");
    productList.innerHTML = ''; // Limpa a lista
    products.forEach((product) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <h2>${product.title}</h2>
        <p>${product.description}</p>
        <p><strong>Preço:</strong> R$ ${product.price}</p>
        <button class="deleteButton">Excluir</button>
      `;
      productList.appendChild(li);
    });
  });
  
  

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

// Iniciar o servidor
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
