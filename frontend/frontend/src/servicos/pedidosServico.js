import { falhar, gravarTabela, lerTabela, observarTabela, responder } from './bancoSimulado';

const arredondar = (valor) => Math.round(valor * 100) / 100;

// GET /status-pedido
export function listarStatus() {
  const status = lerTabela('statusPedido').sort((a, b) => a.ordem - b.ordem);
  return responder(status);
}

// GET /pedidos (mais recentes primeiro)
export function listarPedidos() {
  const pedidos = lerTabela('pedidos').sort(
    (a, b) => new Date(b.criadoEm) - new Date(a.criadoEm),
  );
  return responder(pedidos);
}

/**
 * POST /pedidos
 * Recebe só ids e quantidades: preço e total são calculados a partir da
 * tabela de produtos, como um back-end de verdade faria.
 */
export function criarPedido({ cliente, tipo, observacao, itens }) {
  const nomeCliente = cliente?.trim();
  if (!nomeCliente) return falhar('Informe o nome do cliente.');
  if (!itens?.length) return falhar('Adicione ao menos um item ao pedido.');

  const produtos = lerTabela('produtos');
  const itensPedido = [];
  for (const { produtoId, quantidade } of itens) {
    const produto = produtos.find((p) => p.id === produtoId && p.disponivel);
    if (!produto) return falhar('Um dos itens não está mais disponível.');
    itensPedido.push({
      produtoId,
      nome: produto.nome,
      precoUnitario: produto.preco,
      quantidade,
    });
  }

  const pedidos = lerTabela('pedidos');
  const agora = new Date().toISOString();
  const novoPedido = {
    id: Math.max(0, ...pedidos.map((p) => p.id)) + 1,
    numero: Math.max(100, ...pedidos.map((p) => p.numero)) + 1,
    cliente: nomeCliente,
    tipo,
    observacao: observacao?.trim() ?? '',
    itens: itensPedido,
    total: arredondar(
      itensPedido.reduce((soma, item) => soma + item.precoUnitario * item.quantidade, 0),
    ),
    status: 'recebido',
    criadoEm: agora,
    atualizadoEm: agora,
  };

  gravarTabela('pedidos', [...pedidos, novoPedido]);
  return responder(novoPedido);
}

// PATCH /pedidos/:id
export function atualizarStatusPedido(id, status) {
  const statusValido = lerTabela('statusPedido').some((s) => s.id === status);
  if (!statusValido) return falhar('Status inválido.');

  const pedidos = lerTabela('pedidos');
  const pedido = pedidos.find((p) => p.id === id);
  if (!pedido) return falhar('Pedido não encontrado.');

  const atualizado = { ...pedido, status, atualizadoEm: new Date().toISOString() };
  gravarTabela(
    'pedidos',
    pedidos.map((p) => (p.id === id ? atualizado : p)),
  );
  return responder(atualizado);
}

export function observarPedidos(aoAlterar) {
  return observarTabela('pedidos', aoAlterar);
}
