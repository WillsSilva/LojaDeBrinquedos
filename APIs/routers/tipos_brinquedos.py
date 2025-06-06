from typing import List

from fastapi import APIRouter, Depends, HTTPException

from core.auth import get_current_user
from core.database import db
from models.schemas import TipoBrinquedo

router = APIRouter()


# Criar um tipo de brinquedo (apenas almoxarifes)
@router.post('/')
def criar_tipo_brinquedo(
    tipo: TipoBrinquedo, user: dict = Depends(get_current_user)
):
    if user['role'] not in ['Almoxarife', 'admin']:
        raise HTTPException(
            status_code=403,
            detail='Apenas almoxarifes podem cadastrar tipos de brinquedos',
        )

    if db.tipos_brinquedos.find_one({'nome': tipo.nome}):
        raise HTTPException(
            status_code=400, detail='Esse tipo de brinquedo já existe'
        )

    ultimo_tipo = db.tipos_brinquedos.find_one(sort=[('ID', -1)])
    novo_codigo = (ultimo_tipo['ID'] + 1) if ultimo_tipo else 1

    tipo_dict = tipo.dict()
    tipo_dict['ID'] = novo_codigo

    db.tipos_brinquedos.insert_one(tipo_dict)

    return {
        'mensagem': 'Tipo de brinquedo cadastrado com sucesso!',
        'ID': novo_codigo,
    }


# Atualizar um tipo de brinquedo (apenas almoxarifes)
@router.put('/{id}')
def atualizar_tipo_brinquedo(
    id: str, tipo: TipoBrinquedo, user: dict = Depends(get_current_user)
):
    if user['role'] not in ['Almoxarife', 'admin']:
        raise HTTPException(
            status_code=403,
            detail='Apenas almoxarifes podem atualizar tipos de brinquedos',
        )

    existing_tipo = db.tipos_brinquedos.find_one({'ID': int(id)})
    if not existing_tipo:
        raise HTTPException(
            status_code=404, detail='Tipo de brinquedo não encontrado'
        )

    db.tipos_brinquedos.update_one({'ID': int(id)}, {'$set': tipo.dict()})

    return {'mensagem': 'Tipo de brinquedo atualizado com sucesso!'}


# Listar todos os tipos de brinquedos
@router.get('/', response_model=List[TipoBrinquedo])
def listar_tipos_brinquedos(user: dict = Depends(get_current_user)):
    tipos = list(db.tipos_brinquedos.find({}, {'_id': 0}))  # Remove o _id
    return tipos


# Deletar um tipo de brinquedo (apenas almoxarifes)
@router.delete('/{id}')
def deletar_tipo_brinquedo(id: str, user: dict = Depends(get_current_user)):
    if user['role'] not in ['Almoxarife', 'admin']:
        raise HTTPException(
            status_code=403,
            detail='Apenas almoxarifes podem deletar tipos de brinquedos',
        )

    existing_tipo = db.tipos_brinquedos.find_one({'ID': int(id)})
    if not existing_tipo:
        raise HTTPException(
            status_code=404, detail='Tipo de brinquedo não encontrado'
        )

    db.tipos_brinquedos.delete_one({'ID': int(id)})

    return {'mensagem': 'Tipo de brinquedo deletado com sucesso!'}


@router.get('/{id}')
def obter_tipo_brinquedo(id: int, user: dict = Depends(get_current_user)):
    tipo_brinquedo = db.tipos_brinquedos.find_one(
        {'ID': id}, {'_id': 0}
    )  # Remove o _id

    if not tipo_brinquedo:
        raise HTTPException(
            status_code=404, detail='Tipo de brinquedo não encontrado'
        )

    return tipo_brinquedo
