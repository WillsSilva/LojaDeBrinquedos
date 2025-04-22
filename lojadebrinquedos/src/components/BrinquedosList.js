"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { listarBrinquedos, deletarBrinquedo } from "../API/APIBrinquedos"
import { listarTiposBrinquedos } from "../API/APITiposBrinquedos"
import Menu from "./Menu"
import "../css/DataList.css" // Importando o CSS reutilizável

const BrinquedosList = ({ token }) => {
  const [brinquedos, setBrinquedos] = useState([])
  const [tipos, setTipos] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError("")
      try {
        const brinquedosData = await listarBrinquedos(token)
        const tiposData = await listarTiposBrinquedos(token)

        const tiposMap = {}
        tiposData.forEach((tipo) => {
          tiposMap[tipo.ID] = tipo.nome
        })

        setBrinquedos(brinquedosData)
        setTipos(tiposMap)
      } catch (error) {
        console.error("Erro ao buscar brinquedos:", error)
        setError(error.message || "Erro ao carregar brinquedos")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [token])

  // Função para excluir brinquedo
  const handleDelete = async (id) => {
    if (!token) {
      alert("Erro: usuário não autenticado.")
      return
    }

    if (!window.confirm("Tem certeza que deseja excluir este brinquedo?")) {
      return
    }

    try {
      await deletarBrinquedo(id, token)
      alert("Brinquedo excluído com sucesso!")
      setBrinquedos(brinquedos.filter((brinquedo) => brinquedo.ID !== id))
    } catch (error) {
      alert("Erro ao excluir brinquedo: " + error.message)
    }
  }

  // Função para editar brinquedo
  const handleEdit = (id) => {
    navigate(`/editar-brinquedo/${id}`)
  }

  // Função para formatar valor monetário
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value || 0)
  }

  return (
    <div className="page-container">
      {/* Menu Lateral */}
      <Menu>
        <div className="content-container">
          <div className="content-header">
            <h2>Lista de Brinquedos</h2>
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
              <p>Carregando brinquedos...</p>
            </div>
          ) : (
            <div className="data-list-container">
              {brinquedos.length === 0 ? (
                <div className="empty-list">
                  <p>Nenhum brinquedo encontrado.</p>
                </div>
              ) : (
                <div className="data-list">
                  <div className="data-list-header">
                    <div className="data-cell" data-label="Código">
                      Código
                    </div>
                    <div className="data-cell" data-label="Nome">
                      Nome
                    </div>
                    <div className="data-cell" data-label="Tipo">
                      Tipo
                    </div>
                    <div className="data-cell" data-label="Marca">
                      Marca
                    </div>
                    <div className="data-cell" data-label="Valor">
                      Valor Locação
                    </div>
                    <div className="data-cell actions">Ações</div>
                  </div>

                  {brinquedos.map((brinquedo) => (
                    <div key={brinquedo.ID} className="data-row">
                      <div className="data-cell" data-label="Código">
                        {brinquedo.ID}
                      </div>
                      <div className="data-cell" data-label="Nome">
                        {brinquedo.nome || "Sem nome"}
                      </div>
                      <div className="data-cell" data-label="Tipo">
                        {tipos[brinquedo.tipoBrinquedo] || "Tipo desconhecido"}
                      </div>
                      <div className="data-cell" data-label="Marca">
                        {brinquedo.marca || "Sem marca"}
                      </div>
                      <div className="data-cell" data-label="Valor">
                        {formatCurrency(brinquedo.vlLocacao)}
                      </div>
                      <div className="data-cell actions">
                        <button className="action-button edit" onClick={() => handleEdit(brinquedo.ID)}>
                          Editar
                        </button>
                        <button className="action-button delete" onClick={() => handleDelete(brinquedo.ID)}>
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

export default BrinquedosList
