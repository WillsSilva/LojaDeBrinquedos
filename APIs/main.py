from fastapi import FastAPI, Depends, HTTPException
from pymongo import MongoClient
from datetime import datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel
from auth import get_current_user, create_access_token, authenticate_user, hash_password
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId

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
        
class FuncionarioUpdate(BaseModel):
    cpf: Optional[str] = None
    nome: Optional[str] = None
    telefone: Optional[str] = None
    role: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None   

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

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user["role"]
    }

# Rota protegida: Apenas gerentes podem cadastrar funcionários
@app.post("/funcionarios/")
def criar_funcionario(funcionario: Funcionario, user: dict = Depends(get_current_user)):
    if user["role"] != "gerente":
        raise HTTPException(status_code=403, detail="Apenas gerentes podem cadastrar funcionários")

    # Verificar se já existe um usuário com o mesmo username
    if db.funcionarios.find_one({"username": funcionario.username}):
        raise HTTPException(status_code=400, detail="Nome de usuário já está em uso")

    funcionario_dict = funcionario.dict()
    funcionario_dict["password"] = hash_password(funcionario.password)

    db.funcionarios.insert_one(funcionario_dict)
    return {"mensagem": "Funcionário criado com sucesso"}


@app.put("/funcionarios/{id}")
def atualizar_funcionario(id: str, funcionario: FuncionarioUpdate, user: dict = Depends(get_current_user)):
    
    if user["role"] != "gerente":
        raise HTTPException(status_code=403, detail="Apenas gerentes podem atualizar funcionários")

    # Verificar se o funcionário existe no banco de dados
    existing_funcionario = db.funcionarios.find_one({"username": id})
    if not existing_funcionario:
        raise HTTPException(status_code=404, detail="Funcionário não encontrado")

    if funcionario.username:
        username_exists = db.funcionarios.find_one({"username": funcionario.username})
        if username_exists and username_exists["_id"] != existing_funcionario["_id"]:
            raise HTTPException(status_code=400, detail="Nome de usuário já está em uso")

    update_data = {key: value for key, value in funcionario.dict(exclude_unset=True).items()}

    # Se a senha for fornecida, deve ser alterada e hashada
    if 'password' in update_data:
        update_data["password"] = hash_password(update_data["password"])

    db.funcionarios.update_one({"username": id}, {"$set": update_data})

    return {"message": "Funcionário atualizado com sucesso", "funcionario": update_data}


@app.delete("/funcionarios/{id}")
def deletar_funcionario(id: str, user: dict = Depends(get_current_user)):

    if user.get("role") != "gerente":
        raise HTTPException(status_code=403, detail="Apenas gerentes podem excluir funcionários")

    funcionario = db.funcionarios.find_one({"username": id})
    if not funcionario:
        raise HTTPException(status_code=404, detail="Funcionário não encontrado")

    # Exclui o funcionário
    db.funcionarios.delete_one({"username": id})
    return {"mensagem": "Funcionário deletado com sucesso"}

# Endpoint para listar funcionários (apenas para usuários autenticados)
@app.get("/funcionarios/", response_model=List[FuncionarioResponse])
def listar_funcionarios(user: dict = Depends(get_current_user)):
    funcionarios = list(db.funcionarios.find({}, {"_id": 1, "cpf": 1, "nome": 1, "telefone": 1, "role": 1, "username": 1}))  # Inclui '_id'
    
    # Remover o campo 'password' explicitamente
    for funcionario in funcionarios:
        funcionario.pop("password", None)
        funcionario['id'] = str(funcionario['_id'])
        del funcionario['_id']
    
    return funcionarios

@app.get("/funcionarios/{id}")
def obter_funcionario(id: str, user: dict = Depends(get_current_user)):  
    funcionario = db.funcionarios.find_one({"username": id}, {"_id": 0, "password": 0})  
    if not funcionario:
        raise HTTPException(status_code=404, detail="Funcionário não encontrado")
    return funcionario

# Testando a autenticação em uma rota protegida
@app.get("/me")
def get_me(user: dict = Depends(get_current_user)):
    return {"user": user}
