import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { listarTiposBrinquedos, deletarTipoBrinquedo } from "../API/APITiposBrinquedos"
import Menu from "./Menu"
import "../css/DataList.css"

const TipoBrinquedoList = ({ token }) => {
  const [tiposBrinquedos, setTiposBrinquedos] = useState([])
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTiposBrinquedos = async () => {
      try {
        const data = await listarTiposBrinquedos(token)
        setTiposBrinquedos(data)
      } catch (err) {
        setError(err.message || "Erro ao carregar tipos de brinquedos")
      }
    }

    fetchTiposBrinquedos()
  }, [token])

  const handleDelete = async (id) => {
    if (!token) {
      alert("Erro: usuário não autenticado.")
      return
    }

    if (window.confirm("Tem certeza que deseja excluir este tipo de brinquedo?")) {
      try {
        await deletarTipoBrinquedo(id, token)
        alert("Tipo de brinquedo excluído com sucesso!")
        setTiposBrinquedos(tiposBrinquedos.filter((tipo) => tipo.ID !== id))
      } catch (error) {
        alert(error.message)
      }
    }
  }

  const handleEdit = (id) => {
    navigate(`/editar-tipo-brinquedo/${id}`)
  }

  return (
    <div className="page-container">
      <Menu>
        <div className="content-container">
          <div className="content-header">
            <h2>Tipos de Brinquedos</h2>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="data-list-container">
            {tiposBrinquedos.length === 0 ? (
              <div className="empty-list">
                <p>Nenhum tipo de brinquedo encontrado.</p>
              </div>
            ) : (
              <div className="data-list">
                <div className="data-list-header">
                  <div className="data-cell" data-label="Nome">Nome</div>
                  <div className="data-cell actions">Ações</div>
                </div>

                {tiposBrinquedos.map((tipo) => (
                  <div key={tipo.ID} className="data-row">
                    <div className="data-cell" data-label="Nome">{tipo.nome}</div>
                    <div className="data-cell actions">
                      <button className="action-button edit" onClick={() => handleEdit(tipo.ID)}>
                        Editar
                      </button>
                      <button className="action-button delete" onClick={() => handleDelete(tipo.ID)}>
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Menu>
    </div>
  )
}

export default TipoBrinquedoList
