from pydantic import BaseModel, ConfigDict, Field

# OBS: Field documenta limites e exemplos exibidos automaticamente no Swagger.
# OPÇÃO: validação no esquema melhora a resposta ao cliente; regras exclusivas do banco ficam na persistência.

class CategoriaCriar(BaseModel):
    """Dados necessários para cadastrar uma categoria do cardápio."""

    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")

    nome: str = Field(min_length=2, max_length=60, examples=["Lanches"])
    icone: str | None = Field(default=None, max_length=10, examples=["🍔"])
    ordem: int = Field(default=0, ge=0, description="Posição de exibição no cardápio.")
    ativa: bool = Field(default=True)


class CategoriaAtualizar(BaseModel):
    """Campos que podem ser alterados em uma categoria."""

    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")

    nome: str | None = Field(default=None, min_length=2, max_length=60)
    icone: str | None = Field(default=None, max_length=10)
    ordem: int | None = Field(default=None, ge=0)
    ativa: bool | None = None


class CategoriaSaida(BaseModel):
    id: int = Field(gt=0, examples=[1])
    nome: str = Field(min_length=2, max_length=60)
    icone: str | None = None
    ordem: int = Field(default=0, ge=0)
    ativa: bool = True
