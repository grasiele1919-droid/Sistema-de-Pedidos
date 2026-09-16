from fastapi import APIRouter

router = APIRouter()

pedidos = [
    {
        "id": 1,
        "cliente": "Ana Souza",
        "itens": [1, 2],
        "status": "recebido",
    }
]

@router.get("", summary="Listar pedidos")
def listar_pedidos():
    """Retorna os pedidos armazenados em memória."""
    return pedidos
