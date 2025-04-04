import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { criarCliente, atualizarCliente, obterClientePorId, listarClientes } from '../API/APIClientes';
import Menu from './Menu';

const ClienteForm = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState({
    cpf: '',
    nome: '',
    endereco: '',
    dataNasc: '',
    telefone: '',
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [existingCPFs, setExistingCPFs] = useState([]);

  // Buscar cliente para edição
  useEffect(() => {
    if (id) {
      const fetchCliente = async () => {
        try {
          const data = await obterClientePorId(id, token);
          if (data && data.cpf && data.nome && data.endereco && data.dataNasc && data.telefone) {
            // Formata a data para o input date
            setCliente({ ...data, dataNasc: data.dataNasc.split('T')[0] });
          } else {
            setError('Dados incompletos para edição');
          }
        } catch (err) {
          setError('Erro ao carregar cliente');
        }
      };
      fetchCliente();
    }
  }, [id, token]);

  // Buscar todos os CPFs existentes
  useEffect(() => {
    const fetchCPFs = async () => {
      try {
        const data = await listarClientes(token);
        setExistingCPFs(data.map(cli => cli.cpf));
      } catch (err) {
        setError('Erro ao carregar lista de clientes');
      }
    };

    fetchCPFs();
  }, [token]);

  // Manipular mudanças nos inputs
  const handleChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const cpfExists = (cpf) => {
    return existingCPFs.includes(cpf);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { cpf, nome, endereco, dataNasc, telefone } = cliente;

    if (!cpf || !nome || !endereco || !dataNasc || !telefone) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    if (cpfExists(cpf) && !id) {
      setError("CPF já cadastrado.");
      return;
    }

    try {
      if (id) {
        await atualizarCliente(id, token, cliente);
        setMessage('Cliente atualizado com sucesso!');
      } else {
        await criarCliente(token, cliente);
        setMessage('Cliente cadastrado com sucesso!');
        setCliente({ cpf: '', nome: '', endereco: '', dataNasc: '', telefone: '' });
      }

      setError('');
      setTimeout(() => navigate('/clientes'), 2000);
    } catch (err) {
      setError(err.message);
      setMessage('');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Menu />
      <div style={{ flexGrow: 1, padding: '20px' }}>
        <h2>{id ? 'Editar Cliente' : 'Cadastrar Cliente'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="cpf"
            placeholder="CPF"
            value={cliente.cpf}
            onChange={handleChange}
            required
            disabled={!!id}
          />
          <input
            type="text"
            name="nome"
            placeholder="Nome"
            value={cliente.nome}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="endereco"
            placeholder="Endereço"
            value={cliente.endereco}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="dataNasc"
            value={cliente.dataNasc}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="telefone"
            placeholder="Telefone"
            value={cliente.telefone}
            onChange={handleChange}
            required
          />
          <button type="submit">{id ? 'Atualizar' : 'Cadastrar'}</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {message && <p style={{ color: 'green' }}>{message}</p>}
      </div>
    </div>
  );
};

export default ClienteForm;