# Loja de Brinquedos - Sistema de Gestão de Funcionários e Vendas

Este é um projeto de um sistema de gestão para uma loja de brinquedos, onde é possível cadastrar e gerenciar funcionários, realizar vendas e acessar relatórios, com diferentes níveis de acesso (Gerente e Caixa).

## Tecnologias Utilizadas

- **Backend**: FastAPI (Python)
- **Frontend**: React.js
- **Banco de Dados**: MongoDB (pode ser alterado para outro banco de dados conforme necessidade)
- **Autenticação**: JWT (JSON Web Tokens)
- **Gerenciamento de Pacotes**: pip (Backend) / npm (Frontend)

## Estrutura do Projeto

O projeto é dividido em duas partes principais:
1. **Backend** (FastAPI)
2. **Frontend** (React.js)

### Backend

O backend é responsável por fornecer a API, incluindo endpoints para login, gerenciamento de funcionários, e operações de vendas.

### Frontend

O frontend é responsável pela interface de usuário, permitindo aos funcionários interagirem com o sistema, fazendo login, acessando o menu e interagindo com as funcionalidades.

---

## Como Rodar o Projeto

### 1. **Pré-requisitos**

- Python 3.x
- Node.js e npm
- Banco de Dados (MongoDB ou outro, dependendo da configuração)

### 2. **Passos para Rodar o Backend (FastAPI)**

python -m venv venv
source venv/bin/activate  # No Linux/Mac
venv\Scripts\activate  # No Windows
pip install -r APIs/requirements.txt

Comando para rodar as APIS: uvicorn main:app --reload

FRONT:
cd lojadebrinquedos
npm install
npm start

❗ Para começar cadastre um usuario com a role de gerente no seu banco de dados.


