from pydantic import BaseModel
from typing import Optional
from datetime import datetime

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
    codigoUnico: Optional[int] = None
    nome: str
    tipoBrinquedo: int
    marca: str
    dataAquisicao: datetime
    vlLocacao: float

class TipoBrinquedo(BaseModel):
    codigoUnico: Optional[int] = None
    nome: str
