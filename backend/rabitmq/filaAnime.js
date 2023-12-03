// Importação do módulo amqplib para interagir com RabbitMQ
const amqp = require('amqplib');

// Importação das configurações do RabbitMQ
const { rabbitMQURL, animeQueue } = require('./rabbitmq.config');

// Importação do módulo serverWebSocket para interagir com o servidor WebSocket
const serverWebSocket = require('../websocket/serverwebsocket');

// Variável para armazenar o canal de comunicação com o RabbitMQ
let channel;

// Função assíncrona para configurar a conexão com o RabbitMQ
async function setupRabbitMQ() {
  try {
    // Se o canal já estiver configurado, retorna o canal existente
    if (channel) {
      return channel;
    }

    // Estabelece uma conexão com o RabbitMQ
    const connection = await amqp.connect(rabbitMQURL);
    channel = await connection.createChannel();

    // Cria uma fila durável no RabbitMQ
    await channel.assertQueue(animeQueue, { durable: true });

    console.log(`Fila ${animeQueue} criada com sucesso.`);

    return channel;
  } catch (error) {
    console.error('Erro ao configurar a conexão RabbitMQ:', error);
    throw error;
  }
}

// Função assíncrona para publicar uma mensagem sobre a criação de um anime no RabbitMQ
async function publishAnimeMessage(animeDataC, callback) {
  try {
    // Obtém o canal atualizado do RabbitMQ
    const currentChannel = await setupRabbitMQ();

    // Publica a mensagem na fila do RabbitMQ
    await currentChannel.sendToQueue(animeQueue, Buffer.from(JSON.stringify(animeDataC)), { persistent: true });

    console.log('Mensagem sobre a criação de um anime publicada com sucesso:', animeDataC);

    // Verifica se 'serverWebSocket' e 'serverWebSocket.io' estão definidos antes de chamar 'emit'
    if (serverWebSocket && serverWebSocket.io) {
      serverWebSocket.io.emit('novoAnime', 'Anime criado com sucesso!');
    } else {
      console.error('O objeto serverWebSocket ou serverWebSocket.io não está definido.');
    }

    // Chama o callback, se fornecido
    if (callback) {
      callback();
    }
  } catch (error) {
    console.error('Erro ao publicar mensagem sobre a criação de um anime no RabbitMQ:', error);
  }
}

// Exportação das funções setupRabbitMQ e publishAnimeMessage
module.exports = { setupRabbitMQ, publishAnimeMessage };
