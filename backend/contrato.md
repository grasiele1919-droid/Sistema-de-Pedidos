# Contrato da API — Sistema de Pedidos

**URL base local:** `http://127.0.0.1:8000`

## Cardápio

### Listar itens

`GET /itens`

Parâmetro de consulta opcional:

| Parâmetro | Tipo | Descrição |
| --- | --- | --- |
| `categoria` | texto | Filtra os itens pela categoria. |

Exemplos:

```http
GET /itens
GET /itens?categoria=bebida
```

Resposta `200`:

```json
[
  {
    "id": 1,
    "nome": "Pizza Marguerita",
    "preco": 39.9,
    "categoria": "prato"
  }
]
```

### Consultar item por ID

`GET /itens/{item_id}`

| Parâmetro de caminho | Tipo | Descrição |
| --- | --- | --- |
| `item_id` | inteiro | Identificador do item. |

Exemplo: `GET /itens/1`

Resposta `200`:

```json
{
  "id": 1,
  "nome": "Pizza Marguerita",
  "preco": 39.9,
  "categoria": "prato"
}
```

Resposta `404` quando o item não existe:

```json
{
  "detail": "Item não encontrado"
}
```

Resposta `422` quando `item_id` não é um número inteiro.

## Pedidos

### Listar pedidos

`GET /pedidos`

Resposta `200`:

```json
[
  {
    "id": 1,
    "cliente": "Ana Souza",
    "itens": [1, 2],
    "status": "recebido"
  }
]
```

## Saúde da API

### Verificar disponibilidade

`GET /health`

Resposta `200`:

```json
{
  "status": "ok"
}
```

## Documentação interativa

A documentação Swagger gerada pelo FastAPI está em `http://127.0.0.1:8000/docs`.
