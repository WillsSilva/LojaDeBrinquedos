// src/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8000';

// Função para realizar o login
export const login = async (username, password) => {
  try {
    const response = await axios.post('http://localhost:8000/token', new URLSearchParams({
      username,
      password,
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', // Tipo de conteúdo para enviar dados como formulário
      },
    });
    
    return response.data; 
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw new Error('Falha ao realizar login. Tente novamente!');
  }
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
  const response = await fetch('http://localhost:8000/funcionarios/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(funcionario),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Erro ao cadastrar funcionário');
  }

  return response.json();
};

export const getFuncionarios = async () => {
  const response = await fetch('http://localhost:8000/funcionarios/');
  if (!response.ok) {
    throw new Error('Erro ao carregar os funcionários');
  }
  return await response.json();
};

export const deleteFuncionario = async (id, token) => {
  if (!token) {
    throw new Error("Token de autenticação ausente");
  }

  try {
    console.log(localStorage.getItem("token"));

    const response = await fetch(`http://localhost:8000/funcionarios/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Erro ao excluir funcionário");
    }

    return { message: "Funcionário deletado com sucesso!" };

  } catch (error) {
    console.error("Erro ao excluir funcionário:", error.message);
    throw error;
  }
};

export const atualizarFuncionario = async (id, token, funcionario) => {
  const response = await fetch(`http://localhost:8000/funcionarios/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(funcionario),
  });

  if (!response.ok) {
    throw new Error('Erro ao atualizar funcionário');
  }

  return await response.json();
};

export const obterFuncionarioPorId = async (id, token) => {
  const response = await fetch(`http://localhost:8000/funcionarios/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Erro ao obter funcionário');
  }

  return await response.json();
};

export const listarBrinquedos = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/brinquedos/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Erro ao buscar brinquedos');
  }
};

