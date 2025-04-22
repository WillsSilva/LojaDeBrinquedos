"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { listarFuncionarios, deleteFuncionario } from "../API/APIFuncionarios"
import Menu from "./Menu"
import "../css/DataList.css" // Importando o CSS reutilizável

const FuncionarioList = ({ token }) => {
  const [funcionarios, setFuncionarios] = useState([])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchFuncionarios = async () => {
      setIsLoading(true)
      try {
        const data = await listarFuncionarios(token)
        setFuncionarios(data)
        setError("")
      } catch (err) {
        setError(err.message || "Erro ao carregar funcionários")
      } finally {
        setIsLoading(false)
      }
    }

    fetchFuncionarios()
  }, [token])

  // Função para excluir funcionário
  const handleDelete = async (id) => {
    if (!token) {
      alert("Erro: usuário não autenticado.")
      return
    }

    if (window.confirm("Tem certeza que deseja excluir este funcionário?")) {
      try {
        await deleteFuncionario(id, token)
        alert("Funcionário excluído com sucesso!")
        // Atualizar a lista sem recarregar a página
        setFuncionarios(funcionarios.filter((f) => f.username !== id))
      } catch (error) {
        alert(error.message)
      }
    }
  }

  // Função para editar funcionário
  const handleEdit = (id) => {
    navigate(`/editar/${id}`)
  }

  return (
    <div className="page-container">
      {/* Menu Lateral */}
      <Menu>
        <div className="content-container">
          <div className="content-header">
            <h2>Lista de Funcionários</h2>
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
              <p>Carregando funcionários...</p>
            </div>
          ) : (
            <div className="data-list-container">
              {funcionarios.length === 0 ? (
                <div className="empty-list">
                  <p>Nenhum funcionário encontrado.</p>
                </div>
              ) : (
                <div className="data-list">
                  <div className="data-list-header">
                    <div className="data-cell" data-label="Nome">
                      Nome
                    </div>
                    <div className="data-cell" data-label="Função">
                      Função
                    </div>
                    <div className="data-cell actions">Ações</div>
                  </div>

                  {funcionarios.map((funcionario) => (
                    <div key={funcionario.username} className="data-row">
                      <div className="data-cell" data-label="Nome">
                        {funcionario.nome}
                      </div>
                      <div className="data-cell" data-label="Função">
                        {funcionario.role}
                      </div>
                      <div className="data-cell actions">
                        <button className="action-button edit" onClick={() => handleEdit(funcionario.username)}>
                          Editar
                        </button>
                        <button className="action-button delete" onClick={() => handleDelete(funcionario.username)}>
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

export default FuncionarioList
