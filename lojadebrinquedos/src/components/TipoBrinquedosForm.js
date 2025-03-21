import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { criarTipoBrinquedo, atualizarTipoBrinquedo, listarTiposBrinquedos, obterTipoBrinquedoPorId } from "../API/APITiposBrinquedos";
import Menu from "./Menu";

const TipoBrinquedoForm = ({ token, userRole }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tipoBrinquedo, setTipoBrinquedo] = useState({ nome: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [existingNomes, setExistingNomes] = useState([]);

  // Carregar tipo de brinquedo para edição
  useEffect(() => {
    if (id) {
      const fetchTipoBrinquedo = async () => {
        try {
          const data = await obterTipoBrinquedoPorId(id, token);
          if (data && data.nome) {
            setTipoBrinquedo(data);
          } else {
            setError("Dados incompletos para edição");
          }
        } catch (err) {
          setError("Erro ao carregar tipo de brinquedo");
        }
      };
      fetchTipoBrinquedo();
    }
  }, [id, token]);

  // Carregar todos os nomes de tipos de brinquedos para evitar duplicidade
  useEffect(() => {
    const fetchNomes = async () => {
      try {
        const data = await listarTiposBrinquedos(token);
        setExistingNomes(data.map(tipo => tipo.nome));
      } catch (err) {
        setError("Erro ao carregar lista de tipos de brinquedos");
      }
    };

    fetchNomes();
  }, [token]);

  // Manipulação de campos do formulário
  const handleChange = (e) => {
    setTipoBrinquedo({ ...tipoBrinquedo, [e.target.name]: e.target.value });
  };

  const nomeExists = (nome) => existingNomes.includes(nome);

  // Submissão do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!tipoBrinquedo.nome) {
      setError("Por favor, preencha o nome do tipo de brinquedo.");
      return;
    }
  
    if (nomeExists(tipoBrinquedo.nome) && tipoBrinquedo.nome !== (id ? tipoBrinquedo.nome : "")) {
      setError("Esse tipo de brinquedo já está cadastrado.");
      return;
    }
  
    try {
      if (id) {
        await atualizarTipoBrinquedo(id, token, tipoBrinquedo);
        setMessage("Tipo de brinquedo atualizado com sucesso!");
      } else {
        await criarTipoBrinquedo(token, tipoBrinquedo);
        setMessage("Tipo de brinquedo cadastrado com sucesso!");
        setTipoBrinquedo({ nome: "" });
      }
      setError("");
      setTimeout(() => navigate("/tipos"), 2000);
    } catch (err) {
      setError(err.message);
      setMessage("");
    }
  };
  

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Menu />

      <div style={{ flexGrow: 1, padding: "20px" }}>
        <h2>{id ? "Editar Tipo de Brinquedo" : "Cadastrar Tipo de Brinquedo"}</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="nome"
              placeholder="Nome do Tipo"
              value={tipoBrinquedo.nome || ""}
              onChange={handleChange}
              required
            />
            <button type="submit">{id ? "Atualizar" : "Cadastrar"}</button>
          </form>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}
      </div>
    </div>
  );
};

export default TipoBrinquedoForm;
