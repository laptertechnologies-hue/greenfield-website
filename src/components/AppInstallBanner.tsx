import React, { useState, useEffect } from 'react';

// ---- Play Store switch -----------------------------------------------------
// While the app is not on Google Play, visitors install the PWA (one tap).
// When Play is live: set VITE_PLAY_STORE_LIVE=true in .env.production and rebuild
// and the banner will send Android users to Google Play instead.
const PLAY_STORE_URL =
  import.meta.env.VITE_PLAY_STORE_URL ||
  'https://play.google.com/store/apps/details?id=com.greenfield.secondary.school';
const PLAY_STORE_LIVE = import.meta.env.VITE_PLAY_STORE_LIVE === 'true';

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  (navigator as any).standalone === true;

export const AppInstallBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [canPrompt, setCanPrompt] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const ua = navigator.userAgent;
  const isAndroid = /Android/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua);

  useEffect(() => {
    const isNative = !!(window as any).Capacitor?.isNativePlatform?.();

    // Only hide if currently running in standalone PWA window
    if (isNative || isStandalone()) return;

    setCanPrompt(!!window.__gfssInstallPrompt);
    const onReady = () => { setCanPrompt(true); setVisible(true); };
    const onInstalled = () => setVisible(false);
    window.addEventListener('gfss-install-ready', onReady);
    window.addEventListener('gfss-installed', onInstalled);

    // Show banner promptly after 600ms
    const timer = setTimeout(() => setVisible(true), 600);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('gfss-install-ready', onReady);
      window.removeEventListener('gfss-installed', onInstalled);
    };
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem('gfss_app_dismissed', 'true');
  };

  const install = async () => {
    const evt = window.__gfssInstallPrompt;
    if (evt) {
      evt.prompt();
      const choice = await evt.userChoice;
      window.__gfssInstallPrompt = undefined;
      setCanPrompt(false);
      if (choice.outcome === 'accepted') setVisible(false);
    } else {
      setShowHelp(true); // browser didn't offer the prompt: show manual steps
    }
  };

  if (!visible) return null;

  return (
    <div className="app-install-banner" role="complementary" aria-label="Install the school app">
      <div className="app-install-banner-inner">
        <div className="app-install-left">
          <img src="/icon-192.png" alt="GFSS" className="app-install-icon" />
          <div className="app-install-text">
            <strong>Greenfield School App</strong>
            <span>
              {showHelp
                ? isIOS
                  ? 'Tap Share, then "Add to Home Screen"'
                  : 'Tap the ⋮ menu, then "Install app"'
                : 'Results, fees & news. Free, installs in seconds'}
            </span>
          </div>
        </div>
        <div className="app-install-actions">
          {isAndroid && PLAY_STORE_LIVE ? (
            <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="app-install-btn">
              <i className="fab fa-google-play" /> Get it
            </a>
          ) : isIOS ? (
            <button className="app-install-btn" onClick={() => setShowHelp(true)}>
              <i className="fas fa-plus-square" /> Add
            </button>
          ) : (
            <button className="app-install-btn" onClick={install} data-ready={canPrompt}>
              <i className="fas fa-download" /> Install
            </button>
          )}
          <button className="app-install-close" onClick={dismiss} aria-label="Dismiss">
            <i className="fas fa-times" />
          </button>
        </div>
      </div>
    </div>
  );
};
