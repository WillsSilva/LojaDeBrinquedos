from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import funcionarios, brinquedos, tipos_brinquedos, auth, clientes

app = FastAPI()

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar routers
app.include_router(auth.router, tags=["Autenticação"])
app.include_router(funcionarios.router, prefix="/funcionarios", tags=["Funcionários"])
app.include_router(brinquedos.router, prefix="/brinquedos", tags=["Brinquedos"])
app.include_router(tipos_brinquedos.router, prefix="/tipos_brinquedos", tags=["Tipos de Brinquedos"])
app.include_router(clientes.router, prefix="/clientes", tags=["Clientes"])

@app.get("/")
def root():
    return {"mensagem": "API de Locação de Brinquedos"}
