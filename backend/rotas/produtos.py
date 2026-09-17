from fastapi import APIRouter, HTTPException
from esquemas.produto import ProdutoSaida

# APIRouter agrupa as rotas de produtos para o arquivo principal incluí-las na API.
router = APIRouter()

# A lista em memória simula os produtos disponíveis enquanto o projeto não usa banco de dados.
produtos = [
    {"id": 1, "nome": "Pizza Marguerita", "preco": 39.90, "categoria": "prato"},
    {"id": 2, "nome": "Suco de Laranja", "preco": 12.50, "categoria": "bebida"},
]


# Esta rota apresenta os produtos e permite filtrar por categoria quando ela for informada.
@router.get("", response_model=list[ProdutoSaida], summary="Listar produtos")
def listar_produtos(categoria: str | None = None):
    """Retorna todos os produtos ou somente os da categoria solicitada."""
    if categoria is None:
        return produtos

    # O filtro mantém a resposta limitada aos produtos da categoria escolhida.
    filtrados = []
    for produto in produtos:
        if produto["categoria"] == categoria:
            filtrados.append(produto)
    return filtrados


# Esta rota localiza um produto pelo ID para a tela consultar seus detalhes.
@router.get("/{produto_id}", response_model=ProdutoSaida, summary="Consultar produto")
def obter_produto(produto_id: int):
    """Retorna um produto pelo ID ou informa que ele não foi encontrado."""
    for produto in produtos:
        if produto["id"] == produto_id:
            return produto
    raise HTTPException(status_code=404, detail="Produto não encontrado")
