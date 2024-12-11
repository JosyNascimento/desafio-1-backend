const express = require("express");
const handlebars = require("express-handlebars");
const path = require('path');
const { Server } = require("socket.io");
const http = require("http");
const connectMongo = require('./dao/MongoDB/connection');
const Message = require('./dao/models/message.model'); // Modelo de mensagens
const Product = require('./dao/models/product.model');  // Ajuste o caminho se necessário
const Cart = require('./dao/models/cart.model'); // Ajuste o caminho se necessário

connectMongo(); // Conecta ao MongoDB usando o arquivo de conexão

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
app.set("views", path.join(__dirname, "views"));

// Configuração para arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

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

app.get("/chat", (req, res) => {
  res.render("chat", { title: "Chat em Tempo Real" });
});

app.post('/addProduct', (req, res) => {
  const { title, description, price } = req.body;
  
  const newProduct = { id: products.length + 1, title, description, price };

  // Adicionando o novo produto à lista (para testes)
  products.push(newProduct);

  // Respondendo com uma mensagem de sucesso e os dados do produto
  res.status(200).json({
    message: 'Produto adicionado com sucesso',
    product: newProduct
  });
});



app.post('/addToCart', async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    // Verificando se o produto existe
    const product = await Product.findById(productId);  // Produto sendo buscado pelo ID
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado!' });
    }

    // Procurando o carrinho do usuário
    let cart = await Cart.findOne();

    if (!cart) {
      // Caso não tenha carrinho, cria um novo
      cart = new Cart();
    }

    // Verificando se o produto já existe no carrinho
    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (itemIndex > -1) {
      // Se o produto já existe no carrinho, atualiza a quantidade
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Caso não exista, adiciona um novo item ao carrinho
      cart.items.push({ productId, quantity });
    }

    // Salvando o carrinho
    await cart.save();

    // Respondendo com o carrinho atualizado
    res.status(200).json({
      message: 'Produto adicionado ao carrinho com sucesso!',
      cart
    });

  } catch (error) {
    // Exibindo detalhes do erro para facilitar o diagnóstico
    console.error('Erro ao adicionar ao carrinho:', error);
    res.status(500).json({ message: 'Erro ao adicionar produto ao carrinho', error: error.message });
  }
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

  // Envio e recebimento de mensagens do chat
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

// Iniciar o servidor
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
