import { useEffect, useRef, useState } from 'react';
import ControleQuantidade from '../ControleQuantidade/ControleQuantidade';
import EstadoVazio from '../EstadoVazio/EstadoVazio';
import Icone from '../Icone/Icone';
import { TIPOS_PEDIDO } from '../../utilitarios/constantes';
import { formatarMoeda, pluralizar } from '../../utilitarios/formatadores';
import './Carrinho.css';

/**
 * Celular: gaveta que sobe do rodapé. Desktop (>= 1024px): painel fixo na lateral.
 */
export default function Carrinho({
  aberto,
  onFechar,
  itens,
  total,
  quantidadeTotal,
  onAdicionar,
  onRemover,
  onLimpar,
  onEnviar,
  enviando,
}) {
  const [cliente, setCliente] = useState('');
  const [tipo, setTipo] = useState(TIPOS_PEDIDO[0].id);
  const [observacao, setObservacao] = useState('');
  const [erroCliente, setErroCliente] = useState('');
  const campoCliente = useRef(null);

  useEffect(() => {
    if (!aberto) return undefined;
    const aoTeclar = (evento) => {
      if (evento.key === 'Escape') onFechar();
    };
    document.addEventListener('keydown', aoTeclar);
    document.body.classList.add('sem-rolagem');
    return () => {
      document.removeEventListener('keydown', aoTeclar);
      document.body.classList.remove('sem-rolagem');
    };
  }, [aberto, onFechar]);

  async function enviar(evento) {
    evento.preventDefault();
    if (!cliente.trim()) {
      setErroCliente('Informe o nome para chamarmos quando ficar pronto.');
      campoCliente.current?.focus();
      return;
    }
    const enviado = await onEnviar({ cliente, tipo, observacao });
    if (enviado) {
      setCliente('');
      setObservacao('');
      setTipo(TIPOS_PEDIDO[0].id);
    }
  }

  const vazio = itens.length === 0;

  return (
    <>
      <div
        className={`carrinho__fundo ${aberto ? 'carrinho__fundo--visivel' : ''}`}
        onClick={onFechar}
        aria-hidden="true"
      />

      <aside className={`carrinho ${aberto ? 'carrinho--aberto' : ''}`} aria-label="Seu pedido">
        <div className="carrinho__alca" aria-hidden="true" />

        <header className="carrinho__topo">
          <div>
            <h2 className="carrinho__titulo">Seu pedido</h2>
            {!vazio && (
              <span className="carrinho__resumo">{pluralizar(quantidadeTotal, 'item', 'itens')}</span>
            )}
          </div>
          {!vazio && (
            <button type="button" className="botao botao--texto" onClick={onLimpar}>
              Limpar
            </button>
          )}
          <button
            type="button"
            className="botao-icone carrinho__fechar"
            onClick={onFechar}
            aria-label="Fechar pedido"
          >
            <Icone nome="fechar" />
          </button>
        </header>

        {vazio ? (
          <EstadoVazio
            icone="🛒"
            titulo="Nenhum item ainda"
            descricao="Toque no + dos itens do cardápio para montar o pedido."
          />
        ) : (
          <form className="carrinho__formulario" onSubmit={enviar} noValidate>
            <div className="carrinho__rolagem">
              <ul className="carrinho__itens">
                {itens.map(({ produto, quantidade }) => (
                  <li key={produto.id} className="carrinho__item">
                    <img
                      className="carrinho__item-imagem"
                      src={produto.imagem}
                      alt=""
                      onError={(evento) => {
                        evento.currentTarget.style.visibility = 'hidden';
                      }}
                    />
                    <div className="carrinho__item-info">
                      <span className="carrinho__item-nome">{produto.nome}</span>
                      <span className="carrinho__item-preco">
                        {formatarMoeda(produto.preco * quantidade)}
                      </span>
                    </div>
                    <ControleQuantidade
                      quantidade={quantidade}
                      nomeItem={produto.nome}
                      onAumentar={() => onAdicionar(produto)}
                      onDiminuir={() => onRemover(produto.id)}
                    />
                  </li>
                ))}
              </ul>

              <div className="carrinho__campos">
                <label className="carrinho__campo">
                  <span className="carrinho__rotulo">Nome do cliente</span>
                  <input
                    ref={campoCliente}
                    className={`carrinho__entrada ${erroCliente ? 'carrinho__entrada--erro' : ''}`}
                    value={cliente}
                    onChange={(evento) => {
                      setCliente(evento.target.value);
                      if (erroCliente) setErroCliente('');
                    }}
                    placeholder="Ex.: Marina"
                    autoComplete="off"
                    enterKeyHint="send"
                    maxLength={40}
                    aria-invalid={Boolean(erroCliente)}
                    aria-describedby={erroCliente ? 'erro-cliente' : undefined}
                  />
                  {erroCliente && (
                    <span id="erro-cliente" className="carrinho__erro">
                      {erroCliente}
                    </span>
                  )}
                </label>

                <fieldset className="carrinho__campo carrinho__grupo">
                  <legend className="carrinho__rotulo">Consumo</legend>
                  <div className="carrinho__segmentos">
                    {TIPOS_PEDIDO.map((opcao) => (
                      <label
                        key={opcao.id}
                        className={`carrinho__segmento ${tipo === opcao.id ? 'carrinho__segmento--ativo' : ''}`}
                      >
                        <input
                          type="radio"
                          name="tipo"
                          value={opcao.id}
                          checked={tipo === opcao.id}
                          onChange={() => setTipo(opcao.id)}
                        />
                        <span aria-hidden="true">{opcao.icone}</span>
                        {opcao.nome}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <label className="carrinho__campo">
                  <span className="carrinho__rotulo">
                    Observação <small>(opcional)</small>
                  </span>
                  <textarea
                    className="carrinho__entrada"
                    rows={2}
                    value={observacao}
                    onChange={(evento) => setObservacao(evento.target.value)}
                    placeholder="Ex.: sem cebola, ponto da carne..."
                    maxLength={140}
                  />
                </label>
              </div>
            </div>

            <footer className="carrinho__rodape">
              <div className="carrinho__total">
                <span>Total</span>
                <strong>{formatarMoeda(total)}</strong>
              </div>
              <button type="submit" className="botao botao--primario botao--bloco" disabled={enviando}>
                {enviando ? (
                  <>
                    <Icone nome="atualizar" className="girando" /> Enviando...
                  </>
                ) : (
                  <>
                    Enviar pedido <Icone nome="seta" />
                  </>
                )}
              </button>
            </footer>
          </form>
        )}
      </aside>
    </>
  );
}
