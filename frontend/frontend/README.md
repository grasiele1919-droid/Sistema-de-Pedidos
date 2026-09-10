# Brasa Burger — Sistema de Pedidos

Front-end em React (Vite) para uma hamburgueria: montar pedidos pelo cardápio digital e acompanhar/alterar o status dos pedidos. Pensado primeiro para celular. **Não tem back-end**: os dados vêm de arquivos `.json` e as alterações ficam salvas no navegador.

## Como rodar

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173` (o `--host` também expõe na rede local, então dá para abrir no celular pelo IP da máquina).

## Telas

- **Novo pedido** (`#/`): cardápio com filtro por categoria. Toque no **+** para adicionar; a barra laranja abre o carrinho, onde você informa o nome do cliente, escolhe "Comer aqui" ou "Para viagem" e envia. No desktop o carrinho fica fixo na lateral.
- **Pedidos** (`#/pedidos`): todos os pedidos com status, filtro por status, botão para avançar ao próximo status (Recebido → Em preparo → Pronto → Entregue) e seletor para escolher qualquer status (inclusive Cancelado).

## Estrutura

```
src/
├── componentes/        # Componentes visuais reutilizáveis (um por pasta: .jsx + .css)
│   └── index.js        # Exporta todos os componentes
├── paginas/            # As duas telas: NovoPedido e Pedidos
├── dados/              # "Banco de dados" em JSON (carga inicial)
│   ├── categorias.json
│   ├── produtos.json
│   ├── pedidos.json
│   └── statusPedido.json
├── servicos/           # Simulação da API
│   ├── bancoSimulado.js     # Lê os JSON, persiste no localStorage, simula latência
│   ├── cardapioServico.js   # GET /categorias, GET /produtos
│   └── pedidosServico.js    # GET /pedidos, POST /pedidos, PATCH /pedidos/:id
├── hooks/              # useCarrinho, useAviso
├── utilitarios/        # Formatadores (moeda, data) e constantes
└── estilos/global.css  # Variáveis de tema e estilos base
```

## Como funciona a simulação do banco

- Os arquivos em `src/dados` são a carga inicial das "tabelas".
- O navegador não consegue gravar arquivos, então pedidos novos e mudanças de status são salvos no `localStorage` (chaves `brasa-burger:*`).
- Toda função de serviço devolve uma `Promise` com ~350 ms de atraso, como uma chamada HTTP. Para ligar num back-end real, basta trocar o corpo das funções em `servicos/` por `fetch`; as telas não mudam.
- Com duas abas abertas (ex.: caixa e cozinha), a tela de Pedidos se atualiza sozinha quando a outra aba cria ou altera um pedido.
- O botão **Restaurar dados de exemplo**, no fim da tela de Pedidos, limpa o `localStorage` e volta ao conteúdo dos JSON.

As imagens do cardápio vêm do Unsplash (URLs em `produtos.json`). Se alguma não carregar, o cartão mostra o emoji da categoria.
