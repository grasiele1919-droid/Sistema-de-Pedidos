import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Estilos globais primeiro, para os estilos dos componentes poderem sobrescrevê-los.
import './estilos/global.css';
import App from './App';

// OBS: este é o ponto de entrada do React; ele monta a aplicação no elemento #root.
// OPÇÃO: StrictMode ajuda no estudo; em produção ele pode ser removido se necessário.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
