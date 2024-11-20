const express = require("express");
const app = express();
const cartRoutes = require("./routes/cartRoutes");
const productRoutes = require('./routes/productRoutes'); 

let productRouter;
try {
  productRouter = require("./routes/ProductRoutes"); // Importa o roteador de produtos
  console.log("Roteador de produtos carregado com sucesso.");
} catch (error) {
  console.error("Erro ao carregar o roteador de produtos:", error);
}

const port = 8080; // Porta em que o servidor irá rodar


app.use(express.json());// Middleware para parsear JSON
app.use("/api/carts", cartRoutes); // Registra as rotas de carrinhos

// Roteador de produtos
if (productRoutes) {
  app.use("/api/products", productRoutes);
} else {
  console.error("O roteador de produtos não foi carregado. Verifique o caminho.");
}

// Roteador temporário para carrinhos
cartRoutes.get("/", (req, res) => res.send("Rota de carrinhos ainda em construção."));
app.use("/api/carts", cartRoutes);

// Iniciar o servidor
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
