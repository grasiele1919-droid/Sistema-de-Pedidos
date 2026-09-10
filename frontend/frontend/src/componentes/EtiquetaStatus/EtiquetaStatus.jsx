import './EtiquetaStatus.css';

export default function EtiquetaStatus({ status }) {
  if (!status) return null;

  return (
    <span className="etiqueta-status" style={{ '--cor-status': status.cor }}>
      <span className="etiqueta-status__ponto" aria-hidden="true" />
      {status.nome}
    </span>
  );
}
