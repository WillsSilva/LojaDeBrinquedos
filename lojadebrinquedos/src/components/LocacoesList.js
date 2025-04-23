"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { listarLocacoes, deletarLocacao } from "../API/APILocacoes"
import Menu from "./Menu"
import "../css/DataList.css"

const LocacoesList = ({ token }) => {
  const [locacoes, setLocacoes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError("")
      try {
        const data = await listarLocacoes(token)
        setLocacoes(data)
      } catch (error) {
        console.error("Erro ao buscar locações:", error)
        setError(error.message || "Erro ao carregar locações")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [token])

  const handleDelete = async (id) => {
    if (!token) {
      alert("Erro: usuário não autenticado.")
      return
    }

    if (!window.confirm("Tem certeza que deseja excluir esta locação?")) {
      return
    }

    try {
      await deletarLocacao(id, token)
      alert("Locação excluída com sucesso!")
      setLocacoes(locacoes.filter((locacao) => locacao.ID !== id))
    } catch (error) {
      alert("Erro ao excluir locação: " + error.message)
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value || 0)
  }

  const groupByLocacaoId = () => {
    const grouped = {}
    locacoes.forEach((loc) => {
      if (!grouped[loc.ID]) {
        grouped[loc.ID] = {
          ID: loc.ID,
          cpf: loc.cpf,
          dataLocacao: loc.dataLocacao,
          dataDevolucao: loc.dataDevolucao,
          brinquedos: [],
        }
      }
      grouped[loc.ID].brinquedos.push(loc)
    })
    return Object.values(grouped)
  }

  return (
    <div className="page-container">
      <Menu>
        <div className="content-container">
          <div className="content-header">
            <h2>Lista de Locações</h2>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {isLoading ? (
            <div className="loading-indicator">
              <div className="spinner"></div>
              <p>Carregando locações...</p>
            </div>
          ) : (
            <div className="data-list-container">
            {locacoes.length === 0 ? (
                <div className="empty-list">
                <p>Nenhuma locação encontrada.</p>
                </div>
            ) : (
                <div className="data-list">
                <div className="data-list-header">
                    <div className="data-cell">Código</div>
                    <div className="data-cell">Nome Cliente</div>
                    <div className="data-cell">Data Locação</div>
                    <div className="data-cell">Data Devolução</div>
                    <div className="data-cell">Vl. Total</div>
                    <div className="data-cell actions">Ações</div>
                </div>

                {groupByLocacaoId().map((locacao) => (
                    <div key={locacao.ID} className="data-row">
                    <div className="data-cell-id">{locacao.ID}</div>
                    <div className="data-cell">{locacao.brinquedos[0].nomeCliente}</div>
                    <div className="data-cell">{new Date(locacao.dataLocacao).toLocaleDateString()}</div>
                    <div className="data-cell">{new Date(locacao.dataDevolucao).toLocaleDateString()}</div>
                    <div className="data-cell">{formatCurrency(locacao.brinquedos[0].vlTotal)}</div>
                    <div className="data-cell actions">
                        <button
                        className="action-button view"
                        onClick={() => navigate(`/locacoes/${locacao.ID}`)}
                        >
                        Ver Detalhes
                        </button>
                        <button
                        className="action-button delete"
                        onClick={() => handleDelete(locacao.ID)}
                        >
                        Excluir
                        </button>
                    </div>
                    </div>
                ))}
                </div>
            )}
            </div>
          )}
        </div>
      </Menu>
    </div>
  )
}

export default LocacoesList
