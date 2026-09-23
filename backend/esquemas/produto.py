from decimal import Decimal

from pydantic import AnyHttpUrl, BaseModel, ConfigDict, Field


class ProdutoCriar(BaseModel):
    """Dados de catálogo usados para criar um produto."""

    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")

    nome: str = Field(min_length=2, max_length=100, examples=["Brasa Clássico"])
    descricao: str | None = Field(default=None, max_length=500)
    preco: Decimal = Field(gt=0, max_digits=10, decimal_places=2, examples=[29.90])
    categoria: str = Field(min_length=2, max_length=60, examples=["lanches"])
    imagem: AnyHttpUrl | None = None
    destaque: bool = False
    disponivel: bool = True


class ProdutoAtualizar(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")

    nome: str | None = Field(default=None, min_length=2, max_length=100)
    descricao: str | None = Field(default=None, max_length=500)
    preco: Decimal | None = Field(default=None, gt=0, max_digits=10, decimal_places=2)
    categoria: str | None = Field(default=None, min_length=2, max_length=60)
    imagem: AnyHttpUrl | None = None
    destaque: bool | None = None
    disponivel: bool | None = None


class ProdutoSaida(ProdutoCriar):
    id: int = Field(gt=0, examples=[1])
