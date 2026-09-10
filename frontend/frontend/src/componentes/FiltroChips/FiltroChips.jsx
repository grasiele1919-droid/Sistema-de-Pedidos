import './FiltroChips.css';

/** Lista horizontal de filtros. opcoes: [{ id, rotulo, icone?, contador?, cor? }] */
export default function FiltroChips({ opcoes, selecionada, onSelecionar, rotulo }) {
  return (
    <div className="filtro-chips" role="group" aria-label={rotulo}>
      {opcoes.map((opcao) => {
        const ativa = opcao.id === selecionada;
        return (
          <button
            key={opcao.id}
            type="button"
            className={`filtro-chips__chip ${ativa ? 'filtro-chips__chip--ativa' : ''}`}
            style={opcao.cor ? { '--cor-chip': opcao.cor } : undefined}
            aria-pressed={ativa}
            onClick={() => onSelecionar(opcao.id)}
          >
            {opcao.icone && <span aria-hidden="true">{opcao.icone}</span>}
            {opcao.cor && <span className="filtro-chips__ponto" aria-hidden="true" />}
            {opcao.rotulo}
            {opcao.contador !== undefined && (
              <span className="filtro-chips__contador">{opcao.contador}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
