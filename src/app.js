// Desafio10-ReestruturaçãodoServidor/src/app.js
require('dotenv').config();
const express = require("express");
const http = require("http");
const handlebars = require("express-handlebars");
const path = require('path');
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const authRouter = require('./routes/auth.router');
const { Server } = require("socket.io");
const Message = require('./dao/models/message.model');
const setupWebSocket = require("./routes/product.router");
const pathView = path.join(`${__dirname}/views`);
const passport = require('./config/passport.config');
const connection = require('./config/connection')
const mongoStore = require("connect-mongo");
const viewRouter = require("./routes/view.router");
const userRouter = require("./routes/user.router");
const cartRouter = require("./routes/cart.router");
const sessionRouter = require("./routes/session.router");
const productRouter = require('./routes/product.router');
const cookieRouter = require("./routes/cookie.router");
const session = require('express-session');
const connectDB = require("./config/connection");
connectDB();
const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "public")));

// Configuração de Sessão (necessário para Passport)
app.use(session({
    store: mongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        ttl: 15 * 60 * 60
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
}));

// Inicialização do Passport (após a configuração da sessão)
app.use(passport.initialize());
app.use(passport.session());

handlebars.create({
    helpers: {
        calculateTotal: (price, quantity) => (price * quantity).toFixed(2),
    },
});

// Middleware para parsing do corpo das requisições
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Roteadores
app.use("/", sessionRouter);
app.use("/carts", cartRouter);
app.use("/products", productRouter);
app.use('/', viewRouter);
app.use('/', userRouter);

// Rotas de página
app.get("/", (req, res) => res.render("home", { title: "Página Inicial" }));
app.get("/register", (req, res) => res.render("register", { title: "Register" }));
app.get("/list", (req, res) => res.render("list", { title: "List" }));
app.get("/realtimeproducts", (req, res) => res.render("realTimeProducts", { title: "Produtos em Tempo Real" }));
app.get("/chat", (req, res) => res.render("chat", { title: "Chat em Tempo Real" }));

// Iniciar o servidor
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));