from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from pymongo import MongoClient
from passlib.context import CryptContext
from datetime import datetime, timedelta

# Configurações do JWT
SECRET_KEY = "chave_secreta_super_segura"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# Banco de usuários fictício (pode usar MongoDB depois)
fake_users_db = {
    "gerente": {
        "username": "gerente",
        "password": "$2b$12$apMADkPGIchXpoeueeF04uUZKlGHYMVjTAz0FlJVOplH5LNWEHaHa",  # Hash de "senha123"
        "role": "gerente"
    }
}

# Conectar ao MongoDB
client = MongoClient("mongodb://localhost:27017")
db = client["locacao_brinquedos"]

# Configuração de criptografia de senha
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def authenticate_user(username: str, password: str):
    user = db.funcionarios.find_one({"username": username})
    if not user or not verify_password(password, user["password"]):
        return None  # Retorna None se a autenticação falhar
    return user

def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Token inválido")
        return {"username": username, "role": payload.get("role")}
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido")
