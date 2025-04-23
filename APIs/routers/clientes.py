from fastapi import APIRouter, Depends, HTTPException
from core.database import db
from core.auth import get_current_user, hash_password
from models.schemas import Cliente, ClienteUpdate
from typing import List

router = APIRouter()

# Rota protegida: Apenas gerentes podem cadastrar clientes
@router.post("/")
def criar_cliente(cliente: Cliente, user: dict = Depends(get_current_user)):
    if user["role"] not in ["AnalistadeCadastro", "admin"]:        
        raise HTTPException(status_code=403, detail="Apenas gerentes podem cadastrar clientes")

    # Verificar se já existe um usuário com o mesmo cpf
    if db.clientes.find_one({"cpf": cliente.cpf}):
        raise HTTPException(status_code=400, detail="Nome de usuário já está em uso")

    cliente_dict = cliente.dict()
    
    db.clientes.insert_one(cliente_dict)
    return {"mensagem": "Cliente criado com sucesso"}


@router.put("/{id}")
def atualizar_cliente(id: str, cliente: ClienteUpdate, user: dict = Depends(get_current_user)):
    
    if user["role"] not in ["AnalistadeCadastro", "admin"]:
        raise HTTPException(status_code=403, detail="Apenas gerentes podem atualizar clientes")

    # Verificar se o cliente existe no banco de dados
    existing_cliente = db.cliente.find_one({"cpf": id})
    if not existing_cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")

    if cliente.cpf:
        cliente_exists = db.cliente.find_one({"cpf": cliente.cpf})
        if cliente_exists and cliente_exists["_id"] != cliente_exists["_id"]:
            raise HTTPException(status_code=400, detail="CPF já está em uso")

    update_data = {key: value for key, value in cliente.dict(exclude_unset=True).items()}

    db.clientes.update_one({"cpf": id}, {"$set": update_data})

    return {"message": "Cliente atualizado com sucesso", "cliente": update_data}


@router.delete("/{id}")
def deletar_cliente(id: str, user: dict = Depends(get_current_user)):
    if user["role"] not in ["AnalistadeCadastro", "admin"]:
        raise HTTPException(status_code=403, detail="Apenas o Analista de Cadastro pode excluir clientes")

    cliente = db.clientes.find_one({"cpf": str(id)})
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")

    db.clientes.delete_one({"cpf": str(id)})
    return {"mensagem": "Cliente deletado com sucesso"}

# Endpoint para listar clientes (apenas para usuários autenticados)
@router.get("/", response_model=List[Cliente])
def listar_clientes(user: dict = Depends(get_current_user)):
    clientes = list(db.clientes.find({}, {"_id": 1, "cpf": 1, "nome": 1, "telefone": 1, "endereco": 1, "dataNasc": 1}))  # Inclui '_id'
    
    for cliente in clientes:
        cliente['id'] = str(cliente['_id'])
        del cliente['_id']
    
    return clientes

@router.get("/{id}")
def obter_cliente(id: str, user: dict = Depends(get_current_user)):  
    cliente = db.clientes.find_one({"cpf": id}, {"_id": 0})  
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    return cliente