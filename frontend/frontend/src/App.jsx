import { useEffect, useState } from 'react';
import { Cabecalho, Navegacao } from './componentes';
import { useCarrinho } from './hooks/useCarrinho';
import NovoPedido from './paginas/NovoPedido/NovoPedido';
import Pedidos from './paginas/Pedidos/Pedidos';
import { TELAS } from './utilitarios/constantes';

// OBS: App controla a tela ativa e compartilha o carrinho entre as páginas.
// OPÇÃO: usar hash evita dependência; React Router é a alternativa em aplicações maiores.
// Navegação simples por hash (#/pedidos) para não precisar de biblioteca de rotas.
function telaDaUrl() {
  return window.location.hash === '#/pedidos' ? TELAS.PEDIDOS : TELAS.NOVO_PEDIDO;
}

export default function App() {
  const [tela, setTela] = useState(telaDaUrl);
  // O carrinho fica aqui para não se perder ao trocar de tela.
  const carrinho = useCarrinho();

  useEffect(() => {
    const aoMudarHash = () => {
      setTela(telaDaUrl());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', aoMudarHash);
    return () => window.removeEventListener('hashchange', aoMudarHash);
  }, []);

  function navegar(novaTela) {
    window.location.hash = novaTela === TELAS.PEDIDOS ? '/pedidos' : '/';
  }

  return (
    <>
      <Cabecalho>
        <Navegacao
          telaAtual={tela}
          onNavegar={navegar}
          quantidadeCarrinho={carrinho.quantidadeTotal}
        />
      </Cabecalho>

      <main className="app__conteudo">
        {tela === TELAS.PEDIDOS ? (
          <Pedidos onNovoPedido={() => navegar(TELAS.NOVO_PEDIDO)} />
        ) : (
          <NovoPedido carrinho={carrinho} onVerPedidos={() => navegar(TELAS.PEDIDOS)} />
        )}
      </main>
    </>
  );
}
