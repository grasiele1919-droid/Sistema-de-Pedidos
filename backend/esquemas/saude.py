from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

# OBS: Literal impede que a rota de saúde retorne um status fora do contrato.
# OPÇÃO: resposta mínima é suficiente para estudo; versão e timestamp ajudam em monitoramento real.

class SaudeSaida(BaseModel):
    status: Literal["ok"] = Field(examples=["ok"])
    versao: str | None = Field(default=None, examples=["1.0.0"])
    timestamp: datetime | None = Field(default=None, description="Momento da verificação, em UTC.")
