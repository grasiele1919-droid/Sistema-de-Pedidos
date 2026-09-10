import Icone from '../Icone/Icone';
import './Aviso.css';

export default function Aviso({ aviso, onFechar }) {
  if (!aviso) return null;

  return (
    <div key={aviso.id} className={`aviso aviso--${aviso.tipo}`} role="status" aria-live="polite">
      <span className="aviso__icone">
        <Icone nome={aviso.tipo === 'erro' ? 'alerta' : 'check'} tamanho={18} />
      </span>
      <span className="aviso__mensagem">{aviso.mensagem}</span>
      {aviso.acao && (
        <button
          type="button"
          className="aviso__acao"
          onClick={() => {
            aviso.acao.onClick();
            onFechar();
          }}
        >
          {aviso.acao.rotulo}
        </button>
      )}
    </div>
  );
}
