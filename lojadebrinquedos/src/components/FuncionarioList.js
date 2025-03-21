import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importando useNavigate
import { listarFuncionarios, deleteFuncionario } from '../API/APIFuncionarios'; // Certifique-se de importar corretamente
import Menu from './Menu';

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

    if (!token) {
      alert("Erro: usuário não autenticado.");
      return;
    }
  
    if (window.confirm("Tem certeza que deseja excluir este funcionário?")) {    
      try {
        await deleteFuncionario(id, token);
        alert("Funcionário excluído com sucesso!");
        window.location.reload();
      } catch (error) {
        alert(error.message);
      }
    }
  };

  // Função para editar funcionário
  const handleEdit = (id) => {
    navigate(`/editar/${id}`);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Menu Lateral */}
      <Menu />

      <div style={{ flexGrow: 1, padding: '20px' }}>
        <h2>Funcionários</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <ul>
          {funcionarios.map((funcionario) => (
            <li key={funcionario.username}>  {/* A chave aqui deve ser única */}
              {funcionario.nome + ' - ' + funcionario.role}
              <button onClick={() => handleEdit(funcionario.username)}>Editar</button>
              <button onClick={() => handleDelete(funcionario.username)}>Excluir</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FuncionarioList;
