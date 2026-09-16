from fastapi import APIRouter, HTTPException

# APIRouter organiza as rotas de categorias para o arquivo principal incluí-las na API.
router = APIRouter()

# A lista em memória representa as categorias disponíveis sem depender de banco de dados.
categorias = [
    {"id": 1, "nome": "Pratos"},
    {"id": 2, "nome": "Bebidas"},
]


# Esta rota mostra as categorias para a tela organizar os produtos do cardápio.
@router.get("", summary="Listar categorias")
def listar_categorias():
    """Retorna todas as categorias cadastradas na memória."""
    return categorias


# Esta rota encontra uma categoria pelo ID para consultar suas informações.
@router.get("/{categoria_id}", summary="Consultar categoria")
def obter_categoria(categoria_id: int):
    """Retorna uma categoria pelo ID ou informa que ela não foi encontrada."""
    for categoria in categorias:
        if categoria["id"] == categoria_id:
            return categoria
    raise HTTPException(status_code=404, detail="Categoria não encontrada")
