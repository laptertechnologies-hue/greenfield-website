import React, { useState, useEffect } from 'react';
import { updateSEO } from '../utils/seo';
import api from '../utils/api';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: 'New Admissions', message: ''
  });
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    updateSEO(
      'Contact Us | GreenField Secondary School Masindi',
      'Get in touch with Greenfield Secondary School Masindi. Find our address, phone numbers, email, location map, and send us an inquiry.'
    );
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await api.submitContact({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      });
      setIsSubmitSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsSubmitSuccess(false);
    setFormData({ name: '', email: '', phone: '', subject: 'New Admissions', message: '' });
  };

  return (
    <div>
      <section className="page-banner">
        <div>
          <h1>Contact Us</h1>
          <p>We are here to answer your questions</p>
        </div>
      </section>

      <div className="container">
        <div className="contact-grid">
          <div className="info-panel">
            <h2 style={{ color: 'var(--primary-green)', marginBottom: '25px', fontSize: '1.8rem' }}>Get in Touch</h2>
            <div className="info-item">
              <h4>School Location</h4>
              <p>Kihande Hill, Masindi Municipality<br />Masindi, Bunyoro Sub-region, Uganda</p>
            </div>
            <div className="info-item">
              <h4>Academic Inquiries</h4>
              <p>Director of Studies Office<br /><strong>Phone:</strong> +256 772904964<br /><strong>Email:</strong> greenfieldsecondary@gmail.com</p>
            </div>
            <div className="info-item">
              <h4>Admissions &amp; General Office</h4>
              <p>Main Administration Block<br /><strong>Phone:</strong> +256 779336404<br /><strong>Email:</strong> greenfieldsecondary@gmail.com</p>
            </div>
            <div className="info-item">
              <h4>Connect With Us</h4>
              <p>Follow our official pages for the latest updates from Green Field S.S Masindi.</p>
              <div className="social-links">
                <a href="#" className="social-icon facebook" title="Facebook"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="social-icon twitter" title="Twitter/X"><i className="fab fa-x-twitter"></i></a>
                <a href="#" className="social-icon whatsapp" title="WhatsApp"><i className="fab fa-whatsapp"></i></a>
                <a href="#" className="social-icon youtube" title="YouTube"><i className="fab fa-youtube"></i></a>
              </div>
            </div>
          </div>

          <div className="form-panel">
            <h3>Send a Message</h3>
            {error && (
              <div style={{ color: '#e53e3e', marginBottom: '15px', padding: '10px', background: '#fff5f5', borderRadius: '6px', border: '1px solid #fed7d7' }}>
                <i className="fas fa-exclamation-circle" /> {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" placeholder="Enter your name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" placeholder="Your email address" value={formData.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input type="tel" id="phone" placeholder="e.g. +256 772 000 000" value={formData.phone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Inquiry Subject</label>
                <select id="subject" value={formData.subject} onChange={handleChange}>
                  <option value="New Admissions">New Admissions</option>
                  <option value="Academic Performance">Academic Performance</option>
                  <option value="Employment Opportunities">Employment Opportunities</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="message">Your Message</label>
                <textarea id="message" rows={5} placeholder="Write your message here..." value={formData.message} onChange={handleChange} required></textarea>
              </div>
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? <><i className="fas fa-spinner fa-spin" /> Sending...</> : 'Send Inquiry'}
              </button>
            </form>
          </div>
        </div>

        <section className="map-section">
          <h3>Find Us on the Map</h3>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d494.8039180626148!2d31.704253034324488!3d1.6691340054728656!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177ad23f9acb0b93%3A0x6b8b18d04abe212d!2sGREENFIELD%20SECONDARY%20SCHOOL-MASINDI!5e1!3m2!1sen!2sug!4v1770450370071!5m2!1sen!2sug"
            width="100%"
            height="380"
            style={{ border: 0, borderRadius: '8px' }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps Location of Greenfield Secondary School Masindi"
          ></iframe>
        </section>
      </div>

      {isSubmitSuccess && (
        <div className="success-modal-overlay">
          <div className="success-modal">
            <i className="fas fa-check-circle"></i>
            <h3>Message Sent!</h3>
            <p>Your message was sent successfully. Our team will review your inquiry and get back to you as soon as possible.</p>
            <button className="btn" onClick={handleCloseModal}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};
