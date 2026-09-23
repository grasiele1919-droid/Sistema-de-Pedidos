import { useCallback, useEffect, useRef, useState } from 'react';

// OBS: centraliza mensagens temporárias para não repetir temporizadores nas páginas.
// OPÇÃO: hook local é simples; uma biblioteca de notificações atende sistemas maiores.
export function useAviso(duracaoMs = 3500) {
  const [aviso, setAviso] = useState(null);
  const temporizador = useRef();

  const mostrarAviso = useCallback(
    (mensagem, { tipo = 'sucesso', acao } = {}) => {
      clearTimeout(temporizador.current);
      setAviso({ id: Date.now(), mensagem, tipo, acao });
      temporizador.current = setTimeout(() => setAviso(null), duracaoMs);
    },
    [duracaoMs],
  );

  const fecharAviso = useCallback(() => {
    clearTimeout(temporizador.current);
    setAviso(null);
  }, []);

  useEffect(() => () => clearTimeout(temporizador.current), []);

  return { aviso, mostrarAviso, fecharAviso };
}
