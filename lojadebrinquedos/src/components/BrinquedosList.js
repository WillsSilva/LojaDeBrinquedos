import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listarBrinquedos, deletarBrinquedo } from "../API/APIBrinquedos";
import { listarTiposBrinquedos } from "../API/APITiposBrinquedos";
import Menu from "./Menu";

const BrinquedosList = ({ token }) => {
  const [brinquedos, setBrinquedos] = useState([]);
  const [tipos, setTipos] = useState({}); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const brinquedosData = await listarBrinquedos(token);
        const tiposData = await listarTiposBrinquedos(token);
        
        const tiposMap = {};
        tiposData.forEach(tipo => {
          tiposMap[tipo.codigoUnico] = tipo.nome;
        });

        setBrinquedos(brinquedosData);
        setTipos(tiposMap);
      } catch (error) {
        console.error("Erro ao buscar brinquedos:", error);
      }
    };

    fetchData();
  }, [token]);

  // Função para excluir brinquedo
  const handleDelete = async (id) => {
    if (!token) {
      alert("Erro: usuário não autenticado.");
      return;
    }
  
    if (!window.confirm("Tem certeza que deseja excluir este brinquedo?")) {
      return;
    }

    try {
      await deletarBrinquedo(id, token);
      alert("Brinquedo excluído com sucesso!");
      setBrinquedos(brinquedos.filter(brinquedo => brinquedo.codigoUnico !== id));
    } catch (error) {
      alert("Erro ao excluir brinquedo: " + error.message);
    }
  };

  // Função para editar brinquedo
  const handleEdit = (id) => {
    navigate(`/editar-brinquedo/${id}`);
  };  

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Menu />
      <div style={{ flexGrow: 1, padding: "20px" }}>
        <h2>Lista de Brinquedos</h2>
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Nome</th>
              <th>Tipo</th>
              <th>Marca</th>
              <th>Valor Locação</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {brinquedos.map((brinquedo) => (
              <tr key={brinquedo.codigoUnico}>
                <td>{brinquedo.codigoUnico}</td>
                <td>{brinquedo.nome || "Sem nome"}</td>
                <td>{tipos[brinquedo.tipoBrinquedo] || "Tipo desconhecido"}</td>
                <td>{brinquedo.marca || "Sem marca"}</td>
                <td>R$ {brinquedo.vlLocacao?.toFixed(2)}</td>
                <td>
                  <button onClick={() => handleEdit(brinquedo.codigoUnico)}>Editar</button>
                  <button onClick={() => handleDelete(brinquedo.codigoUnico)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BrinquedosList;
