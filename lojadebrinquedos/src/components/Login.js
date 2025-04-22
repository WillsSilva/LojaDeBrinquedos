"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { login } from "../API/APIFuncionarios"
import "../css/Login.css"

const Login = ({ setToken }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Por favor, preencha todos os campos")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const data = await login(username, password)

      localStorage.setItem("role", data.role)
      localStorage.setItem("token", data.access_token)

      setToken(data.access_token)
      navigate("/menu")
    } catch (err) {
      setError(err.message || "Falha na autenticação. Verifique suas credenciais.")
      console.log("Erro no login:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin()
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2 className="login-title">Acesso ao Sistema</h2>
          <p className="login-subtitle">Entre com suas credenciais para acessar o sistema</p>
        </div>

        <div className="login-form">
          <div className="form-group">
            <label htmlFor="username">Nome de usuário</label>
            <div className="input-container">
              <input
                id="username"
                type="text"
                placeholder="Digite seu nome de usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <div className="input-container">
              <input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
          </div>

          {error && (
            <div className="error-alert">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <button className={`login-button ${isLoading ? "loading" : ""}`} onClick={handleLogin} disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner"></span>
                <span>Entrando...</span>
              </>
            ) : (
              <>
                <span>Entrar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
