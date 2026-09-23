from datetime import datetime
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator


StatusPedido = Literal["recebido", "em_preparo", "pronto", "entregue", "cancelado"]
TipoPedido = Literal["local", "viagem"]

# OBS: Literal limita os valores aceitos e melhora a documentação automática do FastAPI.
# OPÇÃO: valores fixos funcionam bem aqui; Enum é útil quando o domínio cresce e precisa de comportamento próprio.

class ItemPedidoCriar(BaseModel):
    """Referência a um produto e sua quantidade ao abrir um pedido."""

    model_config = ConfigDict(populate_by_name=True)

    produto_id: int = Field(gt=0, serialization_alias="produtoId", validation_alias="produtoId")
    quantidade: int = Field(ge=1, le=99, examples=[2])


class ItemPedidoSaida(ItemPedidoCriar):
    nome: str = Field(min_length=2, max_length=100)
    preco_unitario: Decimal = Field(
        gt=0,
        max_digits=10,
        decimal_places=2,
        serialization_alias="precoUnitario",
        validation_alias="precoUnitario",
    )


class PedidoCriar(BaseModel):
    """
    Dados enviados pelo cliente ao criar um pedido; preço e status são calculados pelo servidor.
    
    Restrições:
    - Nome do cliente: apenas letras, espaços e acentuação (2-100 caracteres)
    - Quantidade total de itens deve ser no máximo 999 unidades (quantidade * quantidade)
    """

    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")

    cliente: str = Field(
        min_length=2,
        max_length=100,
        pattern=r"^[a-záàâãéèêíïóôõöúçñ\s]+$",
        examples=["Ana Souza"],
        description="Nome do cliente (apenas letras e espaços)"
    )
    tipo: TipoPedido = "local"
    observacao: str = Field(default="", max_length=500)
    itens: list[ItemPedidoCriar] = Field(min_length=1, max_length=50)

    @model_validator(mode="after")
    def validar_quantidade_total(self):
        """Restrição: quantidade total não pode exceder 999 unidades."""
        quantidade_total = sum(item.quantidade for item in self.itens)
        if quantidade_total > 999:
            raise ValueError("A quantidade total de itens não pode exceder 999 unidades.")
        return self


class PedidoAtualizarStatus(BaseModel):
    model_config = ConfigDict(extra="forbid")
    
    status: StatusPedido


class PedidoSaida(BaseModel):
    """
    Pedido persistido, com valores calculados e histórico mínimo.
    
    Restrições:
    - Total nunca pode ser negativo (mínimo R$ 0,00)
    - Total deve corresponder exatamente à soma dos itens (validação cruzada)
    - Timestamp de criação sempre deve ser anterior ou igual ao de atualização
    """

    model_config = ConfigDict(populate_by_name=True)

    id: int = Field(gt=0, examples=[1])
    numero: int | None = Field(default=None, ge=1, examples=[101])
    cliente: str = Field(min_length=2, max_length=100)
    tipo: TipoPedido = "local"
    observacao: str = ""
    # A lista de IDs é mantida temporariamente para compatibilidade com a rota atual.
    itens: list[ItemPedidoSaida] | list[int] = Field(min_length=1)
    total: Decimal | None = Field(default=None, ge=0, max_digits=10, decimal_places=2)
    status: StatusPedido
    criado_em: datetime | None = Field(default=None, serialization_alias="criadoEm", validation_alias="criadoEm")
    atualizado_em: datetime | None = Field(default=None, serialization_alias="atualizadoEm", validation_alias="atualizadoEm")

    @model_validator(mode="after")
    def validar_total(self):
        """Restrição 1: O total deve corresponder à soma dos itens."""
        if self.total is not None and self.itens and isinstance(self.itens[0], ItemPedidoSaida):
            calculado = sum((item.preco_unitario * item.quantidade for item in self.itens), Decimal("0"))
            if self.total != calculado:
                raise ValueError("O total deve corresponder à soma dos itens.")
        return self

    @model_validator(mode="after")
    def validar_timestamps(self):
        """Restrição 2: Data de criação deve ser anterior ou igual à data de atualização."""
        if self.criado_em is not None and self.atualizado_em is not None:
            if self.criado_em > self.atualizado_em:
                raise ValueError("A data de criação não pode ser posterior à data de atualização.")
        return self
