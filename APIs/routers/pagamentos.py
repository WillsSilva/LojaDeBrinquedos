from fastapi import APIRouter, Depends, HTTPException
from core.database import db
from core.auth import get_current_user
from models.schemas import Pagamento, PagamentoResponse
from typing import List
from datetime import datetime

router = APIRouter()

# Criar pagamento (apenas "Caixa")
@router.post("/")
def criar_pagamento(pagamento: Pagamento, user: dict = Depends(get_current_user)):
    if user["role"] not in ["Caixa", "admin"]:
        raise HTTPException(status_code=403, detail="Apenas caixas podem registrar pagamentos")

    # Verifica se a locação existe
    locacao = db.locacoes.find_one({"ID": pagamento.IDLocacao})
    if not locacao:
        raise HTTPException(status_code=404, detail="Locação não encontrada")

    cliente = db.clientes.find_one({"cpf": locacao["cpf"]}, {"_id": 0, "nome": 1, "cpf": 1})
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")

    ultimo_pagamento = db.pagamentos.find_one(sort=[("ID", -1)])
    novo_id = (ultimo_pagamento["ID"] + 1) if ultimo_pagamento else 1

    pagamento_dict = pagamento.dict()
    pagamento_dict["ID"] = novo_id
    pagamento_dict["nomeCliente"] = cliente["nome"]
    pagamento_dict["cpf"] = cliente["cpf"]
    pagamento_dict["dataPagamento"] = datetime.utcnow()

    db.pagamentos.insert_one(pagamento_dict)

    return {"mensagem": "Pagamento registrado com sucesso", "ID": novo_id}


@router.get("/", response_model=List[PagamentoResponse])
def listar_pagamentos(user: dict = Depends(get_current_user)):
    pagamentos_raw = list(db.pagamentos.find({}, {"_id": 0}))
    pagamentos = []

    for p in pagamentos_raw:
        pagamento_formatado = {
            "ID": p["ID"],
            "IDLocacao": p["IDLocacao"],
            "valorLocacao": p.get("vlLocacao", 0),
            "valorPago": p.get("vlPago", 0),
            "valorTroco": round(p.get("vlPago", 0) - p.get("vlLocacao", 0), 2),
            "nomeCliente": p["nomeCliente"],
            "cpf": p["cpf"],
            "dataPagamento": p["dataPagamento"],
        }
        pagamentos.append(pagamento_formatado)

    return pagamentos
