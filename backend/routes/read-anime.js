// Importação do módulo Router do Express para definir rotas
const router = require('express').Router();

// Importação do controller responsável por manipular operações relacionadas a leitura de animes
const ReadAnimeController = require('../controllers/ReadAnimeController');

// Importação do módulo jsonwebtoken para manipulação de tokens JWT
const jwt = require("jsonwebtoken");

// Importação do módulo createClient do redis para trabalhar com cache
const { createClient } = require('redis');

// Criação de uma instância do cliente Redis
const client = createClient();

// Configuração do dotenv para carregar variáveis de ambiente do arquivo .env
require("dotenv").config();

// Tratamento de erros do cliente Redis
client.on('error', err => console.log('Redis Client Error', err));

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

// Função assíncrona para iniciar a rota de leitura de animes com suporte a cache
async function iniciarRotaCache(){
    router.get('/readAnime/:userName', checkToken, ReadAnimeController.readAnime);
}

// Chama a função para iniciar a rota com cache
iniciarRotaCache();

// Exportação do objeto router para ser utilizado no arquivo server.js
module.exports = router;
