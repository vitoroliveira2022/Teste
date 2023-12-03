// Importação do PrismaClient para interagir com o banco de dados
const prisma = require('../src/Client/PrismaClient');

// Importação do módulo Redis para caching
const redis = require('redis');

// Inicialização do cliente Redis
const client = redis.createClient();

// Conexão ao servidor Redis
client.connect();

// Classe responsável por controlar operações relacionadas à leitura de animes
module.exports = class ReadUsersController {
  // Método estático para buscar animes por nome de usuário
  static async readAnime(req, res) {
    try {
      // Recebendo o dado da pesquisa via parâmetro na URL
      const userName = req.params.userName;

      // Verificando se o parâmetro foi passado corretamente
      if (!userName) {
        return res.status(400).json({ message: 'O parâmetro userName é obrigatório.', success: false });
      }

      // Pegando os dados no Redis através da chave armazenada
      const usersCad = await client.get(`readAnime:${userName}`);

      // Convertendo para objeto
      const dadosCache = JSON.parse(usersCad);

      // Se existirem dados no cache, retorna os dados do cache
      if (dadosCache) {
        return res.status(200).json({ message: "Listagem de Animes", success: true, qtd: dadosCache.length, dadosCache });
      } else {
        // Se não, realiza a leitura direta no banco
        const read = await prisma.anime.findMany({
          where: {
            nome: {
              startsWith: userName
            }
          },
          select: {
            id: true,
            nome: true,
            genero: true,
            quantidade_ep: true
          }
        });

        // Retorna os dados do banco
        res.status(200).json({ message: "Listagem de animes", success: true, qtd: read.length, read });

        // Realiza o armazenamento na chave do Redis para que na próxima consulta os dados retornados sejam do cache
        await client.set(`readAnime:${userName}`, JSON.stringify(read));
      }
    } catch (err) {
      // Loga qualquer erro ocorrido durante o processo
      console.error(err);
      res.status(500).json({ message: "Aconteceu um erro no servidor, tente novamente mais tarde!" });
    }
  }
};
