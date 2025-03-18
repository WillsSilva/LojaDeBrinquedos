import React, { useState } from 'react';
import { criarFuncionario } from '../api';

const FuncionarioForm = ({ token }) => {
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

  const handleChange = (e) => {
    setFuncionario({ ...funcionario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await criarFuncionario(token, funcionario);
      setMessage(data.mensagem);
      setError('');
      setFuncionario({
        cpf: '',
        nome: '',
        telefone: '',
        role: '',
        username: '',
        password: '',
      });
    } catch (err) {
      setError(err.message);
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Cadastrar Funcionário</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="cpf"
          placeholder="CPF"
          value={funcionario.cpf}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="nome"
          placeholder="Nome"
          value={funcionario.nome}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="telefone"
          placeholder="Telefone"
          value={funcionario.telefone}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="role"
          placeholder="Função"
          value={funcionario.role}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="username"
          placeholder="Nome de usuário"
          value={funcionario.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Senha"
          value={funcionario.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Cadastrar</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
    </div>
  );
};

export default FuncionarioForm;
