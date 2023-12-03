// Importando as dependências necessárias
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const consumeAnimeMessage = require('../rabitmq/animeConsumer'); // Importa a função que consome mensagens de anime

// Classe que representa o servidor WebSocket
class ServerWebSocket {
  constructor() {
    // Configuração do Express e criação do servidor HTTP
    this.app = express();
    this.server = http.createServer(this.app);

    // Configuração do Socket.IO, habilitando CORS para permitir conexões do frontend
    this.io = new Server(this.server, {
      cors: { origin: "http://localhost:3000" },
    });

    // Lida com eventos de conexão e desconexão dos clientes Socket.IO
    this.io.on("connection", (socket) => {
      console.log("Usuário conectado!", socket.id);

      // Lida com eventos de desconexão do cliente Socket.IO
      socket.on("disconnect", (reason) => {
        console.log("Usuário desconectado!", socket.id);
      });

      // Lida com eventos customizados, como a definição de um nome de usuário
      socket.on("set_username", (username) => {
        socket.data.username = username;
        console.log(socket.data.username);
      });
    });

    // Integra o consumidor de mensagens de anime, passando a instância do Socket.IO
    consumeAnimeMessage(this.io);
  }

  // Função para emitir eventos para todos os clientes conectados
  emit(event, data) {
    if (this.io && this.io.sockets) {
      this.io.sockets.emit(event, data);
    }
  }

  // Inicia o servidor WebSocket na porta especificada
  start(port) {
    this.server.listen(port, () => {
      console.log(`Servidor WebSocket está ouvindo na porta ${port}`);
    });
  }
}

// Cria uma instância da classe ServerWebSocket e inicia o servidor na porta 3005
const serverWebSocket = new ServerWebSocket();
serverWebSocket.start(3005); // Escolha a porta que deseja usar
