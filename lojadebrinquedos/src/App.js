import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Menu from "./components/Menu";
import FuncionarioList from "./components/FuncionarioList";
import FuncionarioForm from "./components/FuncionarioForm";
import BrinquedosList from "./components/BrinquedosList";
import TipoBrinquedoForm from "./components/TipoBrinquedosForm";
import TipoBrinquedoList from "./components/TipoBrinquedosList";
import BrinquedoForm from "./components/BrinquedoForm";
import ClientesList from "./components/ClientesList";
import ClienteForm from "./components/ClienteForm";


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
        <Route path="/cadastro/funcionario" element={token ? <FuncionarioForm token={token} /> : <Navigate to="/login" />} />
        <Route path="/editar/:id" element={token ? <FuncionarioForm token={token} /> : <Navigate to="/login" />} />
        <Route path="/brinquedos" element={token ? <BrinquedosList token={token} /> : <Navigate to="/login" />} />
        <Route path="/cadastro/tipo" element={token ? <TipoBrinquedoForm token={token} /> : <Navigate to="/login" />} />
        <Route path="/editar-tipo-brinquedo/:id" element={token ? <TipoBrinquedoForm token={token} /> : <Navigate to="/login" />} />
        <Route path="/tipos" element={token ? <TipoBrinquedoList token={token} /> : <Navigate to="/login" />} />
        <Route path="/cadastro/brinquedo" element={token ? <BrinquedoForm token={token} /> : <Navigate to="/login" />} />
        <Route path="/editar-brinquedo/:id" element={token ? <BrinquedoForm token={token} /> : <Navigate to="/login" />} />
        <Route path="/clientes" element={token ? <ClientesList token={token} /> : <Navigate to="/login" />} />
        <Route path="/cadastrar-cliente" element={token ? <ClienteForm token={token} /> : <Navigate to="/login" />} />
        <Route path="/cadastrar-cliente/:id" element={token ? <ClienteForm token={token} /> : <Navigate to="/login" />} />        
        
        {/* Redirecionando para o login por padrão */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
