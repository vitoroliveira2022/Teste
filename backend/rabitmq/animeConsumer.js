// Importação do módulo amqplib para interagir com RabbitMQ
const amqp = require('amqplib');

// Importação do PrismaClient para interagir com o banco de dados
const prisma = require('../src/Client/PrismaClient');

// Importação das configurações do RabbitMQ
const { rabbitMQURL, animeQueue } = require('./rabbitmq.config');

// Função assíncrona para consumir mensagens de anime do RabbitMQ
async function consumeAnimeMessage(io) {
  try {
    // Estabelece uma conexão com o RabbitMQ
    const connection = await amqp.connect(rabbitMQURL);
    const channel = await connection.createChannel();

    // Garante que a fila de animes existe no RabbitMQ
    await channel.assertQueue(animeQueue, { durable: true });
    console.log('Consumidor de anime aguardando mensagens. Para sair pressione CTRL+C');

    // Consome mensagens da fila de animes
    channel.consume(animeQueue, async (msg) => {
      if (msg !== null) {
        // Converte a mensagem para objeto JavaScript
        const animeDataC = JSON.parse(msg.content.toString());
        console.log('Mensagem de anime recebida:', animeDataC);

        // Insere os dados do anime no banco de dados usando o Prisma
        const dadosAnime = await prisma.anime.create({
          data: animeDataC,
        });

        // Emite um evento para todos os usuários conectados via Socket.IO
        if (io) {
          io.emit('novoAnime', { message: 'Nova mensagem de anime criada!' });
        }

        // Confirma o recebimento da mensagem para o RabbitMQ
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error('Erro no consumidor de anime:', error);
  }
}

// Exportação da função para ser utilizada em outros arquivos
module.exports = consumeAnimeMessage;
