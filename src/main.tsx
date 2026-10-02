import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Capture the browser's install prompt as early as possible (it can fire before React mounts)
declare global {
  interface Window { __gfssInstallPrompt?: any }
}
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.__gfssInstallPrompt = e;
  window.dispatchEvent(new Event('gfss-install-ready'));
});
window.addEventListener('appinstalled', () => {
  window.__gfssInstallPrompt = undefined;
  localStorage.setItem('gfss_installed', 'true');
  window.dispatchEvent(new Event('gfss-installed'));
});

// Register the service worker (web only, not inside the Capacitor app)
const isNative = !!(window as any).Capacitor?.isNativePlatform?.();
if ('serviceWorker' in navigator && !isNative && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
