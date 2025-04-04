from fastapi import APIRouter, Depends, HTTPException
from core.database import db
from core.auth import get_current_user
from models.schemas import Brinquedo
from typing import List

router = APIRouter()

# Rota para criar um brinquedo (apenas almoxarifes)
@router.post("/")
def criar_brinquedo(brinquedo: Brinquedo, user: dict = Depends(get_current_user)):
    if user["role"] != "Almoxarife":
        raise HTTPException(status_code=403, detail="Apenas almoxarifes podem cadastrar brinquedos")

    ultimo_brinquedo = db.brinquedos.find_one(sort=[("ID", -1)])
    novo_codigo = (ultimo_brinquedo["ID"] + 1) if ultimo_brinquedo else 1

    brinquedo_dict = brinquedo.dict(exclude={"ID"})
    brinquedo_dict["ID"] = novo_codigo

    db.brinquedos.insert_one(brinquedo_dict)

    return {"mensagem": "Brinquedo cadastrado com sucesso!", "ID": novo_codigo}


# Rota para atualizar um brinquedo (apenas almoxarifes)
@router.put("/{id}")
def atualizar_brinquedo(id: str, brinquedo: Brinquedo, user: dict = Depends(get_current_user)):
    if user["role"] != "Almoxarife":
        raise HTTPException(status_code=403, detail="Apenas almoxarifes podem atualizar brinquedos")

    existing_brinquedo = db.brinquedos.find_one({"ID": int(id)})
    if not existing_brinquedo:
        raise HTTPException(status_code=404, detail="Brinquedo não encontrado")

    db.brinquedos.update_one({"ID": int(id)}, {"$set": brinquedo.dict()})
    
    return {"mensagem": "Brinquedo atualizado com sucesso!"}

@router.get("/", response_model=List[Brinquedo])
def listar_brinquedos(user: dict = Depends(get_current_user)):
    brinquedos = list(db.brinquedos.find({}, {"_id": 0}))  # Não retorna o _id
    return brinquedos

@router.get("/{id}", response_model=Brinquedo)
def obter_brinquedo(id: str, user: dict = Depends(get_current_user)):
    brinquedo = db.brinquedos.find_one({"ID": int(id)}, {"_id": 0})  # Não retorna o _id
    if not brinquedo:
        raise HTTPException(status_code=404, detail="Brinquedo não encontrado")
    return brinquedo

@router.delete("/{id}")
def deletar_brinquedo(id: str, user: dict = Depends(get_current_user)):
    if user["role"] != "Almoxarife":
        raise HTTPException(status_code=403, detail="Apenas almoxarifes podem deletar tipos de brinquedos")

    existing_brinquedo = db.brinquedos.find_one({"ID": int(id)})
    if not existing_brinquedo:
        raise HTTPException(status_code=404, detail="Tipo de brinquedo não encontrado")

    db.brinquedos.delete_one({"ID": int(id)})

    return {"mensagem": "Brinquedo deletado com sucesso!"}
