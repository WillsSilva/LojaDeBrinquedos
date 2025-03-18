import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importando useNavigate
import { listarFuncionarios, deleteFuncionario } from '../api'; // Certifique-se de importar corretamente

const FuncionarioList = ({ token }) => {
  const [funcionarios, setFuncionarios] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Criando o hook para navegação

  useEffect(() => {
    const fetchFuncionarios = async () => {
      try {
        const data = await listarFuncionarios(token);
        setFuncionarios(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchFuncionarios();
  }, [token]);

  // Função para excluir funcionário
  const handleDelete = async (id) => {
    try {
      await deleteFuncionario(id); // Faz requisição à API
      setFuncionarios((prev) => prev.filter(func => func.id !== id)); // Atualiza a lista sem o funcionário excluído
    } catch (err) {
      setError('Erro ao excluir funcionário');
    }
  };

  // Função para editar funcionário
  const handleEdit = (id) => {
    navigate(`/editar/${id}`); // Redireciona para a tela de edição do funcionário
  };

  return (
    <div>
      <h2>Funcionários</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {funcionarios.map((funcionario) => (
          <li key={funcionario.username}>  {/* A chave aqui deve ser única */}
            {funcionario.nome}
            <button onClick={() => handleEdit(funcionario.username)}>Editar</button>
            <button onClick={() => handleDelete(funcionario.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FuncionarioList;
