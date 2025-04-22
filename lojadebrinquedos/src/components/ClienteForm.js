import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  criarCliente,
  atualizarCliente,
  obterClientePorId,
  listarClientes,
} from "../API/APIClientes"
import Menu from "./Menu"
import "../css/Form.css"

const ClienteForm = ({ token }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [cliente, setCliente] = useState({
    cpf: "",
    nome: "",
    endereco: "",
    dataNasc: "",
    telefone: "",
  })
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [existingCPFs, setExistingCPFs] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Carregar cliente (se edição)
  useEffect(() => {
    if (id) {
      const fetchCliente = async () => {
        setIsLoading(true)
        try {
          const data = await obterClientePorId(id, token)
          if (data?.cpf && data?.nome && data?.endereco && data?.dataNasc && data?.telefone) {
            setCliente({ ...data, dataNasc: data.dataNasc.split("T")[0] })
          } else {
            setError("Dados incompletos para edição")
          }
        } catch (err) {
          setError("Erro ao carregar cliente")
        } finally {
          setIsLoading(false)
        }
      }
      fetchCliente()
    }
  }, [id, token])

  // CPFs existentes (validação)
  useEffect(() => {
    const fetchCPFs = async () => {
      try {
        const data = await listarClientes(token)
        setExistingCPFs(data.map((cli) => cli.cpf))
      } catch (err) {
        setError("Erro ao carregar lista de clientes")
      }
    }

    fetchCPFs()
  }, [token])

  const handleChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value })
  }

  const cpfExists = (cpf) => existingCPFs.includes(cpf)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")

    const { cpf, nome, endereco, dataNasc, telefone } = cliente

    if (!cpf || !nome || !endereco || !dataNasc || !telefone) {
      setError("Por favor, preencha todos os campos.")
      return
    }

    if (cpfExists(cpf) && !id) {
      setError("CPF já cadastrado.")
      return
    }

    setIsLoading(true)
    try {
      if (id) {
        await atualizarCliente(id, token, cliente)
        setMessage("Cliente atualizado com sucesso!")
      } else {
        await criarCliente(token, cliente)
        setMessage("Cliente cadastrado com sucesso!")
        setCliente({ cpf: "", nome: "", endereco: "", dataNasc: "", telefone: "" })
      }

      setTimeout(() => navigate("/clientes"), 2000)
    } catch (err) {
      setError(err.message || "Erro ao processar solicitação")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    navigate("/clientes")
  }

  return (
    <div className="page-container">
      <Menu>
        <div className="content-container">
          <div className="content-header">
            <h2>{id ? "Editar Cliente" : "Cadastrar Cliente"}</h2>
          </div>

          {isLoading && !id ? (
            <div className="loading-indicator">
              <div className="spinner"></div>
              <p>Carregando...</p>
            </div>
          ) : (
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
                  <label htmlFor="cpf">CPF</label>
                  <input
                    type="text"
                    id="cpf"
                    name="cpf"
                    value={cliente.cpf}
                    onChange={handleChange}
                    required
                    disabled={!!id}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="nome">Nome</label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={cliente.nome}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="endereco">Endereço</label>
                  <input
                    type="text"
                    id="endereco"
                    name="endereco"
                    value={cliente.endereco}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="dataNasc">Data de Nascimento</label>
                  <input
                    type="date"
                    id="dataNasc"
                    name="dataNasc"
                    value={cliente.dataNasc}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="telefone">Telefone</label>
                  <input
                    type="text"
                    id="telefone"
                    name="telefone"
                    value={cliente.telefone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-actions">
                  <button type="button" className="button secondary" onClick={handleCancel}>
                    Cancelar
                  </button>
                  <button type="submit" className="button primary" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <span className="spinner-small"></span>
                        <span>{id ? "Atualizando..." : "Cadastrando..."}</span>
                      </>
                    ) : (
                      <span>{id ? "Atualizar" : "Cadastrar"}</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </Menu>
    </div>
  )
}

export default ClienteForm
