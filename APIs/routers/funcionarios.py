from fastapi import APIRouter, Depends, HTTPException
from core.database import db
from core.auth import get_current_user, hash_password
from models.schemas import Funcionario, FuncionarioUpdate
from typing import List

router = APIRouter()

@router.post("/")
def criar_funcionario(funcionario: Funcionario, user: dict = Depends(get_current_user)):
    if user["role"] != "gerente":
        raise HTTPException(status_code=403, detail="Apenas gerentes podem cadastrar funcionários")

    if db.funcionarios.find_one({"username": funcionario.username}):
        raise HTTPException(status_code=400, detail="Nome de usuário já está em uso")

    funcionario_dict = funcionario.dict()
    funcionario_dict["password"] = hash_password(funcionario.password)

    db.funcionarios.insert_one(funcionario_dict)
    return {"mensagem": "Funcionário criado com sucesso"}

@router.get("/", response_model=List[FuncionarioUpdate])
def listar_funcionarios(user: dict = Depends(get_current_user)):
    funcionarios = list(db.funcionarios.find({}, {"_id": 0, "password": 0}))
    return funcionarios
