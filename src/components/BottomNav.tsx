import React from 'react';
import { NavLink } from 'react-router-dom';

export const BottomNav: React.FC = () => {
  return (
    <nav className="bottom-nav" role="navigation" aria-label="Mobile bottom navigation">
      <div className="bottom-nav-container">
        <NavLink 
          to="/" 
          end 
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
          aria-label="Home"
        >
          <div className="bottom-nav-icon">
            <i className="fas fa-home"></i>
          </div>
          <span className="bottom-nav-label">Home</span>
        </NavLink>

        <NavLink 
          to="/academics" 
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
          aria-label="Academics"
        >
          <div className="bottom-nav-icon">
            <i className="fas fa-graduation-cap"></i>
          </div>
          <span className="bottom-nav-label">Academics</span>
        </NavLink>

        <NavLink 
          to="/admissions" 
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
          aria-label="Admissions"
        >
          <div className="bottom-nav-icon">
            <i className="fas fa-file-signature"></i>
          </div>
          <span className="bottom-nav-label">Admissions</span>
        </NavLink>

        <NavLink 
          to="/app" 
          className={({ isActive }) => `bottom-nav-item bottom-nav-portal ${isActive ? 'active' : ''}`}
          aria-label="Portal Login"
        >
          <div className="bottom-nav-icon portal-icon-highlight">
            <i className="fas fa-user-shield"></i>
          </div>
          <span className="bottom-nav-label">Portal</span>
        </NavLink>

        <NavLink 
          to="/gallery" 
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
          aria-label="Gallery"
        >
          <div className="bottom-nav-icon">
            <i className="fas fa-images"></i>
          </div>
          <span className="bottom-nav-label">Gallery</span>
        </NavLink>

        <NavLink 
          to="/about" 
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
          aria-label="About"
        >
          <div className="bottom-nav-icon">
            <i className="fas fa-info-circle"></i>
          </div>
          <span className="bottom-nav-label">About</span>
        </NavLink>

        <NavLink 
          to="/contact" 
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
          aria-label="Contact"
        >
          <div className="bottom-nav-icon">
            <i className="fas fa-envelope"></i>
          </div>
          <span className="bottom-nav-label">Contact</span>
        </NavLink>
      </div>
    </nav>
  );
};
