import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initGlobalTactileAudio } from './utils/audioEffects';

// Ignore harmless Vite HMR WebSocket disconnect notifications in sandbox environment
if (typeof window !== 'undefined') {
  const origOnError = window.onerror;
  window.onerror = function(msg, url, line, col, error) {
    const strMsg = String(msg || '');
    if (strMsg.includes('WebSocket') || strMsg.includes('closed without opened') || String(url).includes('vite')) {
      return true;
    }
    if (typeof origOnError === 'function') {
      return origOnError.apply(this, arguments as any);
    }
    return false;
  };

  window.addEventListener('error', (event) => {
    if (
      event.message?.includes('WebSocket') ||
      event.message?.includes('ws:') ||
      event.message?.includes('vite') ||
      event.filename?.includes('vite')
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);

  window.addEventListener('unhandledrejection', (event) => {
    const reasonStr = String(event.reason?.message || event.reason || '');
    if (
      reasonStr.includes('WebSocket') ||
      reasonStr.includes('closed without opened') ||
      reasonStr.includes('vite')
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
}

// Initialize subtle audio hover feedback on 3D buttons, cards & controls
initGlobalTactileAudio();

createRoot(document.getElementById('root')!).render(<App />);
