// Importação do módulo Router do Express para definir rotas
const router = require('express').Router();

// Importação do controller responsável por manipular operações relacionadas a login
const LoginController = require('../controllers/LoginController');

// Rota que aciona o controller para realizar o processo de login
router.post('/login', LoginController.login);

// Exportação do objeto router para ser utilizado no arquivo server.js
module.exports = router;
