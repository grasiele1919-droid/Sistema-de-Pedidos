from fastapi import APIRouter, HTTPException, status
from esquemas.categoria import CategoriaCriar, CategoriaAtualizar, CategoriaSaida

# OBS: categorias organizam o cardápio e podem ser consultadas por ID.
# OPÇÃO: filtrar na memória é simples; o banco pode filtrar com uma consulta quando houver muitos registros.
# APIRouter organiza as rotas de categorias para o arquivo principal incluí-las na API.
router = APIRouter()

# A lista em memória representa as categorias disponíveis sem depender de banco de dados.
categorias = [
    {"id": 1, "nome": "Pratos", "icone": None, "ordem": 0, "ativa": True},
    {"id": 2, "nome": "Bebidas", "icone": None, "ordem": 1, "ativa": True},
]


@router.get("", response_model=list[CategoriaSaida], summary="Listar categorias")
def listar_categorias():
    """Retorna todas as categorias cadastradas na memória."""
    return categorias


@router.get("/{categoria_id}", response_model=CategoriaSaida, summary="Consultar categoria")
def obter_categoria(categoria_id: int):
    """Retorna uma categoria pelo ID ou informa que ela não foi encontrada."""
    for categoria in categorias:
        if categoria["id"] == categoria_id:
            return categoria
    raise HTTPException(status_code=404, detail="Categoria não encontrada")


@router.post("", response_model=CategoriaSaida, status_code=status.HTTP_201_CREATED, summary="Criar categoria")
def criar_categoria(categoria: CategoriaCriar):
    """Cria uma nova categoria."""
    novo_id = max([c["id"] for c in categorias], default=0) + 1
    nova_categoria = {
        "id": novo_id,
        **categoria.model_dump()
    }
    categorias.append(nova_categoria)
    return nova_categoria


@router.put("/{categoria_id}", response_model=CategoriaSaida, summary="Atualizar categoria")
def atualizar_categoria(categoria_id: int, categoria: CategoriaAtualizar):
    """Atualiza uma categoria existente."""
    for i, c in enumerate(categorias):
        if c["id"] == categoria_id:
            dados_atualizados = categoria.model_dump(exclude_unset=True)
            categorias[i].update(dados_atualizados)
            return categorias[i]
    raise HTTPException(status_code=404, detail="Categoria não encontrada")


@router.delete("/{categoria_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Deletar categoria")
def deletar_categoria(categoria_id: int):
    """Remove uma categoria."""
    for i, c in enumerate(categorias):
        if c["id"] == categoria_id:
            categorias.pop(i)
            return
    raise HTTPException(status_code=404, detail="Categoria não encontrada")
