import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

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

  const loginUrl = "https://gfss.portal.laptertech.store";

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Skip link for accessibility */}
      <a href="#main-content" className="skip-to-content" style={{ display: 'none' }}>
        Skip to main content
      </a>

      {/* Header Section */}
      <header className="header" role="banner">
        <div className="header-container">
          <Link to="/" className="logo-container" aria-label="GREENFIELD SECONDARY SCHOOL Home" onClick={closeMenu}>
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
          
          <button 
            className="menu-toggle" 
            onClick={toggleMenu} 
            aria-label="Toggle navigation menu" 
            aria-expanded={isMobileMenuOpen}
          >
            ☰
          </button>
          
          <nav className={`nav ${isMobileMenuOpen ? 'active' : ''}`} role="navigation" aria-label="Main navigation">
            <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu} end>
              <i className="fas fa-home" aria-hidden="true"></i> Home
            </NavLink>
            <NavLink to="/academics" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>
              <i className="fas fa-graduation-cap" aria-hidden="true"></i> Academics
            </NavLink>
            <NavLink to="/admissions" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>
              <i className="fas fa-sign-in-alt" aria-hidden="true"></i> Admissions
            </NavLink>
            <NavLink to="/gallery" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>
              <i className="fas fa-images" aria-hidden="true"></i> Gallery
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>
              <i className="fas fa-info-circle" aria-hidden="true"></i> About
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>
              <i className="fas fa-address-book" aria-hidden="true"></i> Contact
            </NavLink>
            
            {/* Login Button in Navigation */}
            <a href={loginUrl} className="login-btn" target="_blank" rel="noopener noreferrer">
              <i className="fas fa-sign-in-alt"></i> Login
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="main-content" style={{ flex: '1 0 auto' }}>
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
              <li><Link to="/" onClick={closeMenu}><i className="fas fa-chevron-right"></i> Home</Link></li>
              <li><Link to="/academics" onClick={closeMenu}><i className="fas fa-chevron-right"></i> Academics</Link></li>
              <li><Link to="/admissions" onClick={closeMenu}><i className="fas fa-chevron-right"></i> Admissions</Link></li>
              <li><Link to="/gallery" onClick={closeMenu}><i className="fas fa-chevron-right"></i> Gallery</Link></li>
              <li><Link to="/about" onClick={closeMenu}><i className="fas fa-chevron-right"></i> About Us</Link></li>
              <li><Link to="/contact" onClick={closeMenu}><i className="fas fa-chevron-right"></i> Contact</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Contact Information</h3>
            <p style={{ marginBottom: '10px' }}>
              <i className="fas fa-map-marker-alt" style={{ marginRight: '10px', color: 'var(--gold)' }}></i>
              Kiruli Hill, Masindi Municipality, Masindi, Bunyoro Sub-region, Uganda
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
    </div>
  );
};
