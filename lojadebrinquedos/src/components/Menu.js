import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const userRole = localStorage.getItem("role");

    if (userRole) {
      setRole(userRole);
    } else {
      console.warn("Nenhuma role encontrada! Definindo como 'caixa' por padrão.");
      setRole("caixa");
    }
  }, []);

  // Função de logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // Definição dos menus por cargo
  const menus = {
    gerente: [
      { name: "Gestão de Funcionários", path: "/funcionarios" },
      { name: "Cadastrar Funcionario", path: "/cadastro/funcionario" },
    ],
    Almoxarife: [
      { name: "Lista de brinquedos", path: "/brinquedos" },
      { name: "Tipos de brinquedos", path: "/tipos" },
      { name: "Cadastrar brinquedos", path: "/produtos" },
      { name: "Cadastrar tipos de brinquedos", path: "/cadastro/tipo" },
    ],
    AnalistadeCadastro: [
      { name: "Lista de clientes", path: "/vendas" },
      { name: "Cadastrar clientes", path: "/vendas" },
    ],
    AgenteDeLocacao: [
      { name: "Lista de locações", path: "/vendas" },
      { name: "Cadastrar locações", path: "/vendas" },
    ],
    Caixa: [
      { name: "Vendas", path: "/vendas" },
    ],
  };

  if (role === null) {
    return <h1>Carregando menu...</h1>;
  }

  if (!menus[role]) {
    return <h1>Erro: Role não reconhecida !</h1>;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div style={{
        width: "250px",
        background: "#2c3e50",
        color: "white",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
      }}>
        <h3>Menu </h3>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {menus[role].map((menu, index) => (
            <li
              key={index}
              onClick={() => navigate(menu.path)}
              style={{
                cursor: "pointer",
                padding: "10px",
                marginBottom: "10px",
                background: "#34495e",
                borderRadius: "5px",
                color: "white",
              }}
            >
              {menu.name}
            </li>
          ))}
        </ul>
        <button
          onClick={handleLogout}
          style={{
            marginTop: "20px",
            backgroundColor: "#e74c3c",
            color: "white",
            padding: "10px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* Main content */}
      <div style={{ flexGrow: 1, padding: "20px" }}>
        {/* Este é o conteúdo da página que será renderizado ao lado do menu */}
      </div>
    </div>
  );
};

export default Menu;
