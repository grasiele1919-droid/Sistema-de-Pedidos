import Icone from '../Icone/Icone';
import './SeletorStatus.css';

/** Usa o <select> nativo: no celular abre o seletor do próprio sistema. */
export default function SeletorStatus({ valor, opcoes, onAlterar, desabilitado, rotulo }) {
  return (
    <label className="seletor-status">
      <span className="visualmente-oculto">{rotulo}</span>
      <select
        className="seletor-status__campo"
        value={valor}
        onChange={(evento) => onAlterar(evento.target.value)}
        disabled={desabilitado}
      >
        {opcoes.map((opcao) => (
          <option key={opcao.id} value={opcao.id}>
            {opcao.nome}
          </option>
        ))}
      </select>
      <Icone nome="baixo" tamanho={16} className="seletor-status__seta" />
    </label>
  );
}
