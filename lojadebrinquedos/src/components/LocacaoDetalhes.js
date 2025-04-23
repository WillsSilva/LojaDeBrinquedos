import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { obterLocacaoPorId } from "../API/APILocacoes"
import Menu from "./Menu"
import "../css/Form.css"

const LocacaoDetalhes = ({ token }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [locacao, setLocacao] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchLocacao = async () => {
      try {
        const data = await obterLocacaoPorId(id, token)
        setLocacao(data)
      } catch {
        setError("Erro ao carregar detalhes da locação.")
      }
    }

    fetchLocacao()
  }, [id, token])

  return (
    <div className="page-container">
      <Menu>
        <div className="content-container">
          <div className="content-header">
            <h2>Detalhes da Locação</h2>
          </div>

          {error && (
            <div className="message error">
              <span className="message-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {locacao && (
            <div className="form-container">
              <div className="form-group">
                <label>CPF do Cliente:</label>
                <span>{locacao.cpf}</span>
              </div>
              <div className="form-group">
                <label>Data de Devolução:</label>
                <span>{locacao.dataDevolucao?.split("T")[0]}</span>
              </div>
              <div className="form-group">
                <label>Brinquedos:</label>
                <ul>
                  {locacao.brinquedos?.map((item, index) => (
                    <li key={index}>
                      #{item.IDBrinquedo} - Valor:{" "}
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(item.vlBrinquedo)}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="form-actions">
                <button className="button secondary" onClick={() => navigate("/locacoes")}>
                  Voltar
                </button>
              </div>
            </div>
          )}
        </div>
      </Menu>
    </div>
  )
}

export default LocacaoDetalhes
