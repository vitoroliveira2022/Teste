// Importa o React para utilização de componentes React
import React from "react";
// Importa elementos relacionados à navegação no React, como BrowserRouter, Route e Routes
import { BrowserRouter, Route, Routes } from "react-router-dom";
// Importa os componentes de Login e Home
import Login from "../pages/Login/index";
import Home from "../pages/Home/index";
// Importa o hook useAuth para verificar o status de autenticação
import useAuth from "../hooks/useAuth";

// Componente funcional chamado RoutesApp
const RoutesApp = () => {

  // Componente chamado Private, utilizado para proteger rotas privadas
  const Private = ({ item: Item }) => {


    // Utiliza o hook useAuth para obter informações de autenticação
    const { signed } = useAuth();

    // Renderiza o componente Home se o usuário estiver autenticado, caso contrário, renderiza o componente Login
    return signed ? <Item /> : <Login />;
  };

  // Retorna o componente BrowserRouter que envolve as rotas da aplicação
  return (
    <BrowserRouter>
      <div>

        {/* Define as rotas da aplicação */}
        <Routes>

          {/* Rota para a página Home, utilizando o componente Private para proteger o acesso */}
          <Route path="/home" element={<Private item={Home} />} />

          {/* Rota para a página de Login */}
          <Route path="/login" element={<Login />} />

          {/* Rota padrão que redireciona para a página de Login caso nenhuma rota correspondente seja encontrada */}
          <Route path="*" element={<Login />} />
          
        </Routes>
      </div>
    </BrowserRouter>
  );
};

// Exporta o componente RoutesApp para ser utilizado em outros lugares da aplicação
export default RoutesApp;
