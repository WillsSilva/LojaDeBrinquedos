import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Menu from "./components/Menu";
import FuncionarioList from "./components/FuncionarioList";
import FuncionarioForm from "./components/FuncionarioForm";

const App = () => {
  // Recupera o token armazenado no localStorage, se existir
  const storedToken = localStorage.getItem("token");

  const [token, setToken] = useState(storedToken || ""); 

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token); // Armazena o token no localStorage
    }
  }, [token]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        
        {/* Proteção de rotas - só acessa se estiver logado */}
        <Route path="/menu" element={token ? <Menu /> : <Navigate to="/login" />} />
        <Route path="/funcionarios" element={token ? <FuncionarioList token={token} /> : <Navigate to="/login" />} />
        <Route path="/cadastro" element={token ? <FuncionarioForm token={token} /> : <Navigate to="/login" />} />
        <Route path="/editar/:id" element={token ? <FuncionarioForm token={token} /> : <Navigate to="/login" />} />
        
        {/* Redirecionando para o login por padrão */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
