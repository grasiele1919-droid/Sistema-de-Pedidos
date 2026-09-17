from fastapi import APIRouter
from esquemas.pedido import PedidoSaida

router = APIRouter()

pedidos = [
    {
        "id": 1,
        "cliente": "Ana Souza",
        "itens": [1, 2],
        "status": "recebido",
    }
]

@router.get("", response_model=list[PedidoSaida], summary="Listar pedidos")
def listar_pedidos():
    """Retorna os pedidos armazenados em memória."""
    return pedidos
