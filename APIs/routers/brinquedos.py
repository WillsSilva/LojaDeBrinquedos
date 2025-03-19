from fastapi import APIRouter, Depends, HTTPException
from core.database import db
from core.auth import get_current_user
from models.schemas import Brinquedo
from typing import List

router = APIRouter()

@router.post("/")
def criar_brinquedo(brinquedo: Brinquedo, user: dict = Depends(get_current_user)):
    if user["role"] != "almoxarife":
        raise HTTPException(status_code=403, detail="Apenas almoxarifes podem cadastrar brinquedos")

    if db.brinquedos.find_one({"codigoUnico": brinquedo.codigoUnico}):
        raise HTTPException(status_code=400, detail="Já existe um brinquedo com esse código único")

    db.brinquedos.insert_one(brinquedo.dict())
    return {"mensagem": "Brinquedo cadastrado com sucesso!"}

@router.get("/", response_model=List[Brinquedo])
def listar_brinquedos(user: dict = Depends(get_current_user)):
    brinquedos = list(db.brinquedos.find({}, {"_id": 0}))
    return brinquedos
