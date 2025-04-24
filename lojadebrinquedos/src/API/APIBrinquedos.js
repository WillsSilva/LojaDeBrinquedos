import axios from "axios";

const API_URL = "http://locabrinquedos.duckdns.org:8000/brinquedos";

// Criar Brinquedo
export const criarBrinquedo = async (token, brinquedo) => {
  try {
    const response = await axios.post(`${API_URL}/`, brinquedo, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Erro ao cadastrar brinquedo");
  }
};

// Listar Brinquedos
export const listarBrinquedos = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Erro ao buscar brinquedos");
  }
};

// Obter Brinquedo por ID
export const obterBrinquedoPorId = async (id, token) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Erro ao obter brinquedo");
  }
};

// Atualizar Brinquedo
export const atualizarBrinquedo = async (id, token, brinquedo) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, brinquedo, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Erro ao atualizar brinquedo");
  }
};

export const deletarBrinquedo = async (id, token) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Erro ao excluir tipo de brinquedo");
    }
  };