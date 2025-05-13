from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException

from core.auth import get_current_user
from core.database import db
from models.schemas import Locacao, LocacaoResponse

router = APIRouter()

# Rota para criar uma locação (apenas Agentes de Locação)
@router.post('/')
def criar_locacao(locacao: Locacao, user: dict = Depends(get_current_user)):
    if user['role'] not in ['AgenteDeLocacao', 'admin']:
        raise HTTPException(
            status_code=403,
            detail='Apenas agentes de locação podem registrar locações',
        )

    if not locacao.brinquedos:
        raise HTTPException(
            status_code=400,
            detail='É necessário ao menos um brinquedo na locação',
        )

    # Calcular o valor total da locação
    vlTotal = sum([b['vlBrinquedo'] for b in locacao.brinquedos])

    # Obter um novo ID para a locação
    ultimo_id = db.locacoes.find_one(sort=[('ID', -1)])
    novo_id = (ultimo_id['ID'] + 1) if ultimo_id else 1

    # Criar o documento de locação
    locacao_dict = locacao.dict(exclude={'ID', 'dataLocacao'})
    locacao_dict['ID'] = novo_id
    locacao_dict['dataLocacao'] = datetime.now()
    locacao_dict['vlTotal'] = vlTotal

    # Salvar a locação no banco
    db.locacoes.insert_one(locacao_dict)

    return {'mensagem': 'Locação registrada com sucesso!', 'ID': novo_id}


# Rota para listar todas as locações
@router.get('/', response_model=List[LocacaoResponse])
def listar_locacoes(user: dict = Depends(get_current_user)):
    locacoes = list(db.locacoes.find({}, {'_id': 0}))

    # Gerar a resposta com nomeCliente
    resposta = []
    for locacao in locacoes:
        cliente = db.clientes.find_one({'cpf': locacao['cpf']}, {'_id': 0})
        nome_cliente = cliente['nome'] if cliente else 'Desconhecido'

        resposta.append(
            {
                'ID': locacao['ID'],
                'nomeCliente': nome_cliente,  # Substituindo cpf por nomeCliente
                'dataLocacao': locacao['dataLocacao'],
                'dataDevolucao': locacao['dataDevolucao'],
                'brinquedos': locacao['brinquedos'],
                'vlTotal': locacao['vlTotal'],
            }
        )

    return resposta


# Rota para obter uma locação por ID
@router.get('/{id}', response_model=List[LocacaoResponse])
def obter_locacao(id: str, user: dict = Depends(get_current_user)):
    locacoes = list(db.locacoes.find({'ID': int(id)}, {'_id': 0}))
    if not locacoes:
        raise HTTPException(status_code=404, detail='Locação não encontrada')

    resposta = []
    for locacao in locacoes:
        cliente = db.clientes.find_one({'cpf': locacao['cpf']}, {'_id': 0})
        nome_cliente = cliente['nome'] if cliente else 'Desconhecido'

        resposta.append(
            {
                'ID': locacao['ID'],
                'nomeCliente': nome_cliente,
                'dataLocacao': locacao['dataLocacao'],
                'dataDevolucao': locacao['dataDevolucao'],
                'brinquedos': locacao['brinquedos'],
                'vlTotal': locacao['vlTotal'],
            }
        )

    return resposta


# Rota para deletar uma locação inteira
@router.delete('/{id}')
def deletar_locacao(id: str, user: dict = Depends(get_current_user)):
    if user['role'] not in ['AgenteDeLocacao', 'admin']:
        raise HTTPException(
            status_code=403,
            detail='Apenas agentes de locação podem deletar locações',
        )

    locacoes = list(db.locacoes.find({'ID': int(id)}))
    if not locacoes:
        raise HTTPException(status_code=404, detail='Locação não encontrada')

    db.locacoes.delete_many({'ID': int(id)})
    return {'mensagem': 'Locação deletada com sucesso!'}
