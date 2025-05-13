from datetime import datetime
from typing import Dict, List, Optional, Union

from pydantic import BaseModel


class Funcionario(BaseModel):
    cpf: str
    nome: str
    telefone: str
    role: str
    username: str
    password: str


class FuncionarioResponse(BaseModel):
    username: str
    role: str
    cpf: str
    nome: str
    telefone: str

    class Config:
        from_attributes = True


class FuncionarioUpdate(BaseModel):
    cpf: Optional[str] = None
    nome: Optional[str] = None
    telefone: Optional[str] = None
    role: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None


class Brinquedo(BaseModel):
    ID: Optional[int] = None
    nome: str
    tipoBrinquedo: int
    marca: str
    dataAquisicao: datetime
    vlLocacao: float


class TipoBrinquedo(BaseModel):
    ID: Optional[int] = None
    nome: str


class Cliente(BaseModel):
    cpf: str
    nome: str
    endereco: str
    dataNasc: datetime
    telefone: str


class ClienteUpdate(BaseModel):
    cpf: Optional[str] = None
    nome: Optional[str] = None
    endereco: Optional[str] = None
    dataNasc: Optional[datetime] = None
    telefone: Optional[str] = None


class BrinquedoL(BaseModel):
    IDBrinquedo: int
    vlBrinquedo: float


class Locacao(BaseModel):
    ID: Optional[int] = None
    dataLocacao: datetime
    cpf: str
    brinquedos: List[
        Dict[str, Union[int, float]]
    ]  # Mudado para ser uma lista de brinquedos
    vlTotal: float
    dataDevolucao: datetime


class LocacaoResponse(BaseModel):
    ID: int
    nomeCliente: str  # Alterar para nome do cliente
    dataLocacao: datetime
    brinquedos: List[Dict[str, Union[int, float]]]
    vlTotal: float
    dataDevolucao: datetime

    class Config:
        from_attributes = True


class Pagamento(BaseModel):
    IDLocacao: int
    vlLocacao: float
    vlPago: float


# Usado na resposta (com todos os dados preenchidos)
class PagamentoResponse(BaseModel):
    ID: int
    IDLocacao: int
    nomeCliente: str
    cpf: str
    dataPagamento: datetime
    valorLocacao: float
    valorPago: float
    valorTroco: float
