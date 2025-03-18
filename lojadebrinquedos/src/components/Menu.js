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

  // Definição dos menus por cargo
  const menus = {
    gerente: [
      { name: "Gestão de Funcionários", path: "/funcionarios" },
      { name: "Cadastrar Funcionario", path: "/cadastro" },
      { name: "Relatórios", path: "/relatorios" },
    ],
    caixa: [
      { name: "Registrar Venda", path: "/vendas" },
      { name: "Consultar Produtos", path: "/produtos" },
    ],
  };

  if (role === null) {
    return <h1>Carregando menu...</h1>;
  }

  if (!menus[role]) {
    return <h1>Erro: Role não reconhecida !</h1>;
  }

  return (
    <div>
      <h1>Menu</h1>
      <ul>
        {menus[role].map((menu, index) => (
          <li key={index} onClick={() => navigate(menu.path)} style={{ cursor: "pointer" }}>
            {menu.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Menu;
