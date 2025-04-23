"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { listarLocacoes, obterLocacaoPorId } from "../API/APILocacoes"
import { criarPagamento, listarPagamentos } from "../API/APIPagamento"
import Menu from "./Menu"
import "../css/Form.css"
import "../css/PagamentoForm.css"

const PagamentoForm = ({ token }) => {
  const [locacoes, setLocacoes] = useState([])
  const [pagamentos, setPagamentos] = useState([])
  const [locacaoSelecionada, setLocacaoSelecionada] = useState("")
  const [vlPago, setVlPago] = useState("")
  const [vlLocacao, setVlLocacao] = useState(0)
  const [troco, setTroco] = useState(0)
  const [mensagem, setMensagem] = useState("")
  const [erro, setErro] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [detalhesLocacao, setDetalhesLocacao] = useState(null)
  const navigate = useNavigate()

  // Carregar locações não pagas e pagamentos
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [locs, pays] = await Promise.all([
          listarLocacoes(token),
          listarPagamentos(token)
        ])

        // IDs das locações já pagas
        const locacoesPagasIDs = pays.map(p => p.IDLocacao)

        // Filtra apenas as locações que ainda não foram pagas
        const locacoesNaoPagas = locs.filter(loc => !locacoesPagasIDs.includes(loc.ID))

        setLocacoes(locacoesNaoPagas)
        setPagamentos(pays)
        setErro("")
      } catch (err) {
        setErro("Erro ao carregar locações e pagamentos: " + (err.message || "Erro desconhecido"))
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [token])

  useEffect(() => {
    const valorPago = Number.parseFloat(vlPago) || 0
    const valorTroco = valorPago - vlLocacao
    setTroco(valorTroco > 0 ? valorTroco : 0)
  }, [vlPago, vlLocacao])

  const handleLocacaoChange = async (e) => {
    const id = e.target.value
    setLocacaoSelecionada(id)
    setDetalhesLocacao(null)

    if (id) {
      setIsLoading(true)
      try {
        const dadosLocacaoArray = await obterLocacaoPorId(id, token)
        const dadosLocacao = dadosLocacaoArray[0]
        const valorTotal = Number.parseFloat(dadosLocacao.vlTotal) || 0
        setVlLocacao(valorTotal)
        setDetalhesLocacao(dadosLocacao)
        setErro("")
      } catch (err) {
        console.error("Erro ao obter dados da locação:", err)
        setErro("Erro ao obter dados da locação")
        setVlLocacao(0)
      } finally {
        setIsLoading(false)
      }
    } else {
      setVlLocacao(0)
    }
  }

  const formatarData = (dataString) => {
    if (!dataString) return "Data não disponível"
    try {
      const data = new Date(dataString)
      return data.toLocaleDateString("pt-BR")
    } catch (e) {
      return "Data inválida"
    }
  }

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor || 0)
  }

  const handleVlPagoChange = (e) => {
    setVlPago(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!locacaoSelecionada) {
      setErro("Selecione uma locação.")
      return
    }

    if (!vlPago || Number.parseFloat(vlPago) <= 0) {
      setErro("Informe um valor pago válido.")
      return
    }

    if (Number.parseFloat(vlPago) < vlLocacao) {
      setErro("O valor pago não pode ser menor que o valor da locação.")
      return
    }

    setIsLoading(true)
    try {
      await criarPagamento(token, {
        IDLocacao: Number.parseInt(locacaoSelecionada),
        vlLocacao: Number.parseFloat(vlLocacao),
        vlPago: Number.parseFloat(vlPago),
      })

      setMensagem("Pagamento registrado com sucesso!")
      setErro("")
      setTimeout(() => navigate("/pagamentos"), 2000)
    } catch (err) {
      setErro(err.message || "Erro ao registrar pagamento.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="page-container">
      <Menu>
        <div className="content-container">
          <div className="content-header">
            <h2>Registrar Pagamento</h2>
          </div>

          {isLoading && (
            <div className="loading-indicator">
              <div className="spinner"></div>
              <p>Carregando dados...</p>
            </div>
          )}

          <div className="pagamento-container">
            {erro && (
              <div className="message error">
                <span className="message-icon">⚠️</span>
                <span>{erro}</span>
              </div>
            )}

            {mensagem && (
              <div className="message success">
                <span className="message-icon">✅</span>
                <span>{mensagem}</span>
              </div>
            )}

            <div className="pagamento-layout">
              <div className="pagamento-form">
                <form className="form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="locacao">Locação</label>
                    <select
                      id="locacao"
                      value={locacaoSelecionada}
                      onChange={handleLocacaoChange}
                      required
                      disabled={isLoading}
                      className={!locacaoSelecionada ? "empty" : ""}
                    >
                      <option value="">Selecione uma locação</option>
                      {locacoes.map((loc) => (
                        <option key={loc.ID} value={loc.ID}>
                          Locação #{loc.ID} - {formatarData(loc.dataLocacao)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="vlLocacao">Valor da Locação</label>
                    <div className="input-with-prefix">
                      <span className="input-prefix">R$</span>
                      <input
                        type="text"
                        value={vlLocacao.toFixed(2).replace(".", ",")}
                        readOnly
                        id="vlLocacao"
                        className="with-prefix"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="vlPago">Valor Pago</label>
                    <div className="input-with-prefix">
                      <span className="input-prefix">R$</span>
                      <input
                        type="number"
                        step="0.01"
                        id="vlPago"
                        value={vlPago}
                        onChange={handleVlPagoChange}
                        required
                        min={vlLocacao}
                        className="with-prefix"
                        disabled={!locacaoSelecionada || isLoading}
                      />
                    </div>
                  </div>

                  <div className="form-group troco-group">
                    <label htmlFor="troco">Troco</label>
                    <div className="input-with-prefix">
                      <span className="input-prefix">R$</span>
                      <input
                        type="text"
                        id="troco"
                        value={troco.toFixed(2).replace(".", ",")}
                        readOnly
                        className={`with-prefix ${troco > 0 ? "has-troco" : ""}`}
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="button secondary"
                      onClick={() => navigate("/pagamentos")}
                      disabled={isLoading}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="button primary"
                      disabled={!locacaoSelecionada || !vlPago || Number.parseFloat(vlPago) < vlLocacao || isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-small"></span>
                          <span>Processando...</span>
                        </>
                      ) : (
                        "Registrar Pagamento"
                      )}
                    </button>
                  </div>
                </form>
              </div>

              <div className="pagamento-detalhes">
                <div className="detalhes-header">
                  <h3>Detalhes da Locação</h3>
                </div>

                {!locacaoSelecionada ? (
                  <div className="empty-details-message">
                    <p>Selecione uma locação para ver os detalhes</p>
                  </div>
                ) : isLoading ? (
                  <div className="loading-details">
                    <div className="spinner"></div>
                    <p>Carregando detalhes...</p>
                  </div>
                ) : detalhesLocacao ? (
                  <div className="detalhes-content">
                    <div className="detalhe-item">
                      <span className="detalhe-label">Número da Locação:</span>
                      <span className="detalhe-valor">#{detalhesLocacao.ID}</span>
                    </div>

                    <div className="detalhe-item">
                      <span className="detalhe-label">Data da Locação:</span>
                      <span className="detalhe-valor">{formatarData(detalhesLocacao.dataLocacao)}</span>
                    </div>

                    <div className="detalhe-item">
                      <span className="detalhe-label">Data de Devolução:</span>
                      <span className="detalhe-valor">{formatarData(detalhesLocacao.dataDevolucao)}</span>
                    </div>

                    <div className="detalhe-item">
                      <span className="detalhe-label">Cliente:</span>
                      <span className="detalhe-valor">{detalhesLocacao.nomeCliente || "Não informado"}</span>
                    </div>

                    <div className="detalhe-item valor-total">
                      <span className="detalhe-label">Valor Total:</span>
                      <span className="detalhe-valor">{formatarMoeda(detalhesLocacao.vlTotal)}</span>
                    </div>

                    {detalhesLocacao.brinquedos && detalhesLocacao.brinquedos.length > 0 && (
                      <div className="brinquedos-section">
                        <h4>Brinquedos ({detalhesLocacao.brinquedos.length})</h4>
                        <ul className="brinquedos-lista">
                          {detalhesLocacao.brinquedos.map((brinquedo, index) => (
                            <li key={index} className="brinquedo-item-detalhe">
                              <span>Brinquedo #{brinquedo.IDBrinquedo}</span>
                              <span>{formatarMoeda(brinquedo.vlBrinquedo)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="empty-details-message">
                    <p>Não foi possível carregar os detalhes da locação</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Menu>
    </div>
  )
}

export default PagamentoForm
