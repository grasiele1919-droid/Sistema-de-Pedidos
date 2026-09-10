import './Cabecalho.css';

export default function Cabecalho({ children }) {
  return (
    <header className="cabecalho">
      <div className="cabecalho__conteudo">
        <div className="cabecalho__marca">
          <span className="cabecalho__logo" aria-hidden="true">
            🍔
          </span>
          <div>
            <strong className="cabecalho__nome">Brasa Burger</strong>
            <span className="cabecalho__slogan">Hamburgueria artesanal</span>
          </div>
        </div>
        {children}
      </div>
    </header>
  );
}
