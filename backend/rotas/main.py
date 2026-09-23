from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import categorias, itens, pedidos, produtos, saude

# OBS: main cria a API e registra as rotas de cada assunto.
# OPÇÃO: projeto pequeno pode centralizar tudo aqui; projeto maior usa módulos e configurações por ambiente.
app = FastAPI(title="Cardápio Digital")

# OBS: Front-end roda com `vite --host` em 5173 (acessível via localhost, 127.0.0.1 e hostname real).
# OPÇÃO: em produção, usar variável de ambiente e endpoints específicos.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",      # Frontend local (localhost)
        "http://127.0.0.1:5173",      # Frontend local (loopback)
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["*"],
)

app.include_router(itens.router, prefix="/itens", tags=["Cardápio"])
app.include_router(produtos.router, prefix="/produtos", tags=["Produtos"])
app.include_router(categorias.router, prefix="/categorias", tags=["Categorias"])
app.include_router(pedidos.router, prefix="/pedidos", tags=["Pedidos"])
app.include_router(saude.router, prefix="", tags=["Saúde"])
