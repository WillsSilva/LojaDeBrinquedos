// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import FuncionarioList from './components/FuncionarioList';
import FuncionarioForm from './components/FuncionarioForm';

const App = () => {
  const [token, setToken] = useState('');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        
        {/* Verificação de token para proteger as rotas */}
        <Route
          path="/funcionarios"
          element={token ? <FuncionarioList token={token} /> : <Navigate to="/login" />}
        />
        
        <Route
          path="/cadastro"
          element={token ? <FuncionarioForm token={token} /> : <Navigate to="/login" />}
        />
        
        {/* Redirecionando para o login por padrão */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;