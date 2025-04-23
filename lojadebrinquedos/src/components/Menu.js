"use client"

import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import "../css/Menu.css"

const Menu = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [role, setRole] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const menuLoaded = sessionStorage.getItem("menuLoaded")

    if (menuLoaded) {
      const userRole = localStorage.getItem("role")
      if (userRole) {
        setRole(userRole)
      } else {
        console.warn("Nenhuma role encontrada! Definindo como 'caixa' por padrão.")
        setRole("caixa")
      }
      setIsLoading(false)
    } else {
      const timer = setTimeout(() => {
        const userRole = localStorage.getItem("role")
        if (userRole) {
          setRole(userRole)
        } else {
          console.warn("Nenhuma role encontrada! Definindo como 'caixa' por padrão.")
          setRole("caixa")
        }

        sessionStorage.setItem("menuLoaded", "true")
        setIsLoading(false)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [])

  // Função de logout
  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")

    sessionStorage.removeItem("menuLoaded")
    navigate("/login")
  }

  // Definição dos menus por cargo com ícones
  const menus = {
    gerente: [
      { name: "Gestão de Funcionários", path: "/funcionarios", icon: "👥" },
      { name: "Cadastrar Funcionario", path: "/cadastro/funcionario", icon: "➕" },
    ],
    Almoxarife: [
      { name: "Lista de brinquedos", path: "/brinquedos", icon: "🧸" },
      { name: "Tipos de brinquedos", path: "/tipos", icon: "🏷️" },
      { name: "Cadastrar brinquedos", path: "/cadastro/brinquedo", icon: "➕" },
      { name: "Cadastrar tipos de brinquedos", path: "/cadastro/tipo", icon: "🔖" },
    ],
    AnalistadeCadastro: [
      { name: "Lista de clientes", path: "/clientes", icon: "👥" },
      { name: "Cadastrar clientes", path: "/cadastrar-cliente", icon: "➕" },
    ],
    AgenteDeLocacao: [
      { name: "Lista de locações", path: "/locacoes", icon: "📋" },
      { name: "Cadastrar locações", path: "/cadastrar-locacao", icon: "➕" },
    ],
    Caixa: [
      { name: "Pagamentos", path: "/pagamentos", icon: "💳" },
      { name: "Cadastrar pagamentos", path: "/cadastrar-pagamento", icon: "➕" },],
    admin: [
      { name: "Gestão de Funcionários", path: "/funcionarios", icon: "👥" },
      { name: "Cadastrar Funcionario", path: "/cadastro/funcionario", icon: "➕" },
      { name: "Lista de brinquedos", path: "/brinquedos", icon: "🧸" },
      { name: "Tipos de brinquedos", path: "/tipos", icon: "🏷️" },
      { name: "Cadastrar brinquedos", path: "/cadastro/brinquedo", icon: "➕" },
      { name: "Cadastrar tipos de brinquedos", path: "/cadastro/tipo", icon: "🔖" },
      { name: "Lista de clientes", path: "/clientes", icon: "👥" },
      { name: "Cadastrar clientes", path: "/cadastrar-cliente", icon: "➕" },
      { name: "Lista de locações", path: "/locacoes", icon: "📋" },
      { name: "Cadastrar locações", path: "/cadastrar-locacao", icon: "➕" },
      { name: "Pagamentos", path: "/pagamentos", icon: "💳" },
      { name: "Cadastrar pagamentos", path: "/cadastrar-pagamento", icon: "➕" },],      
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando menu...</p>
      </div>
    )
  }

  if (!menus[role]) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h2>Erro: Role não reconhecida!</h2>
        <p>A função "{role}" não possui permissões configuradas no sistema.</p>
        <button className="error-button" onClick={handleLogout}>
          Voltar para o Login
        </button>
      </div>
    )
  }

  // Verifica se estamos na página inicial (menu)
  const isHomePage = location.pathname === "/menu"

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h3 className="sidebar-title">Painel de Controle</h3>
          <div className="user-role">
            <span className="role-badge">{role}</span>
          </div>
        </div>

        <div className="sidebar-menu">
          <h4 className="menu-category">Menu Principal</h4>
          <ul className="menu-list">
            {menus[role].map((menu, index) => (
              <li
                key={index}
                className={`menu-item ${location.pathname === menu.path ? "active" : ""}`}
                onClick={() => navigate(menu.path)}
              >
                <span className="menu-icon">{menu.icon}</span>
                <span className="menu-text">{menu.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="sidebar-footer">
          <button className="logout-button" onClick={handleLogout}>
            <span className="logout-icon">🚪</span>
            <span>Sair do Sistema</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="main-content">
        {isHomePage ? (
          // Conteúdo de boas-vindas apenas na página inicial
          <>
            <div className="content-header">
              <h2>Bem-vindo ao Sistema</h2>
              <p>Selecione uma opção no menu para começar</p>
            </div>

            <div className="content-body">
              <div className="welcome-card">
                <div className="welcome-icon">👋</div>
                <h3>Olá, {role}!</h3>
                <p>Utilize o menu lateral para navegar entre as funcionalidades disponíveis para o seu perfil.</p>
              </div>
            </div>
          </>
        ) : (
          // Nas outras páginas, renderiza o conteúdo específico da rota
          children || <div className="content-placeholder"></div>
        )}
      </div>
    </div>
  )
}

export default Menu
