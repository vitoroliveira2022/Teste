// Importa o hook useContext do React para acessar o contexto
import { useContext } from "react";
// Importa o contexto de autenticação criado anteriormente
import { AuthContext } from "../contexts/auth";

// Hook personalizado chamado 'useAuth' que encapsula o uso do contexto de autenticação
const useAuth = () => {
    // Usa o hook useContext para acessar o contexto de autenticação
    const context = useContext(AuthContext);

    // Retorna o contexto, permitindo que componentes utilizem facilmente as informações de autenticação
    return context;
};

// Exporta o hook personalizado 'useAuth' para que outros componentes possam utilizá-lo
export default useAuth;
