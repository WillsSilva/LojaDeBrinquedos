from fastapi import APIRouter, Depends, HTTPException
from core.database import db
from core.auth import get_current_user
from models.schemas import TipoBrinquedo
from typing import List

router = APIRouter()

# Rota para criar um novo tipo de brinquedo (apenas almoxarifes)
@router.post("/")
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
@router.put("/{id}")
def atualizar_tipo_brinquedo(id: str, tipo: TipoBrinquedo, user: dict = Depends(get_current_user)):
    if user["role"] != "almoxarife":
        raise HTTPException(status_code=403, detail="Apenas almoxarifes podem atualizar tipos de brinquedos")

    existing_tipo = db.tipos_brinquedos.find_one({"codigoUnico": int(id)})
    if not existing_tipo:
        raise HTTPException(status_code=404, detail="Tipo de brinquedo não encontrado")

    db.tipos_brinquedos.update_one({"codigoUnico": int(id)}, {"$set": tipo.dict()})
    
    return {"mensagem": "Tipo de brinquedo atualizado com sucesso!"}

@router.get("/", response_model=List[TipoBrinquedo])
def listar_tipos_brinquedos(user: dict = Depends(get_current_user)):
    tipos = list(db.tipos_brinquedos.find({}, {"_id": 0}))  # Remove o _id
    return tipos