/**
 * Banco de dados simulado.
 *
 * Os arquivos JSON de `src/dados` funcionam como a carga inicial das "tabelas".
 * Como o navegador não consegue gravar arquivos, toda alteração é persistida
 * no localStorage. Os serviços respondem com Promises e um pequeno atraso para
 * imitar uma chamada HTTP — trocar por `fetch` no futuro não muda as telas.
 */
import categorias from '../dados/categorias.json';
import produtos from '../dados/produtos.json';
import pedidos from '../dados/pedidos.json';
import statusPedido from '../dados/statusPedido.json';

// OBS: este módulo imita uma API para permitir estudar o front-end sem servidor ativo.
// OPÇÃO: troque as funções deste arquivo por fetch para conectar a API FastAPI.
const PREFIXO = 'brasa-burger:';
const LATENCIA_MS = 350;

const tabelasIniciais = { categorias, produtos, pedidos, statusPedido };

// Usada só quando o localStorage não está disponível (ex.: navegação privada).
const memoria = {};

export function lerTabela(nome) {
  try {
    const salvo = localStorage.getItem(PREFIXO + nome);
    if (salvo) return JSON.parse(salvo);
  } catch {
    // segue com a memória / carga inicial
  }
  return structuredClone(memoria[nome] ?? tabelasIniciais[nome]);
}

export function gravarTabela(nome, registros) {
  memoria[nome] = registros;
  try {
    localStorage.setItem(PREFIXO + nome, JSON.stringify(registros));
  } catch {
    // sem localStorage os dados ficam só na memória desta aba
  }
}

/** Avisa quando outra aba altera a tabela (ex.: cozinha e caixa abertos juntos). */
export function observarTabela(nome, aoAlterar) {
  const aoMudarStorage = (evento) => {
    if (evento.key === PREFIXO + nome) aoAlterar();
  };
  window.addEventListener('storage', aoMudarStorage);
  return () => window.removeEventListener('storage', aoMudarStorage);
}

export function restaurarBanco() {
  Object.keys(tabelasIniciais).forEach((nome) => {
    delete memoria[nome];
    try {
      localStorage.removeItem(PREFIXO + nome);
    } catch {
      // nada a limpar
    }
  });
}

export function responder(dados) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(structuredClone(dados)), LATENCIA_MS);
  });
}

export function falhar(mensagem) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(mensagem)), LATENCIA_MS);
  });
}
