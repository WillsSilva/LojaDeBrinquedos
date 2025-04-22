import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  criarBrinquedo,
  atualizarBrinquedo,
  obterBrinquedoPorId,
} from "../API/APIBrinquedos"
import { listarTiposBrinquedos } from "../API/APITiposBrinquedos"
import Menu from "./Menu"
import "../css/Form.css"

const BrinquedoForm = ({ token }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [brinquedo, setBrinquedo] = useState({
    nome: "",
    tipoBrinquedo: "",
    marca: "",
    dataAquisicao: "",
    vlLocacao: "",
  })
  const [tiposBrinquedos, setTiposBrinquedos] = useState([])
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const fetchTiposBrinquedos = async () => {
      try {
        const data = await listarTiposBrinquedos(token)
        setTiposBrinquedos(data)
      } catch (err) {
        setError("Erro ao carregar tipos de brinquedos")
      }
    }
    fetchTiposBrinquedos()
  }, [token])

  useEffect(() => {
    if (id) {
      const fetchBrinquedo = async () => {
        try {
          const data = await obterBrinquedoPorId(id, token)
          if (data?.dataAquisicao) {
            data.dataAquisicao = data.dataAquisicao.split("T")[0]
          }
          data.vlLocacao = formatarMoeda(data.vlLocacao.toString())
          setBrinquedo(data)
        } catch (err) {
          setError("Erro ao carregar brinquedo")
        }
      }
      fetchBrinquedo()
    }
  }, [id, token])

  const formatarMoeda = (valor) => {
    if (!valor) return ""
    const numero = parseFloat(valor.replace(/[^\d]/g, "")) / 100
    return numero.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  const handleChange = (e) => {
    let { name, value } = e.target
    if (name === "dataAquisicao") {
      value = value.split("T")[0]
    }

    if (name === "vlLocacao") {
      value = formatarMoeda(value)
    }

    setBrinquedo({ ...brinquedo, [name]: value })
  }

  const handleTipoChange = (e) => {
    const tipoSelecionado = tiposBrinquedos.find((tipo) => tipo.ID === parseInt(e.target.value))
    setBrinquedo({ ...brinquedo, tipoBrinquedo: tipoSelecionado?.ID || "" })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const valoresNumericos = {
      ...brinquedo,
      vlLocacao: parseFloat(brinquedo.vlLocacao.replace(/[^\d]/g, "")) / 100,
    }

    if (
      !valoresNumericos.nome ||
      !valoresNumericos.tipoBrinquedo ||
      !valoresNumericos.marca ||
      !valoresNumericos.dataAquisicao ||
      !valoresNumericos.vlLocacao
    ) {
      setError("Todos os campos são obrigatórios.")
      return
    }

    try {
      if (id) {
        await atualizarBrinquedo(id, token, valoresNumericos)
        setMessage("Brinquedo atualizado com sucesso!")
      } else {
        await criarBrinquedo(token, valoresNumericos)
        setMessage("Brinquedo cadastrado com sucesso!")
        setBrinquedo({
          nome: "",
          tipoBrinquedo: "",
          marca: "",
          dataAquisicao: "",
          vlLocacao: "",
        })
      }

      setError("")
      setTimeout(() => navigate("/brinquedos"), 2000)
    } catch (err) {
      setError(err.message || "Erro ao processar solicitação")
      setMessage("")
    }
  }

  const handleCancel = () => {
    navigate("/brinquedos")
  }

  return (
    <div className="page-container">
      <Menu>
        <div className="content-container">
          <div className="content-header">
            <h2>{id ? "Editar Brinquedo" : "Cadastrar Brinquedo"}</h2>
          </div>

          <div className="form-container">
            {error && (
              <div className="message error">
                <span className="message-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {message && (
              <div className="message success">
                <span className="message-icon">✅</span>
                <span>{message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <label htmlFor="nome">Nome do Brinquedo</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={brinquedo.nome}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="tipoBrinquedo">Tipo de Brinquedo</label>
                <select
                  id="tipoBrinquedo"
                  name="tipoBrinquedo"
                  value={brinquedo.tipoBrinquedo}
                  onChange={handleTipoChange}
                  required
                >
                  <option value="">Selecione o Tipo</option>
                  {tiposBrinquedos.map((tipo) => (
                    <option key={tipo.ID} value={tipo.ID}>
                      {tipo.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="marca">Marca</label>
                <input
                  type="text"
                  id="marca"
                  name="marca"
                  value={brinquedo.marca}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="dataAquisicao">Data de Aquisição</label>
                <input
                  type="date"
                  id="dataAquisicao"
                  name="dataAquisicao"
                  value={brinquedo.dataAquisicao}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="vlLocacao">Valor de Locação</label>
                <input
                  type="text"
                  id="vlLocacao"
                  name="vlLocacao"
                  placeholder="R$ 0,00"
                  value={brinquedo.vlLocacao}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" className="button secondary" onClick={handleCancel}>
                  Cancelar
                </button>
                <button type="submit" className="button primary">
                  {id ? "Atualizar" : "Cadastrar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Menu>
    </div>
  )
}

export default BrinquedoForm
