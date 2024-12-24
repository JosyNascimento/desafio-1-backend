// Dependências
const express = require("express");
const handlebars = require("express-handlebars");
const path = require('path');
const { Server } = require("socket.io");
const http = require("http");
const connectMongo = require('./dao/MongoDB/connection');
const Message = require('./dao/models/message.model'); // Modelo de mensagens
const Cart = require('./dao/models/cart.model'); // Modelo de carrinho
const Product = require('./dao/models/product.model'); // Modelo de produtos
const productService = require('./dao/MongoDB/productService');


connectMongo(); // Conecta ao MongoDB usando o arquivo de conexão

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Configuração do express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração do Handlebars como Template Engine
app.engine("handlebars", handlebars.engine({
  defaultLayout: 'main'  // Define 'main.handlebars' como o layout padrão
}));

app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')));

// Comunicação via WebSocket
io.on("connection", (socket) => {
  console.log("Novo cliente conectado");

  // Enviar produtos do banco de dados ao conectar
  productService.getProducts().then((productsFromDb) => {
    socket.emit("updateProducts", productsFromDb);  // Enviar lista de produtos
  });

  // Adicionar um produto
  socket.on("addProduct", async (product) => {
    try {
      await productService.addProduct(product);
      const updatedProducts = await productService.getProducts();
      io.emit("updateProducts", updatedProducts);  // Atualiza todos os clientes
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
    }
  });

  // Excluir um produto
  socket.on("deleteProduct", async (productId) => {
    try {
      await productService.deleteProduct(productId);
      const updatedProducts = await productService.getProducts();
      io.emit("updateProducts", updatedProducts);  // Atualiza todos os clientes
    } catch (error) {
      console.error('Erro ao remover produto:', error);
    }
  });

  // Enviar e receber mensagens do chat
  Message.find().then((messages) => {
    socket.emit("messageHistory", messages);
  });

  socket.on("newMessage", async (msg) => {
    await Message.create(msg);
    const messages = await Message.find();
    io.emit("messageHistory", messages);
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

// Roteadores
app.get("/", (req, res) => {
  res.render("home", { title: "Página Inicial" });
});

app.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

app.get('/list', (req, res) => {
  res.render('list', { title: 'List' });
});

app.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", { title: "Produtos em Tempo Real" });
});

app.get("/chat", (req, res) => {
  res.render("chat", { title: "Chat em Tempo Real" });
});

// Rota para obter todos os produtos
app.get('/products', async (req, res) => {
  try {
    const products = await productService.getProducts();
    res.status(200).json({
      message: 'Produtos listados com sucesso',
      products: products
    });
  } catch (error) {
    console.error('Erro ao obter os produtos:', error);
    res.status(500).json({ message: 'Erro ao obter os produtos', error: error.message });
  }
});

// Rota para adicionar um novo produto via HTTP
app.post('/addProduct', async (req, res) => {
  const { title, description, price } = req.body;

  try {
    const newProduct = await productService.addProduct({
      title,
      description,
      price
    });
    res.status(200).json({
      message: 'Produto adicionado com sucesso',
      product: newProduct
    });

    // Atualiza todos os clientes via WebSocket
    io.emit("updateProducts", await productService.getProducts());
  } catch (error) {
    console.error('Erro ao adicionar produto:', error);
    res.status(500).json({ message: 'Erro ao adicionar o produto', error: error.message });
  }
});

// Rota para adicionar um produto ao carrinho
app.post('/addToCart', async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado!' });
    }

    let cart = await Cart.findOne() || new Cart();
    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.status(200).json({
      message: 'Produto adicionado ao carrinho com sucesso!',
      cart
    });
  } catch (error) {
    console.error('Erro ao adicionar ao carrinho:', error);
    res.status(500).json({ message: 'Erro ao adicionar produto ao carrinho', error: error.message });
  }
});

// Iniciar o servidor
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
