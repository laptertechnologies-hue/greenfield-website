import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { AppInstallBanner } from './AppInstallBanner';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    setFormattedDate(now.toLocaleDateString('en-US', options));
  }, []);

  return (
    <div className="app-layout-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Skip link for accessibility */}
      <a href="#main-content" className="skip-to-content" style={{ display: 'none' }}>
        Skip to main content
      </a>

      {/* Header Section */}
      <header className="header" role="banner">
        <div className="header-container">
          <Link to="/" className="logo-container" aria-label="GREENFIELD SECONDARY SCHOOL Home">
            <img 
              src="/Green-field-secondary-school.jpg" 
              alt="GREENFIELD SECONDARY SCHOOL Logo" 
              className="logo-img" 
              width="65" 
              height="65" 
            />
            <div className="logo-text">
              <h3>GREENFIELD SECONDARY SCHOOL</h3>
              <span>Hard Work Pays | Masindi Uganda</span>
            </div>
          </Link>
          
          <nav className="nav desktop-nav" role="navigation" aria-label="Main navigation">
            <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''} end>
              <i className="fas fa-home" aria-hidden="true"></i> Home
            </NavLink>
            <NavLink to="/academics" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="fas fa-graduation-cap" aria-hidden="true"></i> Academics
            </NavLink>
            <NavLink to="/admissions" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="fas fa-file-signature" aria-hidden="true"></i> Admissions
            </NavLink>
            <NavLink to="/gallery" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="fas fa-images" aria-hidden="true"></i> Gallery
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="fas fa-info-circle" aria-hidden="true"></i> About
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="fas fa-envelope" aria-hidden="true"></i> Contact
            </NavLink>
            
            {/* In-App Portal / Login Nav Link */}
            <NavLink to="/app" className="login-btn">
              <i className="fas fa-user-shield"></i> Portal Login
            </NavLink>
          </nav>

          {/* Quick in-app portal button for header on compact viewports */}
          <Link to="/app" className="header-quick-portal-btn" title="Open In-App Portal">
            <i className="fas fa-user-shield"></i> <span>Portal</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="main-content" className="app-main-content" style={{ flex: '1 0 auto' }}>
        {children}
      </main>

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-column">
            <img 
              src="/Green-field-secondary-school.jpg" 
              alt="Greenfield Logo" 
              style={{ height: '70px', borderRadius: '50%', backgroundColor: 'white', padding: '4px', marginBottom: '20px' }} 
            />
            <h3>Greenfield Secondary School</h3>
            <p style={{ marginBottom: '15px' }}>
              Excellence in Education since 1998. We are committed to providing holistic, quality education that empowers students from Masindi and beyond.
            </p>
            <div className="social-links">
              <a href="#" className="social-icon facebook" title="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="social-icon twitter" title="Twitter/X"><i className="fab fa-x-twitter"></i></a>
              <a href="#" className="social-icon whatsapp" title="WhatsApp"><i className="fab fa-whatsapp"></i></a>
              <a href="#" className="social-icon youtube" title="YouTube"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
          
          <div className="footer-column">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/"><i className="fas fa-chevron-right"></i> Home</Link></li>
              <li><Link to="/academics"><i className="fas fa-chevron-right"></i> Academics</Link></li>
              <li><Link to="/admissions"><i className="fas fa-chevron-right"></i> Admissions</Link></li>
              <li><Link to="/gallery"><i className="fas fa-chevron-right"></i> Gallery</Link></li>
              <li><Link to="/about"><i className="fas fa-chevron-right"></i> About Us</Link></li>
              <li><Link to="/contact"><i className="fas fa-chevron-right"></i> Contact</Link></li>
              <li><Link to="/app"><i className="fas fa-chevron-right"></i> Student/Staff Portal</Link></li>
              <li><Link to="/admin"><i className="fas fa-chevron-right"></i> Admin Portal</Link></li>
              <li><a href="/gfss-app.apk" download="Greenfield-Secondary-School.apk" style={{ color: 'var(--gold)', fontWeight: 600 }}><i className="fab fa-android"></i> Download Android App (.apk)</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Contact Information</h3>
            <p style={{ marginBottom: '10px' }}>
              <i className="fas fa-map-marker-alt" style={{ marginRight: '10px', color: 'var(--gold)' }}></i>
              Kihande Hill, Masindi Municipality, Masindi, Bunyoro Sub-region, Uganda
            </p>
            <p style={{ marginBottom: '10px' }}>
              <i className="fas fa-phone" style={{ marginRight: '10px', color: 'var(--gold)' }}></i>
              +256 772904964 / +256 779336404
            </p>
            <p style={{ marginBottom: '10px' }}>
              <i className="fas fa-envelope" style={{ marginRight: '10px', color: 'var(--gold)' }}></i>
              greenfieldsecondary@gmail.com
            </p>
            <p>
              <i className="fas fa-clock" style={{ marginRight: '10px', color: 'var(--gold)' }}></i>
              Mon - Fri: 8:00 AM - 5:00 PM
            </p>
          </div>
        </div>
        
        <div className="copyright">
          <p>&copy; {new Date().getFullYear()} Greenfield Secondary School Masindi. All Rights Reserved.</p>
          <p style={{ fontSize: '0.8rem', color: '#b0cbb0', marginTop: '5px' }}>
            "Knowledge, Discipline, Service" | Ministry of Education PSS/G/17 | UNEB U1385 | DIT UVQF/1215
          </p>
          <p style={{ fontSize: '0.8rem', color: '#b0cbb0', marginTop: '5px' }}>
            Today's Date: {formattedDate}
          </p>
        </div>
      </footer>

      {/* App Install Banner (shown on Android browsers only) */}
      <AppInstallBanner />

      {/* Native Bottom Navigation Bar */}
      <BottomNav />
    </div>
  );
};
