import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Aviso,
  BarraCarrinho,
  Carregando,
  Carrinho,
  CartaoProduto,
  EstadoVazio,
  FiltroChips,
} from '../../componentes';
import { useAviso } from '../../hooks/useAviso';
import { listarCategorias, listarProdutos } from '../../servicos/cardapioServico';
import { criarPedido } from '../../servicos/pedidosServico';
import './NovoPedido.css';

const TODAS = 'todas';

// OBS: a página busca o cardápio, filtra produtos e envia os dados do carrinho.
// OPÇÃO: useMemo evita refazer o filtro; para listas grandes, considere paginação no servidor.
export default function NovoPedido({ carrinho, onVerPedidos }) {
  const [categorias, setCategorias] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState(TODAS);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const { aviso, mostrarAviso, fecharAviso } = useAviso();

  useEffect(() => {
    let ativo = true;
    Promise.all([listarCategorias(), listarProdutos()])
      .then(([listaCategorias, listaProdutos]) => {
        if (!ativo) return;
        setCategorias(listaCategorias);
        setProdutos(listaProdutos);
      })
      .catch(() => ativo && setErro('Não foi possível carregar o cardápio.'))
      .finally(() => ativo && setCarregando(false));
    return () => {
      ativo = false;
    };
  }, []);

  const fecharCarrinho = useCallback(() => setCarrinhoAberto(false), []);

  const secoes = useMemo(
    () =>
      categorias
        .filter((categoria) => categoriaAtiva === TODAS || categoria.id === categoriaAtiva)
        .map((categoria) => ({
          ...categoria,
          produtos: produtos.filter((produto) => produto.categoriaId === categoria.id),
        }))
        .filter((secao) => secao.produtos.length > 0),
    [categorias, produtos, categoriaAtiva],
  );

  const opcoesFiltro = [
    { id: TODAS, rotulo: 'Todos', icone: '✨' },
    ...categorias.map((categoria) => ({
      id: categoria.id,
      rotulo: categoria.nome,
      icone: categoria.icone,
    })),
  ];

  function selecionarCategoria(id) {
    setCategoriaAtiva(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function enviarPedido(dadosCliente) {
    setEnviando(true);
    try {
      const pedido = await criarPedido({
        ...dadosCliente,
        itens: carrinho.itens.map(({ produto, quantidade }) => ({
          produtoId: produto.id,
          quantidade,
        })),
      });
      carrinho.limpar();
      setCarrinhoAberto(false);
      mostrarAviso(`Pedido #${pedido.numero} enviado para a cozinha!`, {
        acao: { rotulo: 'Ver pedidos', onClick: onVerPedidos },
      });
      return true;
    } catch (falha) {
      mostrarAviso(falha.message, { tipo: 'erro' });
      return false;
    } finally {
      setEnviando(false);
    }
  }

  function renderizarCardapio() {
    if (carregando) return <Carregando texto="Carregando cardápio..." />;
    if (erro) return <EstadoVazio icone="⚠️" titulo={erro} descricao="Tente recarregar a página." />;

    return secoes.map((secao) => (
      <section key={secao.id} className="novo-pedido__secao" aria-labelledby={`secao-${secao.id}`}>
        <h2 id={`secao-${secao.id}`} className="novo-pedido__secao-titulo">
          <span aria-hidden="true">{secao.icone}</span> {secao.nome}
        </h2>
        <div className="novo-pedido__grade">
          {secao.produtos.map((produto) => (
            <CartaoProduto
              key={produto.id}
              produto={produto}
              iconeCategoria={secao.icone}
              quantidade={carrinho.quantidadeDe(produto.id)}
              onAdicionar={() => carrinho.adicionar(produto)}
              onRemover={() => carrinho.remover(produto.id)}
            />
          ))}
        </div>
      </section>
    ));
  }

  return (
    <div className="novo-pedido">
      <section className="novo-pedido__cardapio">
        <div className="novo-pedido__intro">
          <h1 className="titulo-pagina">Cardápio</h1>
          <p className="subtitulo-pagina">Toque no + para montar o pedido.</p>
        </div>

        <div className="novo-pedido__filtros">
          <FiltroChips
            rotulo="Categorias do cardápio"
            opcoes={opcoesFiltro}
            selecionada={categoriaAtiva}
            onSelecionar={selecionarCategoria}
          />
        </div>

        {renderizarCardapio()}
      </section>

      <Carrinho
        aberto={carrinhoAberto}
        onFechar={fecharCarrinho}
        itens={carrinho.itens}
        total={carrinho.total}
        quantidadeTotal={carrinho.quantidadeTotal}
        onAdicionar={carrinho.adicionar}
        onRemover={carrinho.remover}
        onLimpar={carrinho.limpar}
        onEnviar={enviarPedido}
        enviando={enviando}
      />

      {!carrinhoAberto && (
        <BarraCarrinho
          quantidade={carrinho.quantidadeTotal}
          total={carrinho.total}
          onAbrir={() => setCarrinhoAberto(true)}
        />
      )}

      <Aviso aviso={aviso} onFechar={fecharAviso} />
    </div>
  );
}
