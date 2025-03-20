import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarTiposBrinquedos, deletarTipoBrinquedo } from '../API/APITiposBrinquedos';
import Menu from './Menu';

const TipoBrinquedoList = ({ token }) => {
  const [tiposBrinquedos, setTiposBrinquedos] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTiposBrinquedos = async () => {
      try {
        const data = await listarTiposBrinquedos(token);
        setTiposBrinquedos(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTiposBrinquedos();
  }, [token]);

  // Função para excluir um tipo de brinquedo
  const handleDelete = async (id) => {
    if (!token) {
      alert("Erro: usuário não autenticado.");
      return;
    }

    if (window.confirm("Tem certeza que deseja excluir este tipo de brinquedo?")) {
      try {
        await deletarTipoBrinquedo(id, token);
        alert("Tipo de brinquedo excluído com sucesso!");
        setTiposBrinquedos(tiposBrinquedos.filter(tipo => tipo.codigoUnico !== id));
      } catch (error) {
        alert(error.message);
      }
    }
  };

  // Função para editar um tipo de brinquedo
  const handleEdit = (id) => {
    navigate(`/editar-tipo-brinquedo/${id}`);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Menu Lateral */}
      <Menu />

      <div style={{ flexGrow: 1, padding: '20px' }}>
        <h2>Tipos de Brinquedos</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <ul>
          {tiposBrinquedos.map((tipo) => (
            <li key={tipo.codigoUnico + tipo.nome}>
              {tipo.nome}
              <button onClick={() => handleEdit(tipo.codigoUnico)}>Editar</button>
              <button onClick={() => handleDelete(tipo.codigoUnico)}>Excluir</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TipoBrinquedoList;
