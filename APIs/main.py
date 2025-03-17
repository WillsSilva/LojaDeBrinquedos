from fastapi import FastAPI, Depends, HTTPException
from pymongo import MongoClient
from datetime import datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel
from auth import get_current_user, create_access_token, authenticate_user, hash_password
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Conectar ao MongoDB
client = MongoClient("mongodb://localhost:27017")
db = client["locacao_brinquedos"]

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos Pydantic
class Funcionario(BaseModel):
    cpf: str
    nome: str
    telefone: str
    role: str
    username: str
    password: str
    
class FuncionarioResponse(BaseModel):
    username: str
    role: str
    cpf: str
    nome: str
    telefone: str

    class Config:
        orm_mode = True    

# Endpoint para login e geração de token
@app.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Usuário ou senha incorretos")

    access_token_expires = timedelta(minutes=60)
    access_token = create_access_token(
        data={"sub": user["username"], "role": user["role"]}, 
        expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}


# Rota protegida: Apenas gerentes podem cadastrar funcionários
@app.post("/funcionarios/")
def criar_funcionario(funcionario: Funcionario, user: dict = Depends(get_current_user)):
    if user["role"] != "gerente":
        raise HTTPException(status_code=403, detail="Apenas gerentes podem cadastrar funcionários")

    # Verificar se já existe um usuário com o mesmo username
    if db.funcionarios.find_one({"username": funcionario.username}):
        raise HTTPException(status_code=400, detail="Nome de usuário já está em uso")

    # Hash da senha antes de armazenar
    funcionario_dict = funcionario.dict()
    funcionario_dict["password"] = hash_password(funcionario.password)

    db.funcionarios.insert_one(funcionario_dict)
    return {"mensagem": "Funcionário criado com sucesso"}

# Endpoint para listar funcionários (apenas para usuários autenticados)
@app.get("/funcionarios/", response_model=List[FuncionarioResponse])
def listar_funcionarios(user: dict = Depends(get_current_user)):
    funcionarios = list(db.funcionarios.find({}, {"_id": 0}))  # Remove o campo '_id'
    
    # Remover o campo 'password' explicitamente
    for funcionario in funcionarios:
        funcionario.pop("password", None)
    
    return funcionarios

# Testando a autenticação em uma rota protegida
@app.get("/me")
def get_me(user: dict = Depends(get_current_user)):
    return {"user": user}
