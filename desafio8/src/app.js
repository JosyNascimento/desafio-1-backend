const productRouter = require('./routes/product.router');
const connectDB = require('./dao/MongoDB/connection'); 
require('dotenv').config();
const path = require('path');
const bodyParser = require('body-parser');
const setupWebSocket = require("./routes/product.router");
const auth = require('./middleware/auth'); 

const app = express();


// Configuração do WebSocket
const server = http.createServer(app);
const io = new Server(server);

// Conexão com o MongoDB
connectDB(process.env.MONGO_URL);

// Configuração do Handlebars
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "public")));

// Configuração de Sessão
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


handlebars.create({
  helpers: {
    calculateTotal: (price, quantity) => (price * quantity).toFixed(2),
  },
});

// Middleware para parsing do corpo das requisições
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Roteadores
app.use("/user", sessionRouter);
app.use("/carts", cartRouter);
app.use("/products", productRouter);
app.use('/', viewRouter);
app.use('/user', userRouter);


// Rotas de página
app.get("/", (req, res) => res.render("home", { title: "Página Inicial" }));
app.get("/register", (req, res) => res.render("register", { title: "Register" }));
app.get("/list", (req, res) => res.render("list", { title: "List" }));
app.get("/realtimeproducts", (req, res) => res.render("realTimeProducts", { title: "Produtos em Tempo Real" }));
app.get("/chat", (req, res) => res.render("chat", { title: "Chat em Tempo Real" }));

// Iniciar o servidor
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
