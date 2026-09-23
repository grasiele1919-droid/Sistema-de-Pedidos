import sys
from pathlib import Path

# Adiciona o diretório backend ao path para permitir imports absolutos
sys.path.insert(0, str(Path(__file__).parent))

from rotas.main import app

# OBS: este arquivo permite que o uvicorn encontre a aplicação.
# OPÇÃO: você pode executar (uvicorn rotas.main:app) diretamente.

__all__ = ["app"]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

