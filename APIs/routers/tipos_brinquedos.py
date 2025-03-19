from fastapi import APIRouter, Depends, HTTPException
from core.database import db
from core.auth import get_current_user
from models.schemas import TipoBrinquedo
from typing import List

router = APIRouter()

@router.post("/")
def criar_tipo_brinquedo(tipo: TipoBrinquedo, user: dict = Depends(get_current_user)):
    if user["role"] != "almoxarife":
        raise HTTPException(status_code=403, detail="Apenas almoxarifes podem cadastrar tipos de brinquedos")

    if db.tipos_brinquedos.find_one({"nome": tipo.nome}):
        raise HTTPException(status_code=400, detail="Esse tipo de brinquedo já existe")

    db.tipos_brinquedos.insert_one(tipo.dict())
    return {"mensagem": "Tipo de brinquedo cadastrado com sucesso!"}

@router.get("/", response_model=List[TipoBrinquedo])
def listar_tipos_brinquedos(user: dict = Depends(get_current_user)):
    tipos = list(db.tipos_brinquedos.find({}, {"_id": 0}))
    return tipos
