from fastapi import APIRouter, Depends, HTTPException
from core.database import db
from core.auth import get_current_user
from models.schemas import TipoBrinquedo
from typing import List

router = APIRouter()


# Criar um tipo de brinquedo (apenas almoxarifes)
@router.post("/")
def criar_tipo_brinquedo(tipo: TipoBrinquedo, user: dict = Depends(get_current_user)):
    if user["role"] != "almoxarife":
        raise HTTPException(status_code=403, detail="Apenas almoxarifes podem cadastrar tipos de brinquedos")

    # Verificar se já existe um usuário com o mesmo username
    if db.tipos_brinquedos.find_one({"nome": TipoBrinquedo.nome}):
        raise HTTPException(status_code=400, detail="Nome de usuário já está em uso")

    tipo_dict = TipoBrinquedo.dict()

    db.tipos_brinquedos.insert_one(tipo_dict)
    return {"mensagem": "Tipo criado com sucesso"}    


# Atualizar um tipo de brinquedo (apenas almoxarifes)
@router.put("/{id}")
def atualizar_tipo_brinquedo(id: str, tipo: TipoBrinquedo, user: dict = Depends(get_current_user)):
    if user["role"] != "almoxarife":
        raise HTTPException(status_code=403, detail="Apenas almoxarifes podem atualizar tipos de brinquedos")

    existing_tipo = db.tipos_brinquedos.find_one({"codigoUnico": int(id)})
    if not existing_tipo:
        raise HTTPException(status_code=404, detail="Tipo de brinquedo não encontrado")

    db.tipos_brinquedos.update_one({"codigoUnico": int(id)}, {"$set": tipo.dict()})

    return {"mensagem": "Tipo de brinquedo atualizado com sucesso!"}

# Listar todos os tipos de brinquedos
@router.get("/", response_model=List[TipoBrinquedo])
def listar_tipos_brinquedos(user: dict = Depends(get_current_user)):
    tipos = list(db.tipos_brinquedos.find({}, {"_id": 0}))  # Remove o _id
    return tipos

# Deletar um tipo de brinquedo (apenas almoxarifes)
@router.delete("/{id}")
def deletar_tipo_brinquedo(id: str, user: dict = Depends(get_current_user)):
    if user["role"] != "almoxarife":
        raise HTTPException(status_code=403, detail="Apenas almoxarifes podem deletar tipos de brinquedos")

    existing_tipo = db.tipos_brinquedos.find_one({"codigoUnico": int(id)})
    if not existing_tipo:
        raise HTTPException(status_code=404, detail="Tipo de brinquedo não encontrado")

    db.tipos_brinquedos.delete_one({"codigoUnico": int(id)})

    return {"mensagem": "Tipo de brinquedo deletado com sucesso!"}
