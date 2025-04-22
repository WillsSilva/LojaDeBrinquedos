import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listarClientes, deletarCliente } from '../API/APIClientes'
import Menu from './Menu'
import '../css/DataList.css'

const ClienteList = ({ token }) => {
  const [clientes, setClientes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchClientes = async () => {
      setIsLoading(true)
      try {
        const data = await listarClientes(token)
        setClientes(data)
      } catch (err) {
        setError(err.message || 'Erro ao carregar clientes')
      } finally {
        setIsLoading(false)
      }
    }

    fetchClientes()
  }, [token])

  const handleDelete = async (id) => {
    if (!token) {
      alert('Erro: usuário não autenticado.')
      return
    }

    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await deletarCliente(id, token)
        alert('Cliente excluído com sucesso!')
        setClientes(clientes.filter((c) => c.cpf !== id))
      } catch (error) {
        alert(error.message)
      }
    }
  }

  const handleEdit = (id) => {
    navigate(`/editar-cliente/${id}`)
  }

  const formatarData = (dataIso) => {
    const data = new Date(dataIso)
    return data.toLocaleDateString('pt-BR')
  }

  return (
    <div className="page-container">
      <Menu>
        <div className="content-container">
          <div className="content-header">
            <h2>Lista de Clientes</h2>
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
              <p>Carregando clientes...</p>
            </div>
          ) : (
            <div className="data-list-container">
              {clientes.length === 0 ? (
                <div className="empty-list">
                  <p>Nenhum cliente encontrado.</p>
                </div>
              ) : (
                <div className="data-list">
                  <div className="data-list-header">
                    <div className="data-cell" data-label="Nome">Nome</div>
                    <div className="data-cell" data-label="Endereço">Endereço</div>
                    <div className="data-cell" data-label="Data Nasc.">Data Nasc.</div>
                    <div className="data-cell" data-label="Telefone">Telefone</div>
                    <div className="data-cell actions">Ações</div>
                  </div>

                  {clientes.map((cliente) => (
                    <div key={cliente.cpf} className="data-row">
                      <div className="data-cell" data-label="Nome">{cliente.nome}</div>
                      <div className="data-cell" data-label="Endereço">{cliente.endereco}</div>
                      <div className="data-cell" data-label="Data Nasc.">{formatarData(cliente.dataNasc)}</div>
                      <div className="data-cell" data-label="Telefone">{cliente.telefone}</div>
                      <div className="data-cell actions">
                        <button className="action-button edit" onClick={() => handleEdit(cliente.cpf)}>Editar</button>
                        <button className="action-button delete" onClick={() => handleDelete(cliente.cpf)}>Excluir</button>
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

export default ClienteList
