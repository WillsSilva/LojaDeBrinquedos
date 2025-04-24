import axios from 'axios';

const API_URL = 'http://locabrinquedos.duckdns.org:8000';

// Listar clientes
export const listarClientes = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/clientes/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Erro ao buscar clientes');
  }
};

// Criar novo cliente
export const criarCliente = async (token, cliente) => {
  try {
    const response = await axios.post(`${API_URL}/clientes/`, cliente, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.detail || 'Erro ao cadastrar cliente';
    throw new Error(errorMsg);
  }
};

// Obter cliente por ID
export const obterClientePorId = async (id, token) => {
  try {
    const response = await axios.get(`${API_URL}/clientes/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Erro ao obter cliente');
  }
};

// Atualizar cliente
export const atualizarCliente = async (id, token, cliente) => {
  try {
    const response = await axios.put(`${API_URL}/clientes/${id}`, cliente, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Erro ao atualizar cliente');
  }
};

// Deletar cliente
export const deletarCliente = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/clientes/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return { message: 'Cliente deletado com sucesso!' };
    } else {
      throw new Error('Erro ao excluir cliente');
    }
  } catch (error) {
    const errorMsg = error.response?.data?.detail || 'Erro ao excluir cliente';
    throw new Error(errorMsg);
  }
};
