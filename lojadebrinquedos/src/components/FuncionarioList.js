// src/components/FuncionarioList.js
import React, { useEffect, useState } from 'react';
import { listarFuncionarios } from '../api';

const FuncionarioList = ({ token }) => {
  const [funcionarios, setFuncionarios] = useState([]);
  const [error, setError] = useState('');

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

  return (
    <div>
      <h2>Funcionários</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {funcionarios.map((funcionario, index) => (
          <li key={index}>{funcionario.nome}</li>
        ))}
      </ul>
    </div>
  );
};

export default FuncionarioList;
