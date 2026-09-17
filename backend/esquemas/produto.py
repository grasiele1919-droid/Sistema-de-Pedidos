from pydantic import BaseModel


class ProdutoCriar(BaseModel):
    nome: str
    preco: float
    categoria: str


class ProdutoSaida(ProdutoCriar):
    id: int
