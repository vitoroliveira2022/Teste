// Importação da função publishLogMessage do módulo filaLog no rabbitmq
const { publishLogMessage } = require('../rabitmq/filaLog'); 

// Classe responsável por controlar as operações relacionadas a logs
module.exports = class LogController {
  // Método estático para registrar uma busca no log
  static async logSearch(req, res) {
    // Extrai os dados da requisição
    const { busca, user_busca } = req.body;

    try {
      // Cria um objeto com os dados do log
      const log = {
        busca: busca,
        user_busca: user_busca,
      };

      // Envia o log para a fila RabbitMQ
      publishLogMessage(log);

      // Responde com sucesso e mensagem de confirmação
      return res.status(200).json({ message: 'Log de pesquisa registrado com sucesso!', success: true });
    } catch (error) {
      // Loga qualquer erro ocorrido durante o processo
      console.error('Erro ao enviar log para a fila RabbitMQ:', error);
      
      // Responde com erro e mensagem de falha
      return res.status(500).json({ message: 'Aconteceu um erro no servidor, tente novamente mais tarde!', success: false });
    }
  }
};
