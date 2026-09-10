import { useCallback, useEffect, useState } from 'react';
import { Aviso, Carregando, CartaoPedido, EstadoVazio, FiltroChips, Icone } from '../../componentes';
import { useAviso } from '../../hooks/useAviso';
import { restaurarBanco } from '../../servicos/bancoSimulado';
import {
  atualizarStatusPedido,
  listarPedidos,
  listarStatus,
  observarPedidos,
} from '../../servicos/pedidosServico';
import { pluralizar } from '../../utilitarios/formatadores';
import './Pedidos.css';

const TODOS = 'todos';

export default function Pedidos({ onNovoPedido }) {
  const [pedidos, setPedidos] = useState([]);
  const [listaStatus, setListaStatus] = useState([]);
  const [filtro, setFiltro] = useState(TODOS);
  const [carregando, setCarregando] = useState(true);
  const [recarregando, setRecarregando] = useState(false);
  const [idsAtualizando, setIdsAtualizando] = useState([]);
  const { aviso, mostrarAviso, fecharAviso } = useAviso();

  const carregar = useCallback(async () => {
    setRecarregando(true);
    try {
      const [status, listaPedidos] = await Promise.all([listarStatus(), listarPedidos()]);
      setListaStatus(status);
      setPedidos(listaPedidos);
    } catch {
      mostrarAviso('Não foi possível carregar os pedidos.', { tipo: 'erro' });
    } finally {
      setCarregando(false);
      setRecarregando(false);
    }
  }, [mostrarAviso]);

  // Carrega ao abrir a tela e recarrega se outra aba criar/alterar pedidos.
  useEffect(() => {
    carregar();
    return observarPedidos(carregar);
  }, [carregar]);

  async function alterarStatus(pedido, novoStatus) {
    if (novoStatus === pedido.status) return;
    setIdsAtualizando((ids) => [...ids, pedido.id]);
    try {
      const atualizado = await atualizarStatusPedido(pedido.id, novoStatus);
      setPedidos((atuais) => atuais.map((p) => (p.id === atualizado.id ? atualizado : p)));
      const nomeStatus = listaStatus.find((status) => status.id === novoStatus)?.nome;
      mostrarAviso(`Pedido #${pedido.numero}: ${nomeStatus}`);
    } catch (falha) {
      mostrarAviso(falha.message, { tipo: 'erro' });
    } finally {
      setIdsAtualizando((ids) => ids.filter((id) => id !== pedido.id));
    }
  }

  async function restaurarExemplos() {
    if (!window.confirm('Apagar os pedidos feitos e voltar aos dados de exemplo?')) return;
    restaurarBanco();
    setFiltro(TODOS);
    await carregar();
    mostrarAviso('Dados de exemplo restaurados.');
  }

  const finalizados = new Set(listaStatus.filter((s) => s.finalizado).map((s) => s.id));
  const emAndamento = pedidos.filter((pedido) => !finalizados.has(pedido.status)).length;
  const pedidosFiltrados =
    filtro === TODOS ? pedidos : pedidos.filter((pedido) => pedido.status === filtro);

  const opcoesFiltro = [
    { id: TODOS, rotulo: 'Todos', contador: pedidos.length },
    ...listaStatus.map((status) => ({
      id: status.id,
      rotulo: status.nome,
      cor: status.cor,
      contador: pedidos.filter((pedido) => pedido.status === status.id).length,
    })),
  ];

  function renderizarLista() {
    if (carregando) return <Carregando texto="Buscando pedidos..." />;

    if (pedidos.length === 0) {
      return (
        <EstadoVazio icone="🧾" titulo="Nenhum pedido ainda" descricao="Os pedidos enviados aparecem aqui.">
          <button type="button" className="botao botao--primario" onClick={onNovoPedido}>
            Fazer um pedido
          </button>
        </EstadoVazio>
      );
    }

    if (pedidosFiltrados.length === 0) {
      return (
        <EstadoVazio icone="🔍" titulo="Nenhum pedido com esse status">
          <button type="button" className="botao botao--secundario" onClick={() => setFiltro(TODOS)}>
            Ver todos
          </button>
        </EstadoVazio>
      );
    }

    return (
      <div className="pedidos__lista">
        {pedidosFiltrados.map((pedido) => (
          <CartaoPedido
            key={pedido.id}
            pedido={pedido}
            listaStatus={listaStatus}
            onAlterarStatus={alterarStatus}
            atualizando={idsAtualizando.includes(pedido.id)}
          />
        ))}
      </div>
    );
  }

  return (
    <section className="pedidos">
      <div className="pedidos__topo">
        <div>
          <h1 className="titulo-pagina">Pedidos</h1>
          <p className="subtitulo-pagina">
            {emAndamento} em andamento · {pluralizar(pedidos.length, 'pedido', 'pedidos')} no total
          </p>
        </div>
        <button
          type="button"
          className="botao-icone"
          onClick={carregar}
          disabled={recarregando}
          aria-label="Atualizar pedidos"
        >
          <Icone nome="atualizar" className={recarregando ? 'girando' : undefined} />
        </button>
      </div>

      <div className="pedidos__filtros">
        <FiltroChips
          rotulo="Filtrar por status"
          opcoes={opcoesFiltro}
          selecionada={filtro}
          onSelecionar={setFiltro}
        />
      </div>

      {renderizarLista()}

      {!carregando && (
        <div className="pedidos__rodape">
          <button type="button" className="botao botao--texto" onClick={restaurarExemplos}>
            Restaurar dados de exemplo
          </button>
        </div>
      )}

      <Aviso aviso={aviso} onFechar={fecharAviso} />
    </section>
  );
}
