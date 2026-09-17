from fastapi import APIRouter
from esquemas.saude import SaudeSaida

router = APIRouter()


@router.get("/health", response_model=SaudeSaida)
def health():
    return {"status": "ok"}
