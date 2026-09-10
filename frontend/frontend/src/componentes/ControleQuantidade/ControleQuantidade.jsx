import Icone from '../Icone/Icone';
import './ControleQuantidade.css';

export default function ControleQuantidade({ quantidade, onAumentar, onDiminuir, nomeItem }) {
  return (
    <div className="controle-quantidade">
      <button
        type="button"
        className="controle-quantidade__botao"
        onClick={onDiminuir}
        aria-label={quantidade === 1 ? `Remover ${nomeItem}` : `Diminuir ${nomeItem}`}
      >
        <Icone nome={quantidade === 1 ? 'lixeira' : 'menos'} tamanho={16} />
      </button>
      <span className="controle-quantidade__valor" aria-live="polite">
        {quantidade}
      </span>
      <button
        type="button"
        className="controle-quantidade__botao controle-quantidade__botao--mais"
        onClick={onAumentar}
        aria-label={`Adicionar mais ${nomeItem}`}
      >
        <Icone nome="mais" tamanho={16} />
      </button>
    </div>
  );
}
