import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { criarFuncionario, atualizarFuncionario, obterFuncionarioPorId, listarFuncionarios } from '../api';

const FuncionarioForm = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [funcionario, setFuncionario] = useState({
    cpf: '',
    nome: '',
    telefone: '',
    role: '',
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [existingUsernames, setExistingUsernames] = useState([]); // Estado para armazenar usernames existentes

  // Buscar funcionário para edição
  useEffect(() => {
    if (id) {
      const fetchFuncionario = async () => {
        try {
          const data = await obterFuncionarioPorId(id, token);
          if (data && data.cpf && data.nome && data.telefone && data.role && data.username) {
            setFuncionario(data);
          } else {
            setError('Dados incompletos para edição');
          }
        } catch (err) {
          setError('Erro ao carregar funcionário');
        }
      };
      fetchFuncionario();
    }
  }, [id, token]);

  // Buscar todos os usernames existentes para verificar duplicidade
  useEffect(() => {
    const fetchUsernames = async () => {
      try {
        const data = await listarFuncionarios(token);
        setExistingUsernames(data.map(func => func.username)); // Extrair apenas os usernames
      } catch (err) {
        setError('Erro ao carregar lista de funcionários');
      }
    };

    fetchUsernames();
  }, [token]);

  // Manipulação de campos do formulário
  const handleChange = (e) => {
    setFuncionario({ ...funcionario, [e.target.name]: e.target.value });
  };

  // Função para verificar se o username já existe
  const usernameExists = (username) => {
    return existingUsernames.includes(username);
  };

// Submissão do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Verificar se todos os campos estão preenchidos
    if (!funcionario.cpf || !funcionario.nome || !funcionario.telefone || !funcionario.role || !funcionario.username || (!id && !funcionario.password)) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    // Verificar se o username já está em uso, exceto quando é o mesmo que o do funcionário sendo editado
    if (usernameExists(funcionario.username) && funcionario.username !== (id ? funcionario.username : '')) {
      setError("Nome de usuário já está em uso.");
      return;
    }

    try {
      if (id) {
        await atualizarFuncionario(id, token, funcionario);
        setMessage('Funcionário atualizado com sucesso!');
      } else {
        await criarFuncionario(token, funcionario);
        setMessage('Funcionário cadastrado com sucesso!');
        setFuncionario({ cpf: '', nome: '', telefone: '', role: '', username: '', password: '' });
      }
      setError('');
      setTimeout(() => navigate('/funcionarios'), 2000);
    } catch (err) {
      setError(err.message);
      setMessage('');
    }
  };

  return (
    <div>
      <h2>{id ? 'Editar Funcionário' : 'Cadastrar Funcionário'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="cpf"
          placeholder="CPF"
          value={funcionario.cpf || ''}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="nome"
          placeholder="Nome"
          value={funcionario.nome || ''}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="telefone"
          placeholder="Telefone"
          value={funcionario.telefone || ''}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="role"
          placeholder="Função"
          value={funcionario.role || ''}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="username"
          placeholder="Nome de usuário"
          value={funcionario.username || ''}
          onChange={handleChange}
          required
          disabled={id ? true : false} // Impede edição do username após cadastro
        />
        <input
          type="password"
          name="password"
          placeholder="Senha"
          value={funcionario.password || ''}
          onChange={handleChange}
          required={!id}
        />
        <button type="submit">{id ? 'Atualizar' : 'Cadastrar'}</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
    </div>
  );
};

export default FuncionarioForm;
