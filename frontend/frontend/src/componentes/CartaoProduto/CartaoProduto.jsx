import { useState } from 'react';
import ControleQuantidade from '../ControleQuantidade/ControleQuantidade';
import Icone from '../Icone/Icone';
import { formatarMoeda } from '../../utilitarios/formatadores';
import './CartaoProduto.css';

export default function CartaoProduto({ produto, iconeCategoria, quantidade, onAdicionar, onRemover }) {
  const [imagemFalhou, setImagemFalhou] = useState(false);
  const noCarrinho = quantidade > 0;

  return (
    <article className={`cartao-produto ${noCarrinho ? 'cartao-produto--selecionado' : ''}`}>
      <div className="cartao-produto__imagem">
        {imagemFalhou ? (
          <span className="cartao-produto__imagem-reserva" aria-hidden="true">
            {iconeCategoria}
          </span>
        ) : (
          <img
            src={produto.imagem}
            alt={produto.nome}
            loading="lazy"
            onError={() => setImagemFalhou(true)}
          />
        )}
        {produto.destaque && <span className="cartao-produto__selo">Mais pedido</span>}
      </div>

      <div className="cartao-produto__info">
        <h3 className="cartao-produto__nome">{produto.nome}</h3>
        <p className="cartao-produto__descricao">{produto.descricao}</p>

        <div className="cartao-produto__rodape">
          <span className="cartao-produto__preco">{formatarMoeda(produto.preco)}</span>
          {noCarrinho ? (
            <ControleQuantidade
              quantidade={quantidade}
              nomeItem={produto.nome}
              onAumentar={onAdicionar}
              onDiminuir={onRemover}
            />
          ) : (
            <button
              type="button"
              className="cartao-produto__adicionar"
              onClick={onAdicionar}
              aria-label={`Adicionar ${produto.nome}`}
            >
              <Icone nome="mais" tamanho={20} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
