const productService = require("../dao/MongoDB/productService");

const setupWebSocket = (io) => {
    io.on("connection", (socket) => {
      console.log("Cliente conectado:", socket.id);
  
      // Enviar produtos ao conectar
      productService.getProducts().then((products) => {
        socket.emit("updateProducts", products);
      });
  
      // Adicionar um produto
      socket.on("addProduct", async (product) => {
        try {
          await productService.addProduct(product);
          const updatedProducts = await productService.getProducts();
          io.emit("updateProducts", updatedProducts);
        } catch (error) {
          console.error("Erro ao adicionar produto:", error);
        }
      });
  
      // Excluir um produto
      socket.on("deleteProduct", async (productId) => {
        try {
          await productService.deleteProduct(productId);
          const updatedProducts = await productService.getProducts();
          io.emit("updateProducts", updatedProducts);
        } catch (error) {
          socket.emit("error", { message: "Erro ao excluir produto", error: error.message });
        }
      });
    });
  };

  // Comunicação via WebSocket
io.on("connection", (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);
  
    // Enviar produtos ao cliente
    productService.getProducts().then((productsFromDb) => {
      socket.emit("updateProducts", productsFromDb);
    });
  
    
    // Escutar novos produtos
    socket.on('addProduct', async (newProduct) => {
      try {
        await productService.addProduct(newProduct);
        const updatedProducts = await productService.getProducts();
        io.emit("updateProducts", updatedProducts);
      } catch (error) {
        console.error("Erro ao adicionar produto:", error);
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
  
  
  module.exports = setupWebSocket;
  