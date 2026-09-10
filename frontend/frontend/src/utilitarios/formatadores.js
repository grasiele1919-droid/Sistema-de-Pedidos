const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const hora = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' });
const dia = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' });

export function formatarMoeda(valor) {
  return moeda.format(valor);
}

export function formatarDataHora(iso) {
  const data = new Date(iso);
  const ehHoje = data.toDateString() === new Date().toDateString();
  return `${ehHoje ? 'Hoje' : dia.format(data)}, ${hora.format(data)}`;
}

export function pluralizar(quantidade, singular, plural) {
  return `${quantidade} ${quantidade === 1 ? singular : plural}`;
}
