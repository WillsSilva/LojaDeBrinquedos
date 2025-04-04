import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarClientes, deletarCliente } from '../API/APIClientes';
import Menu from './Menu';

const ClienteList = ({ token }) => {
  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const data = await listarClientes(token);
        setClientes(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchClientes();
  }, [token]);

  const handleDelete = async (id) => {
    if (!token) {
      alert("Erro: usuário não autenticado.");
      return;
    }

    if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
      try {
        await deletarCliente(id, token);
        alert("Cliente excluído com sucesso!");
        window.location.reload();
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/editar-cliente/${id}`);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Menu />
  
      <div style={{ flexGrow: 1, padding: '20px' }}>
        <h2>Clientes</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
  
        <ul>
          {clientes.map((cliente) => (
            <li key={cliente.cpf}>
              {cliente.nome + ' - ' + cliente.endereco + ' - ' + formatarData(cliente.dataNasc) + ' - ' + cliente.telefone}
              <button onClick={() => handleEdit(cliente.cpf)}>Editar</button>
              <button onClick={() => handleDelete(cliente.cpf)}>Excluir</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
  
  // Função para formatar a data no estilo brasileiro
  function formatarData(dataIso) {
    const data = new Date(dataIso);
    return data.toLocaleDateString('pt-BR'); // Ex: 21/10/1998
  }
  
};

export default ClienteList;