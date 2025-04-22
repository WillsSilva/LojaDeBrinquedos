"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  criarFuncionario,
  atualizarFuncionario,
  obterFuncionarioPorId,
  listarFuncionarios,
} from "../API/APIFuncionarios"
import Menu from "./Menu"
import "../css/Form.css" // Importando o CSS para formulários

const FuncionarioForm = ({ token }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [funcionario, setFuncionario] = useState({
    cpf: "",
    nome: "",
    telefone: "",
    role: "",
    username: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [existingUsernames, setExistingUsernames] = useState([])

  // Buscar funcionário para edição
  useEffect(() => {
    if (id) {
      const fetchFuncionario = async () => {
        setIsLoading(true)
        try {
          const data = await obterFuncionarioPorId(id, token)
          if (data && data.cpf && data.nome && data.telefone && data.role && data.username) {
            setFuncionario(data)
          } else {
            setError("Dados incompletos para edição")
          }
        } catch (err) {
          setError("Erro ao carregar funcionário")
        } finally {
          setIsLoading(false)
        }
      }
      fetchFuncionario()
    }
  }, [id, token])

  // Buscar todos os usernames existentes para verificar duplicidade
  useEffect(() => {
    const fetchUsernames = async () => {
      try {
        const data = await listarFuncionarios(token)
        setExistingUsernames(data.map((func) => func.username))
      } catch (err) {
        setError("Erro ao carregar lista de funcionários")
      }
    }

    fetchUsernames()
  }, [token])

  // Manipulação de campos do formulário
  const handleChange = (e) => {
    setFuncionario({ ...funcionario, [e.target.name]: e.target.value })
  }

  // Função para verificar se o username já existe
  const usernameExists = (username) => {
    return existingUsernames.includes(username)
  }

  // Submissão do formulário
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")

    // Verificar se todos os campos estão preenchidos
    if (
      !funcionario.cpf ||
      !funcionario.nome ||
      !funcionario.telefone ||
      !funcionario.role ||
      !funcionario.username ||
      (!id && !funcionario.password)
    ) {
      setError("Por favor, preencha todos os campos.")
      return
    }

    // Verificar se o username já está em uso, exceto quando é o mesmo que o do funcionário sendo editado
    if (!id && usernameExists(funcionario.username)) {
      setError("Nome de usuário já está em uso.")
      return
    }

    setIsLoading(true)
    try {
      if (id) {
        await atualizarFuncionario(id, token, funcionario)
        setMessage("Funcionário atualizado com sucesso!")
      } else {
        await criarFuncionario(token, funcionario)
        setMessage("Funcionário cadastrado com sucesso!")
        setFuncionario({ cpf: "", nome: "", telefone: "", role: "", username: "", password: "" })
      }

      // Redirecionar após um breve delay para mostrar a mensagem de sucesso
      setTimeout(() => navigate("/funcionarios"), 2000)
    } catch (err) {
      setError(err.message || "Ocorreu um erro ao processar sua solicitação")
    } finally {
      setIsLoading(false)
    }
  }

  // Função para cancelar e voltar para a lista
  const handleCancel = () => {
    navigate("/funcionarios")
  }

  return (
    <div className="page-container">
      {/* Menu Lateral */}
      <Menu>
        <div className="content-container">
          <div className="content-header">
            <h2>{id ? "Editar Funcionário" : "Cadastrar Funcionário"}</h2>
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
                    placeholder="Digite o CPF"
                    value={funcionario.cpf || ""}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="nome">Nome</label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    placeholder="Digite o nome completo"
                    value={funcionario.nome || ""}
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
                    placeholder="Digite o telefone"
                    value={funcionario.telefone || ""}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="role">Função</label>
                  <select id="role" name="role" value={funcionario.role || ""} onChange={handleChange} required>
                    <option value="" disabled>
                      Selecione uma função
                    </option>
                    <option value="gerente">Gerente</option>
                    <option value="Caixa">Caixa</option>
                    <option value="Almoxarife">Almoxarife</option>
                    <option value="AnalistadeCadastro">Analista de cadastro</option>
                    <option value="AgenteDeLocacao">Agente de locação</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="username">Nome de usuário</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Digite o nome de usuário"
                    value={funcionario.username || ""}
                    onChange={handleChange}
                    required
                    disabled={id ? true : false}
                    className={id ? "disabled" : ""}
                  />
                  {id && <small>O nome de usuário não pode ser alterado após o cadastro.</small>}
                </div>

                <div className="form-group">
                  <label htmlFor="password">Senha {!id && <span className="required">*</span>}</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder={id ? "Deixe em branco para manter a senha atual" : "Digite a senha"}
                    value={funcionario.password || ""}
                    onChange={handleChange}
                    required={!id}
                  />
                  {id && <small>Preencha apenas se desejar alterar a senha atual.</small>}
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

export default FuncionarioForm
