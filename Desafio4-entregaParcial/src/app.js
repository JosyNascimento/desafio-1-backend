const express = require("express");
const app = express();
const cartRouter = express.Router();

let productRouter;
try {
  productRouter = require("./routes/Products"); // Importa o roteador de produtos
  console.log("Roteador de produtos carregado com sucesso.");
} catch (error) {
  console.error("Erro ao carregar o roteador de produtos:", error);
}

const port = 8080; // Porta em que o servidor irá rodar

// Middleware para parsear JSON
app.use(express.json());

// Roteador de produtos
if (productRouter) {
  app.use("/api/products", productRouter);
} else {
  console.error("O roteador de produtos não foi carregado. Verifique o caminho.");
}

// Roteador temporário para carrinhos
cartRouter.get("/", (req, res) => res.send("Rota de carrinhos ainda em construção."));
app.use("/api/carts", cartRouter);

// Iniciar o servidor
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
