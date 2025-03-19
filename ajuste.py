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


# Funções Almoxarife
class Brinquedo(BaseModel):
    codigoUnico: Optional[int]
    nome: str
    tipoBrinquedo: int
    marca: str
    dataAquisicao: datetime
    vlLocacao: float

class TipoBrinquedo(BaseModel):
    codigoUnico: Optional[int]
    nome: str
    
# Rota para criar um novo tipo de brinquedo (apenas almoxarifes)
@app.post("/tipos_brinquedos/")
def criar_tipo_brinquedo(tipo: TipoBrinquedo, user: dict = Depends(get_current_user)):
    if user["role"] != "almoxarife":
        raise HTTPException(status_code=403, detail="Apenas almoxarifes podem cadastrar tipos de brinquedos")

    # Verificar se o nome do tipo já existe
    if db.tipos_brinquedos.find_one({"nome": tipo.nome}):
        raise HTTPException(status_code=400, detail="Esse tipo de brinquedo já existe")

    tipo_dict = tipo.dict()
    db.tipos_brinquedos.insert_one(tipo_dict)
    
    return {"mensagem": "Tipo de brinquedo cadastrado com sucesso!"}


# Rota para atualizar um tipo de brinquedo (apenas almoxarifes)
@app.put("/tipos_brinquedos/{id}")
def atualizar_tipo_brinquedo(id: str, tipo: TipoBrinquedo, user: dict = Depends(get_current_user)):
    if user["role"] != "almoxarife":
        raise HTTPException(status_code=403, detail="Apenas almoxarifes podem atualizar tipos de brinquedos")

    existing_tipo = db.tipos_brinquedos.find_one({"codigoUnico": int(id)})
    if not existing_tipo:
        raise HTTPException(status_code=404, detail="Tipo de brinquedo não encontrado")

    db.tipos_brinquedos.update_one({"codigoUnico": int(id)}, {"$set": tipo.dict()})
    
    return {"mensagem": "Tipo de brinquedo atualizado com sucesso!"}


# Rota para criar um brinquedo (apenas almoxarifes)
@app.post("/brinquedos/")
def criar_brinquedo(brinquedo: Brinquedo, user: dict = Depends(get_current_user)):
    if user["role"] != "almoxarife":
        raise HTTPException(status_code=403, detail="Apenas almoxarifes podem cadastrar brinquedos")

    # Verificar se o brinquedo já existe pelo código único
    if db.brinquedos.find_one({"codigoUnico": brinquedo.codigoUnico}):
        raise HTTPException(status_code=400, detail="Já existe um brinquedo com esse código único")

    brinquedo_dict = brinquedo.dict()
    db.brinquedos.insert_one(brinquedo_dict)
    
    return {"mensagem": "Brinquedo cadastrado com sucesso!"}


# Rota para atualizar um brinquedo (apenas almoxarifes)
@app.put("/brinquedos/{id}")
def atualizar_brinquedo(id: str, brinquedo: Brinquedo, user: dict = Depends(get_current_user)):
    if user["role"] != "almoxarife":
        raise HTTPException(status_code=403, detail="Apenas almoxarifes podem atualizar brinquedos")

    existing_brinquedo = db.brinquedos.find_one({"codigoUnico": int(id)})
    if not existing_brinquedo:
        raise HTTPException(status_code=404, detail="Brinquedo não encontrado")

    db.brinquedos.update_one({"codigoUnico": int(id)}, {"$set": brinquedo.dict()})
    
    return {"mensagem": "Brinquedo atualizado com sucesso!"}

@app.get("/brinquedos/", response_model=List[Brinquedo])
def listar_brinquedos(user: dict = Depends(get_current_user)):
    brinquedos = list(db.brinquedos.find({}, {"_id": 0}))  # Não retorna o _id
    return brinquedos

@app.get("/brinquedos/{id}", response_model=Brinquedo)
def obter_brinquedo(id: str, user: dict = Depends(get_current_user)):
    brinquedo = db.brinquedos.find_one({"codigoUnico": int(id)}, {"_id": 0})  # Não retorna o _id
    if not brinquedo:
        raise HTTPException(status_code=404, detail="Brinquedo não encontrado")
    return brinquedo

@app.get("/tipos_brinquedos/", response_model=List[TipoBrinquedo])
def listar_tipos_brinquedos(user: dict = Depends(get_current_user)):
    tipos = list(db.tipos_brinquedos.find({}, {"_id": 0}))  # Remove o _id
    return tipos