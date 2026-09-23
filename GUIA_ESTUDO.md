# Guia rápido de estudo

Este projeto separa cada responsabilidade para facilitar a leitura e a troca de tecnologia.
As observações no código usam duas marcas:

- `OBS:` explica, em uma frase, o motivo daquela parte existir.
- `OPÇÃO:` mostra uma escolha possível para evoluir o projeto.

## Front-end

| Área | Função | Opção de estudo |
| --- | --- | --- |
| `componentes/` | Partes visuais reutilizáveis da interface. | Criar um componente novo ou usar uma biblioteca de interface. |
| `paginas/` | Junta os componentes de cada tela. | Manter hash manual ou trocar por React Router. |
| `hooks/` | Reúne estado e comportamento reutilizável. | Estado local com hooks ou Context/Zustand para projetos maiores. |
| `servicos/` | Isola leitura e gravação dos dados. | Usar o banco simulado ou substituir por `fetch` para a API. |
| `dados/` | Carga inicial do cardápio e dos pedidos. | Manter JSON para estudo ou usar banco de dados. |

## Back-end

| Área | Função | Opção de estudo |
| --- | --- | --- |
| `esquemas/` | Valida os dados de entrada e documenta respostas. | Validar no Pydantic ou delegar regras ao banco. |
| `rotas/` | Define URLs e chama a regra necessária. | Manter dados em memória ou criar uma camada de serviço/repositório. |
| `main.py` | Cria a aplicação e registra as rotas. | Um arquivo simples ou módulos de configuração por ambiente. |

## Ordem sugerida de leitura

1. `frontend/frontend/src/main.jsx` e `App.jsx`.
2. `paginas/NovoPedido/NovoPedido.jsx`.
3. `hooks/useCarrinho.js` e `servicos/pedidosServico.js`.
4. `backend/main.py`, as rotas e os esquemas correspondentes.

OBS: os comentários explicam decisões; eles não alteram o funcionamento da aplicação.
