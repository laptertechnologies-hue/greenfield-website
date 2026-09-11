import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { updateSEO } from '../utils/seo';

export const Portal: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [key, setKey] = useState(0);

  const portalUrl = "https://gfss.portal.laptertech.store";

  useEffect(() => {
    updateSEO(
      'Student & Staff Portal | Greenfield Secondary School Masindi',
      'Access the official Greenfield Secondary School student, teacher, and parent management portal.'
    );
  }, []);

  const handleReload = () => {
    setIsLoading(true);
    setHasError(false);
    setKey((prev) => prev + 1);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`portal-page-container ${isFullscreen ? 'fullscreen-mode' : ''}`}>
      {/* Portal In-App Control Bar */}
      <div className="portal-toolbar">
        <div className="portal-toolbar-left">
          <Link to="/" className="portal-back-btn" title="Back to Home">
            <i className="fas fa-arrow-left"></i> <span>Home</span>
          </Link>
          <div className="portal-title-block">
            <h3>GFSS Student &amp; Staff Portal</h3>
            <span className="portal-secure-badge">
              <i className="fas fa-shield-alt"></i> Secure In-App Session
            </span>
          </div>
        </div>

        <div className="portal-toolbar-right">
          <button 
            type="button" 
            className="portal-action-btn" 
            onClick={handleReload}
            title="Reload Portal"
            aria-label="Reload Portal"
          >
            <i className={`fas fa-sync-alt ${isLoading ? 'fa-spin' : ''}`}></i>
            <span className="btn-text">Reload</span>
          </button>
          
          <button 
            type="button" 
            className={`portal-action-btn ${isFullscreen ? 'active' : ''}`}
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            aria-label="Toggle Fullscreen"
          >
            <i className={`fas ${isFullscreen ? 'fa-compress' : 'fa-expand'}`}></i>
            <span className="btn-text">{isFullscreen ? 'Exit Full' : 'Fullscreen'}</span>
          </button>
        </div>
      </div>

      {/* Loading indicator overlay */}
      {isLoading && (
        <div className="portal-loader-overlay">
          <div className="portal-spinner"></div>
          <p>Connecting to Greenfield Portal...</p>
          <span className="portal-subtext">Loading secure authentication engine</span>
        </div>
      )}

      {/* Error Fallback Notice */}
      {hasError && (
        <div className="portal-error-card">
          <i className="fas fa-exclamation-triangle"></i>
          <h4>Unable to connect to Portal</h4>
          <p>Please check your internet connection or try reloading.</p>
          <button type="button" className="btn btn-primary" onClick={handleReload}>
            <i className="fas fa-redo"></i> Retry Connection
          </button>
        </div>
      )}

      {/* In-App Embedded Portal Frame */}
      <div className="portal-iframe-wrapper">
        <iframe
          key={key}
          src={portalUrl}
          title="Greenfield Secondary School Portal"
          className="portal-iframe"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          allow="fullscreen; camera; microphone; geolocation; clipboard-read; clipboard-write"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-downloads"
        />
      </div>
    </div>
  );
};
