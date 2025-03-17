import React from 'react';
import ReactDOM from 'react-dom/client';  // Altere a importação
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root')); // Cria a raiz
root.render(  // Use a função render para renderizar o componente
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
