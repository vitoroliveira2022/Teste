// Importação do módulo amqplib para interagir com o RabbitMQ
const amqp = require('amqplib');

// Importação das configurações do RabbitMQ
const { rabbitMQURL, logQueue } = require('./rabbitmq.config');

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
    await channel.assertQueue(logQueue, { durable: true });

    console.log(`Fila ${logQueue} criada com sucesso.`);

    return channel;
  } catch (error) {
    console.error(`Erro ao configurar a conexão RabbitMQ para a fila ${logQueue}:`, error);
    throw error;
  }
}

// Função assíncrona para publicar uma mensagem na fila de logs no RabbitMQ
async function publishLogMessage(message, callback) {
  try {
    // Obtém o canal atualizado do RabbitMQ
    const currentChannel = await setupRabbitMQ();

    // Publica a mensagem na fila do RabbitMQ
    await currentChannel.sendToQueue(logQueue, Buffer.from(JSON.stringify(message)), { persistent: true });

    console.log(`Mensagem publicada com sucesso na fila ${logQueue}:`, message);

    // Chama o callback, se fornecido
    if (callback) {
      callback();
    }
  } catch (error) {
    console.error(`Erro ao publicar mensagem na fila ${logQueue} no RabbitMQ:`, error);
  }
}

// Exportação das funções setupRabbitMQ e publishLogMessage
module.exports = { setupRabbitMQ, publishLogMessage };
