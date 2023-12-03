// Importação do módulo Router do Express para definir rotas
const router = require('express').Router();

// Importação do módulo jsonwebtoken para manipulação de tokens JWT
const jwt = require('jsonwebtoken');

// Configuração do dotenv para carregar variáveis de ambiente do arquivo .env
require("dotenv").config();

// Importação do controller responsável pela criação de animes
const CreateAnimeController = require('../controllers/CreateAnimeController');

// Middleware para verificação e validação do token JWT
function checkToken(req, res, next){
    // Obtém o token do cabeçalho de autorização da requisição
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    // Verifica se o token está ausente
    if (!token) {
        return res.status(401).json({ message: "Acesso negado!" });
    }

    try {
        // Verifica a validade do token usando a chave secreta
        const secret = process.env.SECRET;
        jwt.verify(token, secret);

        // Chama a próxima função no pipeline de middleware se o token for válido
        next();

    } catch (err) {
        console.log(err);

        // Responde com status 400 se houver um erro na verificação do token
        res.status(400).json({ message: "Token inválido!" });
    }
}

// Rota que aciona o controller para criar um novo anime, usando o middleware de verificação de token
router.post('/createAnime', checkToken, CreateAnimeController.createAnime);

// Exportação do objeto router para ser utilizado no arquivo server.js
module.exports = router;
