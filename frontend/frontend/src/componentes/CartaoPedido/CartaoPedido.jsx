import EtiquetaStatus from '../EtiquetaStatus/EtiquetaStatus';
import Icone from '../Icone/Icone';
import SeletorStatus from '../SeletorStatus/SeletorStatus';
import { buscarTipoPedido } from '../../utilitarios/constantes';
import { formatarDataHora, formatarMoeda } from '../../utilitarios/formatadores';
import './CartaoPedido.css';

export default function CartaoPedido({ pedido, listaStatus, onAlterarStatus, atualizando }) {
  const statusAtual = listaStatus.find((status) => status.id === pedido.status);
  const tipo = buscarTipoPedido(pedido.tipo);

  return (
    <article
      className={`cartao-pedido ${statusAtual?.finalizado ? 'cartao-pedido--finalizado' : ''}`}
      style={{ '--cor-status': statusAtual?.cor }}
    >
      <header className="cartao-pedido__topo">
        <div>
          <span className="cartao-pedido__numero">Pedido #{pedido.numero}</span>
          <h3 className="cartao-pedido__cliente">{pedido.cliente}</h3>
        </div>
        <EtiquetaStatus status={statusAtual} />
      </header>

      <div className="cartao-pedido__meta">
        <span>
          <Icone nome="relogio" tamanho={14} /> {formatarDataHora(pedido.criadoEm)}
        </span>
        <span>
          {tipo.icone} {tipo.nome}
        </span>
      </div>

      <ul className="cartao-pedido__itens">
        {pedido.itens.map((item) => (
          <li key={item.produtoId}>
            <span className="cartao-pedido__quantidade">{item.quantidade}x</span>
            <span className="cartao-pedido__item-nome">{item.nome}</span>
            <span className="cartao-pedido__item-preco">
              {formatarMoeda(item.precoUnitario * item.quantidade)}
            </span>
          </li>
        ))}
      </ul>

      {pedido.observacao && <p className="cartao-pedido__observacao">📝 {pedido.observacao}</p>}

      <div className="cartao-pedido__total">
        <span>Total</span>
        <strong>{formatarMoeda(pedido.total)}</strong>
      </div>

      <div className="cartao-pedido__acoes">
        <SeletorStatus
          rotulo={`Status do pedido ${pedido.numero}`}
          valor={pedido.status}
          opcoes={listaStatus}
          onAlterar={(novoStatus) => onAlterarStatus(pedido, novoStatus)}
          desabilitado={atualizando}
        />
        {statusAtual?.proximo && (
          <button
            type="button"
            className="botao botao--primario cartao-pedido__avancar"
            onClick={() => onAlterarStatus(pedido, statusAtual.proximo)}
            disabled={atualizando}
          >
            {statusAtual.acaoAvancar}
            <Icone nome={atualizando ? 'atualizar' : 'seta'} tamanho={18} className={atualizando ? 'girando' : undefined} />
          </button>
        )}
      </div>
    </article>
  );
}
