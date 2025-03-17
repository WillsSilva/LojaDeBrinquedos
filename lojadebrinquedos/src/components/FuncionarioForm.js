// src/components/FuncionarioForm.js
import React, { useState } from 'react';
import { criarFuncionario } from '../api';

const FuncionarioForm = ({ token }) => {
  const [funcionario, setFuncionario] = useState({
    cpf: '',
    nome: '',
    telefone: '',
    funcao: '',
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
    } catch (err) {
      setError(err.message);
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
        />
        <input
          type="text"
          name="nome"
          placeholder="Nome"
          value={funcionario.nome}
          onChange={handleChange}
        />
        <input
          type="text"
          name="telefone"
          placeholder="Telefone"
          value={funcionario.telefone}
          onChange={handleChange}
        />
        <input
          type="text"
          name="funcao"
          placeholder="Função"
          value={funcionario.funcao}
          onChange={handleChange}
        />
        <button type="submit">Cadastrar</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
    </div>
  );
};

export default FuncionarioForm;
