import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Pesquisa = () => {
  const [pesquisa, setPesquisa] = useState('');
  const [resultados, setResultados] = useState([]);
  const token = process.env.REACT_APP_TOKEN;
  const [logado, setLogado] = useState(null);

  useEffect(() => {
    const usuarioLogado = sessionStorage.getItem("user_token");
      setLogado(usuarioLogado);
      
   
  }, []); 


  const userr = JSON.parse(logado)
  



  const logSearch = async () => {
    try {
      await axios.post(
        'http://localhost:3004/logsearch/logSearch',
        { busca: pesquisa,
          user_busca: userr.name
         },
        { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const pesquisar = async () => {
    try {
      if (!pesquisa) {
        setResultados([]);
        return;
      }

      const res = await axios.get(`http://localhost:3004/read/readAnime/${pesquisa}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.qtd > 0 && Array.isArray(res.data.dadosCache)) {
        setResultados(res.data.dadosCache);
        await logSearch();
      } else {
        setResultados([]);
        toast.warning('Nenhum registro foi encontrado!');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePesquisaChange = (event) => {
    const textoPesquisa = event.target.value;
    setPesquisa(textoPesquisa);
    if (textoPesquisa === '') {
      setResultados([]);
    }
  };

  return (
    <div>
      <ToastContainer />

      <div className='p-4 flex flex-col gap-4 w-bgn'>
        <div className='text-2xl'>Pesquisar Anime</div>

        <div className='flex flex-col gap-4'>
          <div>
            <input
              className="border-2 outline-transparent p-2 w-full"
              type="text"
              value={pesquisa}
              placeholder="Digite o nome do usuário"
              onChange={handlePesquisaChange}
            />
          </div>

          <div>
            <button
              className="border-2 outline-transparent p-2 w-full"
              onClick={pesquisar}
            >
              Pesquisar
            </button>
          </div>
        </div>

        <div className='flex flex-col gap-4'>
          <h3>A listagem aparecerá aqui:</h3>
          {resultados.map(itens => (
            <div key={itens.id} className='flex flex-col gap-2'>
              <h3><strong>Nome:</strong> {itens.nome}</h3>
              <h3><strong>Genêro:</strong> {itens.genero}</h3>
              <h3><strong>Quantidade de episódios:</strong> {itens.quantidade_ep}</h3>
              <hr />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Pesquisa;
