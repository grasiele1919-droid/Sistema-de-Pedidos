from fastapi import APIRouter, HTTPException, status
from esquemas.produto import ProdutoCriar, ProdutoAtualizar, ProdutoSaida

# OBS: a rota só expõe produtos; o esquema garante o formato da resposta.
# OPÇÃO: a lista em memória é didática; um repositório com banco de dados é a evolução natural.
# APIRouter agrupa as rotas de produtos para o arquivo principal incluí-las na API.
router = APIRouter()

# A lista em memória simula os produtos disponíveis enquanto o projeto não usa banco de dados.
produtos = [
    {"id": 1, "nome": "Pizza Marguerita", "preco": 39.90, "categoria": "prato", "descricao": None, "imagem": None, "destaque": False, "disponivel": True},
    {"id": 2, "nome": "Suco de Laranja", "preco": 12.50, "categoria": "bebida", "descricao": None, "imagem": None, "destaque": False, "disponivel": True},
]


@router.get("", response_model=list[ProdutoSaida], summary="Listar produtos")
def listar_produtos(categoria: str | None = None):
    """Retorna todos os produtos ou somente os da categoria solicitada."""
    if categoria is None:
        return produtos

    filtrados = []
    for produto in produtos:
        if produto["categoria"] == categoria:
            filtrados.append(produto)
    return filtrados


@router.get("/{produto_id}", response_model=ProdutoSaida, summary="Consultar produto")
def obter_produto(produto_id: int):
    """Retorna um produto pelo ID ou informa que ele não foi encontrado."""
    for produto in produtos:
        if produto["id"] == produto_id:
            return produto
    raise HTTPException(status_code=404, detail="Produto não encontrado")


@router.post("", response_model=ProdutoSaida, status_code=status.HTTP_201_CREATED, summary="Criar produto")
def criar_produto(produto: ProdutoCriar):
    """Cria um novo produto e o adiciona ao catálogo."""
    novo_id = max([p["id"] for p in produtos], default=0) + 1
    novo_produto = {
        "id": novo_id,
        **produto.model_dump()
    }
    produtos.append(novo_produto)
    return novo_produto


@router.put("/{produto_id}", response_model=ProdutoSaida, summary="Atualizar produto")
def atualizar_produto(produto_id: int, produto: ProdutoAtualizar):
    """Atualiza um produto existente."""
    for i, p in enumerate(produtos):
        if p["id"] == produto_id:
            dados_atualizados = produto.model_dump(exclude_unset=True)
            produtos[i].update(dados_atualizados)
            return produtos[i]
    raise HTTPException(status_code=404, detail="Produto não encontrado")


@router.delete("/{produto_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Deletar produto")
def deletar_produto(produto_id: int):
    """Remove um produto do catálogo."""
    for i, p in enumerate(produtos):
        if p["id"] == produto_id:
            produtos.pop(i)
            return
    raise HTTPException(status_code=404, detail="Produto não encontrado")
