// OBS: constantes evitam textos e valores repetidos em vários componentes.
// OPÇÃO: manter local é didático; configurações da API permitem alterar sem publicar o front-end.
export const TELAS = {
  NOVO_PEDIDO: 'novo-pedido',
  PEDIDOS: 'pedidos',
};

export const TIPOS_PEDIDO = [
  { id: 'local', nome: 'Comer aqui', icone: '🍽️' },
  { id: 'viagem', nome: 'Para viagem', icone: '🛍️' },
];

export function buscarTipoPedido(id) {
  return TIPOS_PEDIDO.find((tipo) => tipo.id === id) ?? TIPOS_PEDIDO[0];
}
