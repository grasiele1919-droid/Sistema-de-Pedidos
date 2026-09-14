from fastapi import FastAPI
app = FastAPI(title="Cardápio Digital")
@app.get("/health")
def health():
    return {"status": "ok"}