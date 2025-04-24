from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import funcionarios, brinquedos, tipos_brinquedos, auth, clientes, locacao, pagamentos
from core.startup import criar_usuario_admin_padrao

app = FastAPI()
criar_usuario_admin_padrao()

origins = [
    "http://locabrinquedos.duckdns.org:3000",
    "http://locabrinquedos.duckdns.org"
    ]

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
app.include_router(locacao.router, prefix="/locacoes", tags=["Locação"])
app.include_router(pagamentos.router, prefix="/pagamentos", tags=["Pagamentos"])

@app.get("/")
def root():
    return {"mensagem": "API de Locação de Brinquedos"}
