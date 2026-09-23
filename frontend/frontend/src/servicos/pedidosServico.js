import { falhar, gravarTabela, lerTabela, observarTabela, responder } from './bancoSimulado';

const API_URL = 'http://127.0.0.1:8000';

// OBS: regras do pedido ficam no serviço para que as páginas não calculem dados críticos.
// OPÇÃO: validar no navegador para estudo ou repetir a validação no servidor para segurança.
const arredondar = (valor) => Math.round(valor * 100) / 100;

// GET /status-pedido
export function listarStatus() {
  const status = lerTabela('statusPedido').sort((a, b) => a.ordem - b.ordem);
  return responder(status);
}

// GET /pedidos (mais recentes primeiro)
export function listarPedidos() {
  return fetch(`${API_URL}/pedidos`)
    .then((res) => res.json())
    .then((pedidos) =>
      pedidos.sort(
        (a, b) => new Date(b.criadoEm) - new Date(a.criadoEm),
      ),
    )
    .catch((erro) => {
      console.error('Erro ao listar pedidos:', erro);
      throw erro;
    });
}

/**
 * POST /pedidos
 * Recebe só ids e quantidades: preço e total são calculados no servidor.
 */
export function criarPedido({ cliente, tipo, observacao, itens }) {
  const nomeCliente = cliente?.trim();
  if (!nomeCliente) return falhar('Informe o nome do cliente.');
  if (!itens?.length) return falhar('Adicione ao menos um item ao pedido.');

  const payload = {
    cliente: nomeCliente,
    tipo: tipo || 'local',
    observacao: observacao?.trim() ?? '',
    itens,
  };

  return fetch(`${API_URL}/pedidos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((erro) => {
          throw new Error(erro.detail || 'Erro ao criar pedido');
        });
      }
      return res.json();
    })
    .catch((erro) => {
      console.error('Erro ao criar pedido:', erro);
      throw erro;
    });
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
