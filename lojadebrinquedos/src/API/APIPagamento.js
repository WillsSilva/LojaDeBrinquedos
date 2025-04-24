import axios from "axios";

const API_URL = "http://locabrinquedos.duckdns.org:8000/pagamentos";

// Criar Pagamento (apenas para usuários com papel "Caixa")
export const criarPagamento = async (token, pagamento) => {
  try {
    console.log("Dados do pagamento:", pagamento); // Log para depuração

    const response = await axios.post(`${API_URL}/`, pagamento, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Erro ao registrar pagamento");
  }
};

// Listar todos os pagamentos
export const listarPagamentos = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Erro ao buscar pagamentos");
  }
};
