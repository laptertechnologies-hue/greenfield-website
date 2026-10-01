import React, { useState, useEffect } from 'react';

const PLAY_STORE_URL =
  import.meta.env.VITE_PLAY_STORE_URL ||
  'https://play.google.com/store/apps/details?id=com.greenfield.secondary.school';

const DISMISSED_KEY = 'gfss_app_banner_dismissed';

/**
 * Shows a "Download the App" banner on Android mobile browsers.
 * Dismissed state is stored in localStorage.
 */
export const AppInstallBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show on Android browsers (not in Capacitor app)
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isCapacitor = (window as any).Capacitor?.isNativePlatform?.() ?? false;
    const isDismissed = localStorage.getItem(DISMISSED_KEY) === 'true';

    if (isAndroid && !isCapacitor && !isDismissed) {
      // Delay 3 seconds before showing
      const timer = setTimeout(() => setVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(DISMISSED_KEY, 'true');
  };

  if (!visible) return null;

  return (
    <div className="app-install-banner" role="complementary" aria-label="App download prompt">
      <div className="app-install-banner-inner">
        <div className="app-install-left">
          <img
            src="/Green-field-secondary-school.jpg"
            alt="GFSS App"
            className="app-install-icon"
          />
          <div className="app-install-text">
            <strong>Greenfield School App</strong>
            <span>Get news, portal &amp; more — free on Android</span>
          </div>
        </div>
        <div className="app-install-actions">
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="app-install-btn"
            aria-label="Download on Google Play"
          >
            <i className="fab fa-google-play" /> Install
          </a>
          <button
            className="app-install-close"
            onClick={dismiss}
            aria-label="Dismiss app install banner"
          >
            <i className="fas fa-times" />
          </button>
        </div>
      </div>
    </div>
  );
};
