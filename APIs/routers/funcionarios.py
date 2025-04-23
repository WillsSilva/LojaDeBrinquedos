from fastapi import APIRouter, Depends, HTTPException
from core.database import db
from core.auth import get_current_user, hash_password
from models.schemas import Funcionario, FuncionarioUpdate , FuncionarioResponse
from typing import List

router = APIRouter()

# Rota protegida: Apenas gerentes podem cadastrar funcionários
@router.post("/")
def criar_funcionario(funcionario: Funcionario, user: dict = Depends(get_current_user)):
    if user["role"] not in ["gerente", "admin"]:
        raise HTTPException(status_code=403, detail="Apenas gerentes podem cadastrar funcionários")

    # Verificar se já existe um usuário com o mesmo username
    if db.funcionarios.find_one({"username": funcionario.username}):
        raise HTTPException(status_code=400, detail="Nome de usuário já está em uso")

    funcionario_dict = funcionario.dict()
    funcionario_dict["password"] = hash_password(funcionario.password)

    db.funcionarios.insert_one(funcionario_dict)
    return {"mensagem": "Funcionário criado com sucesso"}


@router.put("/{id}")
def atualizar_funcionario(id: str, funcionario: FuncionarioUpdate, user: dict = Depends(get_current_user)):
    
    if user["role"] not in ["gerente", "admin"]:
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


@router.delete("/{id}")
def deletar_funcionario(id: str, user: dict = Depends(get_current_user)):

    if user["role"] not in ["gerente", "admin"]:
        raise HTTPException(status_code=403, detail="Apenas gerentes podem excluir funcionários")

    funcionario = db.funcionarios.find_one({"username": id})
    if not funcionario:
        raise HTTPException(status_code=404, detail="Funcionário não encontrado")

    db.funcionarios.delete_one({"username": id})
    return {"mensagem": "Funcionário deletado com sucesso"}

# Endpoint para listar funcionários (apenas para usuários autenticados)
@router.get("/", response_model=List[FuncionarioResponse])
def listar_funcionarios(user: dict = Depends(get_current_user)):
    funcionarios = list(db.funcionarios.find({}, {"_id": 1, "cpf": 1, "nome": 1, "telefone": 1, "role": 1, "username": 1}))  # Inclui '_id'
    
    # Remover o campo 'password' explicitamente
    for funcionario in funcionarios:
        funcionario.pop("password", None)
        funcionario['id'] = str(funcionario['_id'])
        del funcionario['_id']
    
    return funcionarios

@router.get("/{id}")
def obter_funcionario(id: str, user: dict = Depends(get_current_user)):  
    funcionario = db.funcionarios.find_one({"username": id}, {"_id": 0, "password": 0})  
    if not funcionario:
        raise HTTPException(status_code=404, detail="Funcionário não encontrado")
    return funcionario