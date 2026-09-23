import { responder } from './bancoSimulado';

const API_URL = 'http://127.0.0.1:8000';

// OBS: o serviço separa a busca de dados da interface visual.
// OPÇÃO: manter a simulação local ou fazer GET para o endpoint do back-end.

// GET /categorias
export function listarCategorias() {
  return fetch(`${API_URL}/categorias`)
    .then((res) => res.json())
    .catch((erro) => {
      console.error('Erro ao listar categorias:', erro);
      throw erro;
    });
}

// GET /produtos?disponivel=true
export function listarProdutos() {
  return fetch(`${API_URL}/produtos`)
    .then((res) => res.json())
    .catch((erro) => {
      console.error('Erro ao listar produtos:', erro);
      throw erro;
    });
}
