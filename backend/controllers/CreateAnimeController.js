// Importação da função publishAnimeMessage do módulo filaAnime no rabbitmq
const { publishAnimeMessage } = require('../rabitmq/filaAnime');

// Classe responsável por controlar a criação de animes
module.exports = class CreateAnimeController {
  // Método estático para criar um novo anime
  static async createAnime(req, res) {
    // Resgata os dados da requisição
    const { nome, genero, quantidade_ep, socketId } = req.body;

    console.log("Este é o meu id do lado do cliente: " + socketId);

    try {
      // Validação dos campos obrigatórios
      if (!nome || !genero || !quantidade_ep) {
        return res.status(400).json({ message: "Preencha todos os campos obrigatórios!", success: false });
      }

      // Cria uma mensagem com os dados do anime
      const animeDataC = {
        nome: nome,
        genero: genero,
        quantidade_ep: quantidade_ep
      };

      // Publica a mensagem diretamente na fila RabbitMQ
      console.log('Publicando a mensagem');
      publishAnimeMessage(animeDataC, () => {
        console.log('Callback executado após a publicação do anime');
      });

      console.log('Dados publicados');

      // Responde com sucesso e mensagem de confirmação
      return res.status(201).json({ message: "Anime criado com sucesso! Aguarde a confirmação.", success: true });
    } catch (error) {
      // Loga qualquer erro ocorrido durante o processo
      console.log(error);
    }
  }
};
