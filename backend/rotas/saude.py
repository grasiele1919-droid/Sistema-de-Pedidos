from fastapi import APIRouter
from esquemas.saude import SaudeSaida

# OBS: health confirma que a API responde; monitores podem chamar esta URL periodicamente.
# OPÇÃO: verificar só a API é rápido; também verificar banco e serviços externos é mais completo.
router = APIRouter()


@router.get("/health", response_model=SaudeSaida)
def health():
    return {"status": "ok"}
