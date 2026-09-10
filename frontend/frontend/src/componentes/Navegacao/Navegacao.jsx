import Icone from '../Icone/Icone';
import { TELAS } from '../../utilitarios/constantes';
import './Navegacao.css';

const ITENS = [
  { tela: TELAS.NOVO_PEDIDO, rotulo: 'Novo pedido', icone: 'sacola' },
  { tela: TELAS.PEDIDOS, rotulo: 'Pedidos', icone: 'lista' },
];

export default function Navegacao({ telaAtual, onNavegar, quantidadeCarrinho }) {
  return (
    <nav className="navegacao" aria-label="Navegação principal">
      {ITENS.map((item) => {
        const ativo = item.tela === telaAtual;
        const contador = item.tela === TELAS.NOVO_PEDIDO ? quantidadeCarrinho : 0;
        return (
          <button
            key={item.tela}
            type="button"
            className={`navegacao__item ${ativo ? 'navegacao__item--ativo' : ''}`}
            aria-current={ativo ? 'page' : undefined}
            onClick={() => onNavegar(item.tela)}
          >
            <span className="navegacao__icone">
              <Icone nome={item.icone} tamanho={22} />
              {contador > 0 && <span className="navegacao__contador">{contador}</span>}
            </span>
            {item.rotulo}
          </button>
        );
      })}
    </nav>
  );
}
