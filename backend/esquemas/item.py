from decimal import Decimal

from pydantic import AnyHttpUrl, BaseModel, ConfigDict, Field

# OBS: Decimal evita imprecisão comum de float em valores monetários.
# OPÇÃO: Decimal é recomendado para preços; inteiro em centavos também é uma alternativa segura.

class ItemCriar(BaseModel):
    """Produto exibido no cardápio público."""

    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")

    nome: str = Field(min_length=2, max_length=100, examples=["Pizza Marguerita"])
    descricao: str | None = Field(default=None, max_length=500)
    preco: Decimal = Field(gt=0, max_digits=10, decimal_places=2, examples=[39.90])
    categoria: str = Field(min_length=2, max_length=60, examples=["prato"])
    imagem: AnyHttpUrl | None = Field(default=None, description="URL da imagem do item.")
    destaque: bool = False
    disponivel: bool = True


class ItemAtualizar(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")

    nome: str | None = Field(default=None, min_length=2, max_length=100)
    descricao: str | None = Field(default=None, max_length=500)
    preco: Decimal | None = Field(default=None, gt=0, max_digits=10, decimal_places=2)
    categoria: str | None = Field(default=None, min_length=2, max_length=60)
    imagem: AnyHttpUrl | None = None
    destaque: bool | None = None
    disponivel: bool | None = None


class ItemSaida(ItemCriar):
    id: int = Field(gt=0, examples=[1])
