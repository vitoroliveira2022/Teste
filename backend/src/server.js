// Importação das dependências necessárias
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors"); // Importação do pacote CORS para lidar com política de mesma origem

const consumeAnimeMessage = require('../rabitmq/animeConsumer');
const consumeLogMessage = require('../rabitmq/LogConsumer');



// Consumo de mensagens relacionadas a animes e logs
consumeAnimeMessage();
consumeLogMessage();

// Definição da porta do servidor
const PORT = process.env.PORT || 3004;

// Criação de uma instância do Express
const app = express();

// Configuração do CORS para permitir requisições de origens diferentes
app.use(cors());
app.use(express.json());

// Importação de rotas
const createAnime = require('../routes/create-anime');
const readAnime = require('../routes/read-anime');
const login = require('../routes/login-router');
const log = require('../routes/log-router');

// Utilização das rotas definidas
app.use('/create', createAnime);
app.use('/login', login);
app.use('/read', readAnime);
app.use('/logsearch', log);

// Criação do servidor HTTP usando o Express
const server = http.createServer(app);

// Configuração do Socket.IO para usar o servidor HTTP e permitir conexões do frontend
const io = new Server(server, {
  cors: { origin: "http://localhost:3000" },
});

// Lida com eventos de conexão, desconexão e customizados dos clientes Socket.IO
io.on("connection", (socket) => {
  console.log("Usuário conectado!", socket.id);

  socket.on("disconnect", (reason) => {
    console.log("Usuário desconectado!", socket.id);
  });

  socket.on("set_username", (username) => {
    socket.data.username = username;
    console.log(socket.data.username);
  });
});

// Inicia o servidor na porta especificada
server.listen(PORT, () => {
  console.log(`Servidor HTTP está sendo executado na porta ${PORT}`);
});
