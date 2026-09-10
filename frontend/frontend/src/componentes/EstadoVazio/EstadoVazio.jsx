import './EstadoVazio.css';

export default function EstadoVazio({ icone, titulo, descricao, children }) {
  return (
    <div className="estado-vazio">
      <span className="estado-vazio__icone" aria-hidden="true">
        {icone}
      </span>
      <strong className="estado-vazio__titulo">{titulo}</strong>
      {descricao && <p className="estado-vazio__descricao">{descricao}</p>}
      {children}
    </div>
  );
}
