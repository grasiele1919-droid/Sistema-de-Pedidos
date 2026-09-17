from pydantic import BaseModel


class PedidoCriar(BaseModel):
    cliente: str
    itens: list[int]


class PedidoSaida(PedidoCriar):
    id: int
    status: str
