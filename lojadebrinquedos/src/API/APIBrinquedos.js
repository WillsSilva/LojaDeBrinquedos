import axios from 'axios';

const API_URL = 'http://localhost:8000';

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

// Função para criar um novo Tipo de Brinquedo
export const criarBrinquedo = async (token, brinquedo) => {
  const response = await fetch('http://localhost:8000/brinquedos/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(brinquedo),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Erro ao cadastrar brinquedo');
  }

  return response.json();
};

export const criarTipoBrinquedo = async (token, TipoBrinquedo) => {    
    const response = await fetch('http://localhost:8000/tipos_brinquedos/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(TipoBrinquedo),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Erro ao cadastrar tipo de brinquedo');
    }
  
    return response.json();
  };