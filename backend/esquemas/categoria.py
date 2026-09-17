from pydantic import BaseModel


class CategoriaCriar(BaseModel):
    nome: str


class CategoriaSaida(BaseModel):
    id: int
    nome: str
