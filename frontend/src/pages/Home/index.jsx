// Importações de bibliotecas e componentes React
import React, { useState, useEffect } from 'react';
import Noticacoes from '../../components/Notificacoes';
import Cadastro from '../../components/Cadastro';
import Pesquisa from '../../components/Pesquisa';
import useAuth from '../../hooks/useAuth';

// Componente funcional principal da página Home
export default function Home() {
  // Hooks do React para gerenciar o estado
  const { signout } = useAuth();
  const [logado, setLogado] = useState(null);

  // Efeito colateral para verificar o usuário logado ao carregar a página
  useEffect(() => {
    // Recupera o token de usuário armazenado na sessão
    const usuarioLogado = sessionStorage.getItem("user_token");
    
    // Define o estado do usuário logado
    setLogado(usuarioLogado);
  }, []); 

  // Converte o token de usuário para objeto
  const userr = JSON.parse(logado);

  // Função para realizar o logout
  const logout = () => {
    signout();
  };

  // Estrutura JSX da página Home
  return (
    <div>
      {/* Componente de Notificações */}
      <Noticacoes />

      {/* Cabeçalho da página */}
      <header className="w-screen h-16 p-4 bg-slate-800 flex items-center justify-between pl-10 pr-10">
        <div>
          <h3 className="text-3xl text-white">PROJETO 2</h3>
        </div>

        <div className='flex items-center justify-center gap-2 text-white'>
          {/* Exibe informações do usuário e botão de logout se estiver logado */}
          {logado && (
            <>
              <h3>{userr.name}</h3>
              <h3 className="text-black cursor-pointer bg-yellow-500 p-2 rounded" onClick={logout}>
                Sair
              </h3>
            </>
          )}
        </div>
      </header>

      {/* Corpo da página com seção de Cadastro e Pesquisa */}
      <div className="flex pl-28 pr-28 justify-between">
        {/* Componente de Cadastro */}
        <Cadastro />
        
        {/* Componente de Pesquisa */}
        <Pesquisa />
      </div>
    </div>
  );
}
