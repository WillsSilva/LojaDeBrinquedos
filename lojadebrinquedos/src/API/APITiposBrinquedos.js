import axios from "axios";

const API_URL = "http://locabrinquedos.duckdns.org:8000/tipos_brinquedos";

// Criar Tipo de Brinquedo
export const criarTipoBrinquedo = async (token, tipoBrinquedo) => {
  try {
    const response = await axios.post(`${API_URL}/`, tipoBrinquedo, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Erro ao cadastrar tipo de brinquedo");
  }
};

// Listar Tipos de Brinquedos
export const listarTiposBrinquedos = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Erro ao buscar tipos de brinquedos");
  }
};

// Obter Tipo de Brinquedo por ID
export const obterTipoBrinquedoPorId = async (id, token) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Erro ao obter tipo de brinquedo");
  }
};

// Atualizar Tipo de Brinquedo
export const atualizarTipoBrinquedo = async (id, token, tipoBrinquedo) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, tipoBrinquedo, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Erro ao atualizar tipo de brinquedo");
  }
};

// Deletar Tipo de Brinquedo
export const deletarTipoBrinquedo = async (id, token) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Erro ao excluir tipo de brinquedo");
    }
  };
  
