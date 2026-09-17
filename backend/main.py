from fastapi import FastAPI
from rotas import categorias, itens, pedidos, produtos, saude

app = FastAPI(title="Cardápio Digital")

app.include_router(itens.router, prefix="/itens", tags=["Cardápio"])
app.include_router(produtos.router, prefix="/produtos", tags=["Produtos"])
app.include_router(categorias.router, prefix="/categorias", tags=["Categorias"])
app.include_router(pedidos.router, prefix="/pedidos", tags=["Pedidos"])
app.include_router(saude.router, prefix="", tags=["Saúde"])
