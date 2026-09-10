import Icone from '../Icone/Icone';
import { formatarMoeda, pluralizar } from '../../utilitarios/formatadores';
import './BarraCarrinho.css';

export default function BarraCarrinho({ quantidade, total, onAbrir }) {
  if (quantidade === 0) return null;

  return (
    <button type="button" className="barra-carrinho" onClick={onAbrir}>
      <span className="barra-carrinho__icone">
        <Icone nome="sacola" tamanho={20} />
        <span className="barra-carrinho__contador">{quantidade}</span>
      </span>
      <span className="barra-carrinho__texto">
        Ver pedido
        <small>{pluralizar(quantidade, 'item', 'itens')}</small>
      </span>
      <strong className="barra-carrinho__total">{formatarMoeda(total)}</strong>
    </button>
  );
}
