# Regras do projeto para a IA

Atualizado até a **aula 2** da UC4. Salve na raiz do seu repositório com o nome `REGRAS.md`,
por cima do arquivo da aula anterior. Só vale a versão mais nova.

## O projeto

- Duas pastas na raiz: `backend/`, com a API em FastAPI, e `frontend/`, com o React da UC5.
- O `frontend/` não é reescrito nesta unidade.
- Código, nomes de variáveis, comentários e respostas sempre em português do Brasil.
- Persona atendida: descreva aqui, em uma linha, a sua e a dor dela.

## O que já foi visto, e pode usar

- `venv`, `pip install "fastapi[standard]"`, `fastapi dev main.py`, `/docs`.
- Função de rota com `def` comum, devolvendo dicionário ou lista.
- Os quatro métodos: `@app.get`, `@app.post`, `@app.put`, `@app.delete`.
- Status codes: 200, 201, 404, 422.
- Parâmetro de caminho e parâmetro de consulta, sempre com tipo declarado.
- Filtro de lista com laço `for` e `append`, ou com compreensão de lista.
- `HTTPException` com 404 quando o recurso não existe.
- `APIRouter`, com as rotas divididas em mais de um arquivo.

## O que ainda não foi visto, e não deve aparecer

- Banco de dados, SQL, SQLAlchemy ou qualquer ORM. Os dados ficam em lista na memória.
- Pydantic, `BaseModel`, `response_model`, validação de entrada.
- Separação em camadas, `Depends`, arquivo `.env`.
- Autenticação, login, JWT, hash de senha.
- CORS.
- `async def`. Use `def` normal.

## Como escrever o código

- Todo código que você gerar vem comentado em português. Um comentário curto acima de cada rota,
  função ou bloco, dizendo o que ele faz e por que está ali.
- O comentário explica a intenção. Não repita o que a linha já diz: `# retorna a lista` em cima
  de `return lista` não ensina nada.
- Na primeira vez que aparecer algo novo para mim (um decorador, um tipo, um parâmetro), explique
  em uma linha, no próprio comentário.
- Os comentários ficam no código que eu entrego. É por eles que eu estudo antes da arguição.
- Depois do código, escreva um resumo curto: quais arquivos você criou ou alterou, o que mudou em
  cada um e como eu testo, com a URL ou o comando e o que deve aparecer na tela.

## Como responder

- Uma coisa por vez. Não adiante etapa que eu não pedi.
- Se a tarefa exigir algo da lista de cima, avise antes de escrever código e proponha a versão simples.
- Justifique cada decisão em uma linha. Eu preciso conseguir defender esse código na arguição.
