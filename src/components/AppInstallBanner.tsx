import React, { useState, useEffect } from 'react';

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
            href="/gfss-app.apk"
            download="Greenfield-Secondary-School.apk"
            className="app-install-btn"
            aria-label="Download Greenfield Android App (APK)"
          >
            <i className="fab fa-android" /> Download APK
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
