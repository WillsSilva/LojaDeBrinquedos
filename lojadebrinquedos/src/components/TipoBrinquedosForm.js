import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  criarTipoBrinquedo,
  atualizarTipoBrinquedo,
  listarTiposBrinquedos,
  obterTipoBrinquedoPorId,
} from "../API/APITiposBrinquedos"
import Menu from "./Menu"
import "../css/Form.css"

const TipoBrinquedoForm = ({ token }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tipoBrinquedo, setTipoBrinquedo] = useState({ nome: "" })
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [existingNomes, setExistingNomes] = useState([])

  useEffect(() => {
    if (id) {
      const fetchTipoBrinquedo = async () => {
        try {
          const data = await obterTipoBrinquedoPorId(id, token)
          if (data?.nome) {
            setTipoBrinquedo(data)
          } else {
            setError("Dados incompletos para edição")
          }
        } catch (err) {
          setError("Erro ao carregar tipo de brinquedo")
        }
      }
      fetchTipoBrinquedo()
    }
  }, [id, token])

  useEffect(() => {
    const fetchNomes = async () => {
      try {
        const data = await listarTiposBrinquedos(token)
        setExistingNomes(data.map((tipo) => tipo.nome))
      } catch (err) {
        setError("Erro ao carregar lista de tipos de brinquedos")
      }
    }

    fetchNomes()
  }, [token])

  const handleChange = (e) => {
    setTipoBrinquedo({ ...tipoBrinquedo, [e.target.name]: e.target.value })
  }

  const nomeExists = (nome) => existingNomes.includes(nome)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!tipoBrinquedo.nome) {
      setError("Por favor, preencha o nome do tipo de brinquedo.")
      return
    }

    if (nomeExists(tipoBrinquedo.nome) && tipoBrinquedo.nome !== (id ? tipoBrinquedo.nome : "")) {
      setError("Esse tipo de brinquedo já está cadastrado.")
      return
    }

    try {
      if (id) {
        await atualizarTipoBrinquedo(id, token, tipoBrinquedo)
        setMessage("Tipo de brinquedo atualizado com sucesso!")
      } else {
        await criarTipoBrinquedo(token, tipoBrinquedo)
        setMessage("Tipo de brinquedo cadastrado com sucesso!")
        setTipoBrinquedo({ nome: "" })
      }

      setError("")
      setTimeout(() => navigate("/tipos"), 2000)
    } catch (err) {
      setError(err.message || "Erro ao processar solicitação")
      setMessage("")
    }
  }

  const handleCancel = () => {
    navigate("/tipos")
  }

  return (
    <div className="page-container">
      <Menu>
        <div className="content-container">
          <div className="content-header">
            <h2>{id ? "Editar Tipo de Brinquedo" : "Cadastrar Tipo de Brinquedo"}</h2>
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
                <label htmlFor="nome">Nome do Tipo</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  placeholder="Ex: Educativo, Eletrônico..."
                  value={tipoBrinquedo.nome || ""}
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

export default TipoBrinquedoForm
