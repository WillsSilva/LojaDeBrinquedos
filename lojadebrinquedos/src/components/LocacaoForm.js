"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { listarBrinquedos } from "../API/APIBrinquedos"
import { listarClientes } from "../API/APIClientes"
import { obterLocacaoPorId, atualizarLocacao, criarLocacao } from "../API/APILocacoes"
import Menu from "./Menu"
import "../css/Form.css"
import "../css/LocacaoForm.css"

const LocacaoForm = ({ token }) => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [cpf, setCpf] = useState("")
  const [clientes, setClientes] = useState([])
  const [dataDevolucao, setDataDevolucao] = useState("")
  const [brinquedosDisponiveis, setBrinquedosDisponiveis] = useState([])
  const [brinquedoSelecionado, setBrinquedoSelecionado] = useState("")
  const [itens, setItens] = useState([])
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [dataAtual] = useState(new Date().toISOString().split("T")[0]) // Data atual formatada como YYYY-MM-DD

  // Buscar clientes cadastrados
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const clientesData = await listarClientes(token)
        const brinquedosData = await listarBrinquedos(token)

        setClientes(clientesData)
        setBrinquedosDisponiveis(brinquedosData)

        // Definir a data de devolução como a data atual por padrão
        if (!id) {
          setDataDevolucao(dataAtual)
        }

        // Se for edição, buscar dados da locação
        if (id) {
          const locacaoData = await obterLocacaoPorId(id, token)
          setCpf(locacaoData.cpf)
          setDataDevolucao(locacaoData.dataDevolucao?.split("T")[0] || dataAtual)
          setItens(locacaoData.brinquedos || [])
        }

        setError("")
      } catch (err) {
        setError("Erro ao carregar dados: " + (err.message || "Erro desconhecido"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id, token, dataAtual])

  const handleAddItem = () => {
    if (!brinquedoSelecionado) {
      return
    }

    const brinquedoExistente = itens.find((item) => item.IDBrinquedo === Number.parseInt(brinquedoSelecionado))
    if (brinquedoExistente) {
      setError("Este brinquedo já foi adicionado à locação")
      return
    }

    const brinquedoObj = brinquedosDisponiveis.find((b) => b.ID === Number.parseInt(brinquedoSelecionado))
    if (brinquedoObj) {
      const novoItem = {
        IDBrinquedo: brinquedoObj.ID,
        vlBrinquedo: brinquedoObj.vlLocacao,
        nome: brinquedoObj.nome, // Adicionando o nome para exibição
      }
      setItens([...itens, novoItem])
      setBrinquedoSelecionado("") // Limpar a seleção após adicionar
      setError("")
    }
  }

  const handleRemoveItem = (id) => {
    setItens(itens.filter((item) => item.IDBrinquedo !== id))
  }

  // Validar data de devolução
  const validarDataDevolucao = (data) => {
    if (data !== dataAtual) {
      return "A data de devolução deve ser a mesma data da locação (hoje)"
    }
    return ""
  }

  const handleDataDevolucaoChange = (e) => {
    const novaData = e.target.value
    setDataDevolucao(novaData)

    const erro = validarDataDevolucao(novaData)
    if (erro) {
      setError(erro)
    } else {
      // Limpar apenas o erro de data, mantendo outros erros se existirem
      if (error.includes("data de devolução")) {
        setError("")
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validação de campos obrigatórios
    if (!cpf || !dataDevolucao || itens.length === 0) {
      setError("Preencha todos os campos e selecione pelo menos um brinquedo.")
      return
    }

    // Validar data de devolução
    const erroData = validarDataDevolucao(dataDevolucao)
    if (erroData) {
      setError(erroData)
      return
    }

    // Calcular o valor total da locação
    const vlTotal = itens.reduce((acc, item) => acc + Number.parseFloat(item.vlBrinquedo || 0), 0)

    // Payload no formato correto
    const payload = {
      cpf,
      dataDevolucao,
      brinquedos: itens.map((item) => ({
        IDBrinquedo: item.IDBrinquedo,
        vlBrinquedo: item.vlBrinquedo,
      })),
      vlTotal,
      dataLocacao: new Date().toISOString(),
    }

    try {
      setIsLoading(true)
      if (id) {
        await atualizarLocacao(id, token, payload)
        setMessage("Locação atualizada com sucesso!")
      } else {
        await criarLocacao(token, payload)
        setMessage("Locação criada com sucesso!")
        setCpf("")
        setDataDevolucao(dataAtual)
        setItens([])
        setBrinquedoSelecionado("")
      }

      setError("")
      setTimeout(() => navigate("/locacoes"), 2000)
    } catch (err) {
      setError(err.message || "Erro ao processar locação.")
      setMessage("")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    navigate("/locacoes")
  }

  // Formatar valor monetário
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value || 0)
  }

  // Calcular valor total
  const valorTotal = itens.reduce((total, item) => total + Number.parseFloat(item.vlBrinquedo || 0), 0)

  return (
    <div className="page-container">
      <Menu>
        <div className="content-container">
          <div className="content-header">
            <h2>{id ? "Editar Locação" : "Cadastrar Locação"}</h2>
          </div>

          {isLoading ? (
            <div className="loading-indicator">
              <div className="spinner"></div>
              <p>Carregando dados...</p>
            </div>
          ) : (
            <div className="locacao-container">
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

              <div className="locacao-layout">
                {/* Formulário principal */}
                <div className="locacao-form">
                  <form onSubmit={handleSubmit} className="form">
                    <div className="form-group">
                      <label htmlFor="cpf">Cliente</label>
                      <select
                        id="cpf"
                        name="cpf"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        required
                        className={!cpf ? "empty" : ""}
                      >
                        <option value="">Selecione um Cliente</option>
                        {clientes.map((cliente) => (
                          <option key={cliente.cpf} value={cliente.cpf}>
                            {cliente.nome} - {cliente.cpf}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="dataDevolucao">
                        Data de Devolução
                        <span className="info-badge" title="A devolução deve ser feita no mesmo dia da locação">
                          ℹ️
                        </span>
                      </label>
                      <input
                        type="date"
                        id="dataDevolucao"
                        name="dataDevolucao"
                        value={dataDevolucao}
                        onChange={handleDataDevolucaoChange}
                        min={dataAtual}
                        max={dataAtual}
                        required
                      />
                      <small className="form-hint">
                        Os brinquedos devem ser devolvidos na mesma data da locação (hoje: {dataAtual})
                      </small>
                    </div>

                    <div className="form-group">
                      <label htmlFor="brinquedo">Adicionar Brinquedo</label>
                      <div className="add-brinquedo-row">
                        <select
                          id="brinquedo"
                          value={brinquedoSelecionado}
                          onChange={(e) => setBrinquedoSelecionado(e.target.value)}
                          className={!brinquedoSelecionado ? "empty" : ""}
                        >
                          <option value="">Selecione um brinquedo</option>
                          {brinquedosDisponiveis.map((brinquedo) => (
                            <option key={brinquedo.ID} value={brinquedo.ID}>
                              {brinquedo.nome} - {formatCurrency(brinquedo.vlLocacao)}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          className="button secondary"
                          onClick={handleAddItem}
                          disabled={!brinquedoSelecionado}
                        >
                          Adicionar
                        </button>
                      </div>
                    </div>

                    <div className="form-actions">
                      <button type="button" className="button secondary" onClick={handleCancel}>
                        Cancelar
                      </button>
                      <button type="submit" className="button primary" disabled={isLoading || itens.length === 0}>
                        {id ? "Atualizar" : "Cadastrar"}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Lista de brinquedos selecionados */}
                <div className="brinquedos-selecionados">
                  <div className="brinquedos-header">
                    <h3>Brinquedos Selecionados</h3>
                    <span className="brinquedos-count">{itens.length} item(ns)</span>
                  </div>

                  {itens.length === 0 ? (
                    <div className="empty-list-message">
                      <p>Nenhum brinquedo selecionado</p>
                      <p className="empty-list-hint">Selecione brinquedos no formulário ao lado</p>
                    </div>
                  ) : (
                    <>
                      <div className="brinquedos-list">
                        {itens.map((item) => {
                          const brinquedo = brinquedosDisponiveis.find((b) => b.ID === item.IDBrinquedo) || {}
                          return (
                            <div key={item.IDBrinquedo} className="brinquedo-item">
                              <div className="brinquedo-info">
                                <div className="brinquedo-nome">
                                  {brinquedo.nome || `Brinquedo #${item.IDBrinquedo}`}
                                </div>
                                <div className="brinquedo-valor">{formatCurrency(item.vlBrinquedo)}</div>
                              </div>
                              <button
                                type="button"
                                className="button small danger"
                                onClick={() => handleRemoveItem(item.IDBrinquedo)}
                              >
                                Remover
                              </button>
                            </div>
                          )
                        })}
                      </div>

                      <div className="brinquedos-total">
                        <div className="total-label">Valor Total:</div>
                        <div className="total-value">{formatCurrency(valorTotal)}</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </Menu>
    </div>
  )
}

export default LocacaoForm
