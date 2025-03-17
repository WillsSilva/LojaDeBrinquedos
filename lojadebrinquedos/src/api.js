// src/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8000';

// Função para realizar o login
export const login = async (username, password) => {
  const response = await axios.post('http://localhost:8000/token', new URLSearchParams({
    username,
    password,
  }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data;
};

export const listarFuncionarios = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/funcionarios/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Erro ao buscar funcionários');
  }
};

// Função para criar um novo funcionário
export const criarFuncionario = async (token, funcionario) => {
  try {
    const response = await axios.post(`${API_URL}/funcionarios/`, funcionario, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Erro ao cadastrar funcionário');
  }
};
