// Importa dependências do React
import { createContext, useEffect, useState } from "react";
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Criação do contexto de autenticação
export const AuthContext = createContext({});

// Componente que provê o contexto de autenticação para toda a aplicação
export const AuthProvider = ({ children }) => {

  // Estado para armazenar informações do usuário autenticado
  const [user, setUser] = useState();

  // Efeito colateral que é executado ao montar o componente
  useEffect(() => {
    
    // Obtém o token do usuário do sessionStorage
    const userToken = sessionStorage.getItem("user_token");

    // Verifica se há um token no sessionStorage
    if (userToken) {
      // Converte o token (string JSON) para um objeto e atualiza o estado 'user'
      const userData = JSON.parse(userToken);
      setUser(userData);
    }
  }, []); // O segundo argumento vazio faz com que o efeito seja executado apenas uma vez, equivalente ao componentDidMount

  // Função assíncrona para realizar o login do usuário
  const signin = async (email, password) => {
    try {
      // Envia uma requisição POST para o endpoint de login na API
      const response = await fetch("http://localhost:3004/login/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // Converte a resposta da API para JSON
      const data = await response.json();

      // Verifica se a requisição foi bem-sucedida (código 2xx)
      if (response.ok) {
        // Cria um token (string JSON) com informações do usuário e o armazena no sessionStorage
        const token = JSON.stringify({ email, token: data.token, name: data.dados.name });
        sessionStorage.setItem("user_token", token);

        // Atualiza o estado 'user' com informações básicas do usuário
        setUser({ email });
      } else {
        // Se a requisição falhar, exibe mensagem de erro no console e retorna uma mensagem de erro
        toast.error("Erro ao fazer login:", data.message);
        return data.message || "Erro ao fazer login";
      }
    } catch (error) {
      // Se ocorrer um erro durante o processo, exibe mensagem de erro no console e retorna uma mensagem de erro
      console.error("Erro ao fazer login:", error.message);
      return "Erro ao fazer login";
    }
  };

  // Função para realizar o logout do usuário
  const signout = () => {
    // Reseta o estado 'user' para null e remove o token do sessionStorage
    setUser(null);
    sessionStorage.removeItem("user_token");
  };

  // Renderiza o contexto de autenticação fornecendo os valores necessários para os componentes filhos
  return (
    <AuthContext.Provider
      value={{ user, signed: !!user, signin, signout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
