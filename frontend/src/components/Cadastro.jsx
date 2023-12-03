import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

import 'react-toastify/dist/ReactToastify.css';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [genero, setGenero] = useState('');
  const [socketId, setSocketId] = useState('');
  const [quantidade_ep, setQuantidade] = useState('');


  useEffect(() => {
    // Inicializa o socket
    const newSocket = io('http://localhost:3005');

    // Define o socket e obtém o ID após a conexão
    newSocket.on('connect', () => {
  
      setSocketId(newSocket.id);
    });

    // Cleanup: desconectar o socket quando o componente é desmontado
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);



  const handleCadastro = async () => {
    try {
      const response = await axios.post('http://localhost:3004/create/createAnime', 
      {
       
        nome,
        genero,
        quantidade_ep,
        socketId
      },
      
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`,
          // Outros cabeçalhos, se necessário
        }

      }
      
      );
  
      if (response.data.success === true) {
        setNome('');
        setGenero('');
        setQuantidade('');
        

        return true;
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error('Erro ao cadastrar anime:', error);
      console.log('Ocorreu um erro ao cadastrar o anime. Tente novamente mais tarde.');
    }
  };

  return (
    <div className='p-4 flex flex-col gap-4 w-bgn'>
   
      <div className='text-2xl'>Cadastrar Anime</div>
      <div>
        <div className='flex flex-col gap-4'>
          <div>
            <input
              className="border-2 outline-transparent p-2 w-full"
              type="text"
              value={nome}
              onChange={(n) => setNome(n.target.value)}
              placeholder="Nome do anime"
            />
          </div>
          <div>
            <input
              className="border-2 outline-transparent p-2 w-full"
              type="text"
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
              placeholder="Gênero"
            />
          </div>
          <div>
            <input
              className="border-2 outline-transparent p-2 w-full"
              type="number"
              value={quantidade_ep}
              onChange={(s) => setQuantidade(s.target.value)}
              placeholder="Quantidade de episódios"
            />
          </div>
          <div>
            <input
              className="border-2 outline-transparent p-2 w-full cursor-pointer"
              type="button"
              value="CADASTRAR"
              onClick={handleCadastro}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
