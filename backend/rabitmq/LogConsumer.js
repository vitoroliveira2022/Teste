// Importação do módulo amqplib para interagir com RabbitMQ
const amqp = require('amqplib');

// Importação do PrismaClient para interagir com o banco de dados
const prisma = require('../src/Client/PrismaClient');

// Importação das configurações do RabbitMQ
const { rabbitMQURL, logQueue } = require('./rabbitmq.config');

// Função assíncrona para consumir mensagens de log do RabbitMQ
async function consumeLogMessage(io) {
  try {
    // Estabelece uma conexão com o RabbitMQ
    const connection = await amqp.connect(rabbitMQURL);
    const channel = await connection.createChannel();

    // Garante que a fila de logs existe no RabbitMQ
    await channel.assertQueue(logQueue, { durable: true });
    console.log('Consumidor de log aguardando mensagens. Para sair pressione CTRL+C');

    // Consome mensagens da fila de logs
    channel.consume(logQueue, async (msg) => {
      if (msg !== null) {
        // Converte a mensagem para objeto JavaScript
        const logData = JSON.parse(msg.content.toString());
        console.log('Mensagem de log recebida:', logData);

        // Insere os dados do log no banco de dados usando o Prisma
        const dadosLog = await prisma.log.create({
          data: logData,
        });

        // Emite um evento para todos os usuários conectados via Socket.IO
        if (io) {
          io.emit('novaMensagemLog', { message: 'Nova mensagem de log criada!', logData: dadosLog });
        }

        // Confirma o recebimento da mensagem para o RabbitMQ
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error('Erro no consumidor de log:', error);
  }
}

// Exportação da função para ser utilizada em outros arquivos
module.exports = consumeLogMessage;
