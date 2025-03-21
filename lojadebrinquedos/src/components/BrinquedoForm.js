import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  criarBrinquedo,
  atualizarBrinquedo,
  obterBrinquedoPorId
} from "../API/APIBrinquedos";
import { listarTiposBrinquedos } from "../API/APITiposBrinquedos";
import Menu from "./Menu";

const BrinquedoForm = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [brinquedo, setBrinquedo] = useState({
    nome: "",
    tipoBrinquedo: "",
    marca: "",
    dataAquisicao: "",
    vlLocacao: ""
  });
  const [tiposBrinquedos, setTiposBrinquedos] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchTiposBrinquedos = async () => {
      try {
        const data = await listarTiposBrinquedos(token);
        setTiposBrinquedos(data);
      } catch (err) {
        setError("Erro ao carregar tipos de brinquedos");
      }
    };
    fetchTiposBrinquedos();
  }, [token]);

  // Carregar brinquedo para edição
  useEffect(() => {
    if (id) {
      const fetchBrinquedo = async () => {
        try {
          const data = await obterBrinquedoPorId(id, token);
          if (data && data.dataAquisicao) {
            data.dataAquisicao = data.dataAquisicao.split("T")[0];
          }
          setBrinquedo(data);
        } catch (err) {
          console.error("Erro ao carregar brinquedo:", err);
        }
      };
      fetchBrinquedo();
    }
  }, [id, token]);

  // Manipular campos do formulário
  const handleChange = (e) => {
    let { name, value } = e.target;
  
    if (name === "dataAquisicao") {
      value = value.split("T")[0];
    }
  
    setBrinquedo({ ...brinquedo, [name]: value });
  };

  // Manipular seleção do tipo de brinquedo
  const handleTipoChange = (e) => {
    const tipoSelecionado = tiposBrinquedos.find(tipo => tipo.codigoUnico === parseInt(e.target.value));
    setBrinquedo({ ...brinquedo, tipoBrinquedo: tipoSelecionado.codigoUnico });
  };

  // Submeter formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!brinquedo.nome || !brinquedo.tipoBrinquedo || !brinquedo.marca || !brinquedo.dataAquisicao || !brinquedo.vlLocacao) {
      setError("Todos os campos são obrigatórios.");
      return;
    }
    console.log(brinquedo);
    try {
      if (id) {
        await atualizarBrinquedo(id, token, brinquedo);
        setMessage("Brinquedo atualizado com sucesso!");
      } else {
        await criarBrinquedo(token, brinquedo);
        setMessage("Brinquedo cadastrado com sucesso!");
        setBrinquedo({ nome: "", tipoBrinquedo: "", marca: "", dataAquisicao: "", vlLocacao: "" });
      }
      setError("");
      setTimeout(() => navigate("/brinquedos"), 2000);
    } catch (err) {
      setError(err.message);
      setMessage("");
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Menu />
      <div style={{ flexGrow: 1, padding: "20px" }}>
        <h2>{id ? "Editar Brinquedo" : "Cadastrar Brinquedo"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="nome"
            placeholder="Nome do Brinquedo"
            value={brinquedo.nome}
            onChange={handleChange}
            required
          />
          <select name="tipoBrinquedo" value={brinquedo.tipoBrinquedo} onChange={handleTipoChange} required>
            <option value="">Selecione o Tipo</option>
            {tiposBrinquedos.map((tipo) => (
              <option key={tipo.codigoUnico} value={tipo.codigoUnico}>
                {tipo.nome}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="marca"
            placeholder="Marca"
            value={brinquedo.marca}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="dataAquisicao"
            value={brinquedo.dataAquisicao}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="vlLocacao"
            placeholder="Valor da Locação"
            value={brinquedo.vlLocacao}
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

export default BrinquedoForm;
