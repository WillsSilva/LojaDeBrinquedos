"use client"

import { useEffect, useState } from "react"
import { listarPagamentos } from "../API/APIPagamento"
import Menu from "./Menu"
import "../css/DataList.css"

const PagamentosList = ({ token }) => {
  const [pagamentos, setPagamentos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchPagamentos = async () => {
      setIsLoading(true)
      setError("")
      try {
        const data = await listarPagamentos(token)
        setPagamentos(data)
      } catch (err) {
        console.error("Erro ao buscar pagamentos:", err)
        setError(err.message || "Erro ao carregar pagamentos")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPagamentos()
  }, [token])

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value || 0)
  }

  const formatDate = (dataISO) => {
    return dataISO ? new Date(dataISO).toLocaleDateString("pt-BR") : "-"
  }

  return (
    <div className="page-container">
      <Menu>
        <div className="content-container">
          <div className="content-header">
            <h2>Lista de Pagamentos</h2>
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
              <p>Carregando pagamentos...</p>
            </div>
          ) : (
            <div className="data-list-container">
              {pagamentos.length === 0 ? (
                <div className="empty-list">
                  <p>Nenhum pagamento registrado ainda.</p>
                </div>
              ) : (
                <div className="data-list">
                  <div className="data-list-header">
                    <div className="data-cell">ID</div>
                    <div className="data-cell">Cliente</div>
                    <div className="data-cell">CPF</div>
                    <div className="data-cell">Valor Locação</div>
                    <div className="data-cell">Valor Pago</div>
                    <div className="data-cell">Valor Troco</div>
                    <div className="data-cell">Data Pagamento</div>
                  </div>

                  {pagamentos.map((pagamento) => (
                    <div key={pagamento.ID} className="data-row">
                      <div className="data-cell-id">{pagamento.ID}</div>
                      <div className="data-cell">{pagamento.nomeCliente || "-"}</div>
                      <div className="data-cell">{pagamento.cpf || "-"}</div>
                      <div className="data-cell">{formatCurrency(pagamento.valorLocacao)}</div>
                      <div className="data-cell">{formatCurrency(pagamento.valorPago)}</div>
                      <div className="data-cell">{formatCurrency(pagamento.valorTroco)}</div>
                      <div className="data-cell">{formatDate(pagamento.dataPagamento)}</div>
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

export default PagamentosList
