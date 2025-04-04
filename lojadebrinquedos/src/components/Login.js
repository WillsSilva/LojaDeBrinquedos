import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../API/APIFuncionarios";

const Login = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const data = await login(username, password);
      
      localStorage.setItem("role", data.role);
      localStorage.setItem("token", data.access_token);
      
      setToken(data.access_token);
      navigate('/menu');
    } catch (err) {
      setError(err.message);
      console.log("Erro no login:", err);
    }
  };
  

  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Nome de usuário"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={handleLogin}>Entrar</button>
    </div>
  );
};

export default Login;
