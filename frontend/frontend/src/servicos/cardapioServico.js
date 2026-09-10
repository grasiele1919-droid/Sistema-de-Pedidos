import { lerTabela, responder } from './bancoSimulado';

// GET /categorias
export function listarCategorias() {
  const categorias = lerTabela('categorias').sort((a, b) => a.ordem - b.ordem);
  return responder(categorias);
}

// GET /produtos?disponivel=true
export function listarProdutos() {
  const produtos = lerTabela('produtos').filter((produto) => produto.disponivel);
  return responder(produtos);
}
