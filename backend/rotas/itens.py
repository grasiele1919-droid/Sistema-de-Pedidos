from fastapi import APIRouter, HTTPException, status
from esquemas.item import ItemCriar, ItemAtualizar, ItemSaida

# OBS: este endpoint oferece o cardápio e aceita um filtro opcional por categoria.
# OPÇÃO: filtro por query string é direto; filtros complexos podem usar parâmetros paginados.
router = APIRouter()

cardapio = [
    {"id": 1, "nome": "Pizza Marguerita", "preco": 39.90, "categoria": "prato", "descricao": None, "imagem": None, "destaque": False, "disponivel": True},
    {"id": 2, "nome": "Suco de Laranja", "preco": 12.50, "categoria": "bebida", "descricao": None, "imagem": None, "destaque": False, "disponivel": True},
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


@router.post("", response_model=ItemSaida, status_code=status.HTTP_201_CREATED, summary="Criar item")
def criar_item(item: ItemCriar):
    """Cria um novo item no cardápio."""
    novo_id = max([i["id"] for i in cardapio], default=0) + 1
    novo_item = {
        "id": novo_id,
        **item.model_dump()
    }
    cardapio.append(novo_item)
    return novo_item


@router.put("/{item_id}", response_model=ItemSaida, summary="Atualizar item")
def atualizar_item(item_id: int, item: ItemAtualizar):
    """Atualiza um item existente no cardápio."""
    for i, it in enumerate(cardapio):
        if it["id"] == item_id:
            dados_atualizados = item.model_dump(exclude_unset=True)
            cardapio[i].update(dados_atualizados)
            return cardapio[i]
    raise HTTPException(status_code=404, detail="Item não encontrado")


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Deletar item")
def deletar_item(item_id: int):
    """Remove um item do cardápio."""
    for i, it in enumerate(cardapio):
        if it["id"] == item_id:
            cardapio.pop(i)
            return
    raise HTTPException(status_code=404, detail="Item não encontrado")
