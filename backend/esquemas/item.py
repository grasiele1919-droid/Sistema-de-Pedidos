from pydantic import BaseModel


class ItemCriar(BaseModel):
    nome: str
    preco: float
    categoria: str


class ItemSaida(ItemCriar):
    id: int
