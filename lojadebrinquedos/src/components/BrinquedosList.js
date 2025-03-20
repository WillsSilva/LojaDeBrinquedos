import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importando useNavigate
import { listarBrinquedos } from '../API/APIBrinquedos'; // Certifique-se de importar corretamente
import Menu from './Menu';

const BrinquedosList = ({ token }) => {
  const [brinquedo, setBrinquedos] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Criando o hook para navegação

  useEffect(() => {
    const fetchBrinquedos = async () => {
      try {
        const data = await listarBrinquedos(token);
        setBrinquedos(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBrinquedos();
  }, [token]);

  // Função para excluir funcionário
  const handleDelete = async (id) => {

    if (!token) {
      alert("Erro: usuário não autenticado.");
      return;
    }
  
    try {
      // await deleteFuncionario(id, token);
      alert("Brinquedo excluído com sucesso!");
      window.location.reload();
    } catch (error) {
      alert(error.message);
    }
  };

  // Função para editar funcionário
  const handleEdit = (id) => {
    navigate(`/editar/${id}`); // Redireciona para a tela de edição do funcionário
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Menu Lateral */}
      <Menu />

      <div style={{ flexGrow: 1, padding: '20px' }}>
        <h2>Brinquedos</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <ul>
          {brinquedo.map((funcionario) => (
            <li key={brinquedo.codigoUnico}>  {/* A chave aqui deve ser única */}
              {brinquedo.nome + ' - ' + brinquedo.tipo}
              <button onClick={() => handleEdit(brinquedo.codigoUnico)}>Editar</button>
              <button onClick={() => handleDelete(brinquedo.codigoUnico)}>Excluir</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BrinquedosList;
