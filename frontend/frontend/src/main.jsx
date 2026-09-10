import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Estilos globais primeiro, para os estilos dos componentes poderem sobrescrevê-los.
import './estilos/global.css';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
