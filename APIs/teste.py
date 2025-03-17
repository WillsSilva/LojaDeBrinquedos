from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
novo_hash = pwd_context.hash("senha123")
print(novo_hash)