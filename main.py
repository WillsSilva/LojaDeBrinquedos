from fastapi import FastAPI, Depends, HTTPException
from pymongo import MongoClient
from datetime import datetime, timedelta
from typing import List
from pydantic import BaseModel
from auth import get_current_user, create_access_token, authenticate_user
from fastapi.security import OAuth2PasswordRequestForm

app = FastAPI()

# Conectar ao MongoDB
client = MongoClient("mongodb://localhost:27017")
db = client["locacao_brinquedos"]

# Modelos Pydantic
class Funcionario(BaseModel):
    cpf: str
    nome: str
    telefone: str
    funcao: str

# Endpoint para login e geração de token
@app.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Usuário ou senha incorretos")

    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(data={"sub": user["username"], "role": user["role"]}, expires_delta=access_token_expires)

    return {"access_token": access_token, "token_type": "bearer"}

# Rota protegida: Apenas gerentes podem cadastrar funcionários
@app.post("/funcionarios/")
def criar_funcionario(funcionario: Funcionario, user: dict = Depends(get_current_user)):
    if user["role"] != "gerente":
        raise HTTPException(status_code=403, detail="Apenas gerentes podem cadastrar funcionários")

    db.funcionarios.insert_one(funcionario.dict())
    return {"mensagem": "Funcionário criado com sucesso"}

# Endpoint para listar funcionários (apenas para usuários autenticados)
@app.get("/funcionarios/", response_model=List[Funcionario])
def listar_funcionarios(user: dict = Depends(get_current_user)):
    funcionarios = list(db.funcionarios.find({}, {"_id": 0}))  # Remove o campo _id
    return funcionarios

# Testando a autenticação em uma rota protegida
@app.get("/me")
def get_me(user: dict = Depends(get_current_user)):
    return {"user": user}
