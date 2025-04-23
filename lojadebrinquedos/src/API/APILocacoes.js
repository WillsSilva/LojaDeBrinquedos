import axios from "axios";

const API_URL = "http://localhost:8000/locacoes";

// Criar Locação (múltiplos brinquedos em uma única locação)
export const criarLocacao = async (token, locacao) => {
  try {
    console.log("Dados da locação:", locacao); // Log para depuração

    // Envie apenas o objeto `locacao` (não um array)
    const response = await axios.post(`${API_URL}/`, locacao, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Erro ao registrar locação");
  }
};


// Listar Locações
export const listarLocacoes = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Erro ao buscar locações");
  }
};

// Obter Locação por ID
export const obterLocacaoPorId = async (id, token) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Erro ao obter locação");
  }
};

// Deletar Locação
export const deletarLocacao = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Erro ao excluir locação");
  }
};

export const atualizarLocacao = async (id, dados, token) => {
  const res = await fetch(`${API_URL}/locacoes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dados),
  })
  return res.json()
}

