// Importação do PrismaClient para interagir com o banco de dados
const prisma = require('../src/Client/PrismaClient');

// Importação da biblioteca para geração de tokens JWT
const jwt = require('jsonwebtoken');

// Configuração do dotenv para carregar variáveis de ambiente
require('dotenv').config();

// Classe responsável por controlar operações relacionadas ao login
module.exports = class LoginController {
    static async login(req, res) {
        try {
            // Recebendo os dados do corpo da requisição
            const { email, password } = req.body;
            
            // Realizando a validação dos campos obrigatórios
            if (!email || email === "") {
                res.status(400).json({ message: "O email é obrigatório!" });
                return;
            }

            if (!password || password === "") {
                res.status(400).json({ message: "A senha é obrigatória!" });
                return;
            }

            // Procurar usuário no banco de dados pelo e-mail
            const user = await prisma.user.findFirst({
                where: {
                    email: email,
                },
                select: {
                    name: true
                }
            });

            // Buscar informações do usuário para geração do token
            const busca = await prisma.user.findMany({
                select: {
                    id: true,
                    name: true
                }
            });

            // Resgata a chave única do .env para a geração do token
            const secret = process.env.SECRET;

            // Realiza a geração do token com o id do usuário do banco e a chave do .env
            const token = jwt.sign({
                id: busca.id,
            }, secret);

            // Verificar se o usuário existe e se a senha está correta
            if (user) {
                res.status(200).json({ message: "Autenticado com sucesso!", dados: user, tk: token, success: true });
            } else {
                res.status(401).json({ message: "Credenciais inválidas!", success: false });
                return;
            }
        } catch (err) {
            console.error(err);
            res.status(500).json("Aconteceu um erro no servidor, tente novamente!");
            return;
        }
    }
};
