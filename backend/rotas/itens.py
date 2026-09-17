from fastapi import APIRouter, HTTPException
from esquemas.item import ItemSaida

router = APIRouter()

cardapio = [
    {"id": 1, "nome": "Pizza Marguerita", "preco": 39.90, "categoria": "prato"},
    {"id": 2, "nome": "Suco de Laranja", "preco": 12.50, "categoria": "bebida"},
]


@router.get("", response_model=list[ItemSaida], summary="Listar itens do cardápio")
def listar_itens(categoria: str | None = None):
    """Retorna todos os itens ou filtra pelo valor de `categoria`."""
    if categoria is None:
        return cardapio

    filtrados = []
    for item in cardapio:
        if item["categoria"] == categoria:
            filtrados.append(item)
    return filtrados


@router.get("/{item_id}", response_model=ItemSaida, summary="Consultar item do cardápio")
def obter_item(item_id: int):
    """Retorna um item pelo ID ou responde 404 se ele não existir."""
    for item in cardapio:
        if item["id"] == item_id:
            return item
    raise HTTPException(status_code=404, detail="Item não encontrado")
