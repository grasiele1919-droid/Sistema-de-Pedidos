from datetime import datetime
from decimal import Decimal

from fastapi import APIRouter, HTTPException, status
from esquemas.pedido import PedidoCriar, PedidoAtualizarStatus, PedidoSaida

# OBS: pedidos ficam em memória apenas enquanto a aplicação está ligada.
# OPÇÃO: para preservar pedidos após reiniciar, use banco de dados e uma camada de serviço.
router = APIRouter()

# Lista de produtos para buscar informações ao criar pedidos.
produtos = [
    {"id": 1, "nome": "Pizza Marguerita", "preco": Decimal("39.90"), "categoria": "prato"},
    {"id": 2, "nome": "Suco de Laranja", "preco": Decimal("12.50"), "categoria": "bebida"},
]

pedidos = [
    {
        "id": 1,
        "numero": None,
        "cliente": "Ana Souza",
        "tipo": "local",
        "observacao": "",
        "itens": [1, 2],
        "total": None,
        "status": "recebido",
        "criado_em": None,
        "atualizado_em": None,
    }
]

@router.get("", response_model=list[PedidoSaida], summary="Listar pedidos")
def listar_pedidos():
    """Retorna os pedidos armazenados em memória."""
    return pedidos


@router.get("/{pedido_id}", response_model=PedidoSaida, summary="Consultar pedido")
def obter_pedido(pedido_id: int):
    """Retorna um pedido pelo ID."""
    for pedido in pedidos:
        if pedido["id"] == pedido_id:
            return pedido
    raise HTTPException(status_code=404, detail="Pedido não encontrado")


@router.post("", response_model=PedidoSaida, status_code=status.HTTP_201_CREATED, summary="Criar pedido")
def criar_pedido(pedido: PedidoCriar):
    """Cria um novo pedido com os itens, preço e status calculados pelo servidor."""
    
    # Gera o próximo ID
    novo_id = max([p["id"] for p in pedidos], default=0) + 1
    
    # Expande os itens com nome, preço e calcula o total
    itens_expandidos = []
    total = Decimal("0")
    
    for item_entrada in pedido.itens:
        # Busca o produto pelo ID
        produto = next((p for p in produtos if p["id"] == item_entrada.produto_id), None)
        if not produto:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Produto {item_entrada.produto_id} não encontrado."
            )
        
        # Monta o item de saída com dados do produto
        item_expandido = {
            "produtoId": item_entrada.produto_id,
            "quantidade": item_entrada.quantidade,
            "nome": produto["nome"],
            "precoUnitario": produto["preco"],
        }
        itens_expandidos.append(item_expandido)
        total += produto["preco"] * item_entrada.quantidade
    
    # Cria o pedido em memória
    agora = datetime.now()
    novo_pedido = {
        "id": novo_id,
        "numero": None,
        "cliente": pedido.cliente,
        "tipo": pedido.tipo,
        "observacao": pedido.observacao,
        "itens": itens_expandidos,
        "total": total,
        "status": "recebido",
        "criado_em": agora,
        "atualizado_em": agora,
    }
    
    pedidos.append(novo_pedido)
    return novo_pedido


@router.patch("/{pedido_id}", response_model=PedidoSaida, summary="Atualizar status do pedido")
def atualizar_status_pedido(pedido_id: int, pedido_status: PedidoAtualizarStatus):
    """Atualiza o status de um pedido existente."""
    for i, p in enumerate(pedidos):
        if p["id"] == pedido_id:
            pedidos[i]["status"] = pedido_status.status
            pedidos[i]["atualizado_em"] = datetime.now()
            return pedidos[i]
    raise HTTPException(status_code=404, detail="Pedido não encontrado")
