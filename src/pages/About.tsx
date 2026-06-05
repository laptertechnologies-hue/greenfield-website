import React, { useEffect } from 'react';
import { updateSEO } from '../utils/seo';

export const About: React.FC = () => {
  useEffect(() => {
    updateSEO(
      'About Us | GreenField Secondary School Masindi',
      'Learn about Greenfield Secondary School Masindi - history, location, directors, headteacher message, student leaders, and our alumni.'
    );
  }, []);

  return (
    <div>
      {/* Banner */}
      <section className="page-banner">
        <div>
          <h1>Who We Are</h1>
          <p>Rooted in Excellence, Growing in Masindi</p>
        </div>
      </section>

      <div className="container">
        {/* History and Background */}
        <section className="history-section">
          <h2 style={{ color: 'var(--primary-green)', fontSize: '2rem', marginBottom: '20px' }}>
            School Background and Location
          </h2>
          
          <div style={{ background: 'var(--light-bg)', padding: '25px', borderLeft: '4px solid var(--gold)', marginBottom: '25px', borderRadius: '4px' }}>
            <h3 style={{ color: 'var(--primary-green)', marginBottom: '12px', fontSize: '1.25rem', fontWeight: 600 }}>
              Location & History
            </h3>
            <ul style={{ listStyleType: 'disc', paddingLeft: '20px', lineHeight: '1.8' }}>
              <li>Greenfield Secondary School is located 3 miles along Masindi-Hoima road, behind Kihande 1 trading centre in Kihande 1 cell, Western ward central division, Masindi Municipality, Masindi district.</li>
              <li>The school was started in 1998 by Mr. Mbabazi T. Tadeo and Mr. Bigirwa Bernard as professional teachers.</li>
              <li>The school is registered with the ministry of education and sports since June 2000. The school registration number is PSS/G/17.</li>
              <li>The school acquired a UNEB centre number U1385 in the year 2000.</li>
              <li>Greenfield secondary school is a mixed day and boarding secondary school with both 'O' & 'A' levels teaching both ARTS and science subjects.</li>
              <li>The school signed a memorandum of understanding with the government of Uganda to implement universal secondary education program in 2008.</li>
              <li>Greenfield secondary school has a good working relationship with the local community, local government & central government.</li>
            </ul>
          </div>

          <div style={{ background: 'var(--light-bg)', padding: '25px', borderLeft: '4px solid var(--gold)', marginBottom: '35px', borderRadius: '4px' }}>
            <h3 style={{ color: 'var(--primary-green)', marginBottom: '12px', fontSize: '1.25rem', fontWeight: 600 }}>
              School Management
            </h3>
            <p style={{ lineHeight: '1.7' }}>
              The school is managed by the Board of Governors (BOG) fully initiated by the government. The head teacher is appointed on contract by the directors of the school.
            </p>
          </div>

          {/* Vision, Mission, Motto */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', marginBottom: '35px' }}>
            <div style={{ background: 'var(--light-bg)', padding: '25px', borderTop: '4px solid var(--primary-green)', textAlign: 'center', borderRadius: '4px', boxShadow: 'var(--shadow-subtle)' }}>
              <h3 style={{ color: 'var(--primary-green)', marginBottom: '10px', fontSize: '1.2rem' }}>School Vision</h3>
              <p>Providing all round education for self-reliance, self-concept and national development.</p>
            </div>
            
            <div style={{ background: 'var(--light-bg)', padding: '25px', borderTop: '4px solid var(--primary-green)', textAlign: 'center', borderRadius: '4px', boxShadow: 'var(--shadow-subtle)' }}>
              <h3 style={{ color: 'var(--primary-green)', marginBottom: '10px', fontSize: '1.2rem' }}>School Mission</h3>
              <p>To provide quality education aimed at producing God fearing, responsible and socially acceptable citizens.</p>
            </div>

            <div style={{ background: 'var(--light-bg)', padding: '25px', borderTop: '4px solid var(--primary-green)', textAlign: 'center', borderRadius: '4px', boxShadow: 'var(--shadow-subtle)' }}>
              <h3 style={{ color: 'var(--primary-green)', marginBottom: '10px', fontSize: '1.2rem' }}>School Motto</h3>
              <p style={{ fontWeight: 'bold', fontStyle: 'italic', fontSize: '1.15rem' }}>Hard work pays</p>
            </div>
          </div>

          <div style={{ background: 'var(--light-bg)', padding: '25px', borderLeft: '4px solid var(--gold)', borderRadius: '4px' }}>
            <h3 style={{ color: 'var(--primary-green)', marginBottom: '12px', fontSize: '1.25rem', fontWeight: 600 }}>
              Goals
            </h3>
            <ul style={{ listStyleType: 'disc', paddingLeft: '20px', lineHeight: '1.8' }}>
              <li>To provide quality education (knowledge, skills and values).</li>
              <li>To prepare a reliable, creative and productive human resource.</li>
            </ul>
          </div>

          <h2 style={{ color: 'var(--primary-green)', fontSize: '2rem', marginTop: '50px', marginBottom: '20px' }}>
            Subjects Offered
          </h2>
          <div style={{ background: 'var(--light-bg)', padding: '20px', borderLeft: '4px solid var(--gold)', marginBottom: '20px', borderRadius: '4px' }}>
            <h3 style={{ color: 'var(--primary-green)', marginBottom: '8px', fontSize: '1.15rem' }}>O Level Subjects Are:</h3>
            <p>English, Math, Physics, Chemistry, Biology, History & Political Education, Geography, Entrepreneur, Agriculture, Kiswahili, Art and Design, Computer Studies, Literature in English and Physical Education.</p>
          </div>

          <div style={{ background: 'var(--light-bg)', padding: '20px', borderLeft: '4px solid var(--gold)', marginBottom: '20px', borderRadius: '4px' }}>
            <h3 style={{ color: 'var(--primary-green)', marginBottom: '8px', fontSize: '1.15rem' }}>A Level Subjects Are:</h3>
            <p>G.P, Sub. Math and Sub ICT, Chemistry, Physics, Math, Biology, Agriculture, History, Divinity, Geography, Art and Design, Entrepreneurship, Economics, Literature</p>
          </div>

          <div style={{ background: 'var(--light-bg)', padding: '20px', borderLeft: '4px solid var(--gold)', borderRadius: '4px' }}>
            <h3 style={{ color: 'var(--primary-green)', marginBottom: '8px', fontSize: '1.15rem' }}>Vocational Subjects Are:</h3>
            <p>Tailoring, Domestic Electrical Engineering, Hair Dressing, Catering, Building and Construction, Electronic Engineering, Weaving and Beading.</p>
          </div>
        </section>

        {/* Core Pillars */}
        <h2 style={{ textAlign: 'center', color: 'var(--primary-green)', fontSize: '2rem', marginBottom: '10px', fontWeight: 700 }}>Our Core Pillars</h2>
        <div className="values-grid">
          <div className="value-card">
            <h4>Academic Excellence</h4>
            <p>We strive for the highest standards in UNEB results and critical thinking.</p>
          </div>
          <div className="value-card">
            <h4>Integrity</h4>
            <p>Building honest and transparent leaders for tomorrow's Uganda.</p>
          </div>
          <div className="value-card">
            <h4>Discipline</h4>
            <p>The foundation of success in every student's academic journey.</p>
          </div>
          <div className="value-card">
            <h4>God Fearing</h4>
            <p>Nurturing spiritual growth alongside intellectual development.</p>
          </div>
        </div>

        {/* Headteacher Message */}
        <section className="ht-message">
          <img src="/photos/hm.jpg" alt="Headteacher Mr. Charles Ekyagonza" className="ht-image" />
          <div className="ht-text">
            <h2>Message from the Headteacher</h2>
            <p>
              “At GreenField Secondary School, we don't just teach; we inspire. Our mission is to ensure every student who walks through our gates in Masindi leaves with the confidence and competence to compete on a global stage. We invite parents and students to join our community of achievers where discipline meets excellence.”
            </p>
            <p style={{ marginTop: '25px', fontWeight: 'bold', borderLeft: '3px solid var(--gold)', paddingLeft: '12px', fontSize: '1.1rem' }}>
              Mr. CHARLES EKYAGONZA <br />
              <span style={{ fontSize: '0.9rem', fontWeight: 'normal', opacity: 0.9 }}>Headteacher, GreenField Secondary School</span>
            </p>
          </div>
        </section>

        {/* Administrators */}
        <section className="board-section">
          <h2 className="section-title">School Administrators</h2>
          <p style={{ color: 'var(--text-light)', maxWidth: '600px', margin: '0 auto' }}>
            Our school is governed by a distinguished board of directors and experienced educators.
          </p>
          <div className="board-grid">
            <div className="board-member">
              <img src="/Green-field-secondary-school.jpg" alt="Director Mr. Mbabazi Tadeo" />
              <h4>Mr. MBABAZI TADEO</h4>
              <p>Director</p>
            </div>
            <div className="board-member">
              <img src="/Green-field-secondary-school.jpg" alt="Director Mr. Bigirwa Bernard" />
              <h4>Mr. BIGIRWA BENARD</h4>
              <p>Director</p>
            </div>
            <div className="board-member">
              <img src="/photos/deputy_academics.jpg" alt="Deputy Academics" />
              <h4>Mr. [Name]</h4>
              <p>Deputy Academics</p>
            </div>
            <div className="board-member">
              <img src="/photos/dos.jpg" alt="Director of Studies" />
              <h4>Mr. [Name]</h4>
              <p>Director of Studies</p>
            </div>
            <div className="board-member">
              <img src="/photos/procurement.jpg" alt="Procurement Officer" />
              <h4>Mrs. [Name]</h4>
              <p>Procurement Officer</p>
            </div>
          </div>
        </section>

        {/* Student Leaders */}
        <section className="board-section" style={{ borderTop: '1px solid #ddd', paddingTop: '60px' }}>
          <h2 className="section-title">Student Leaders</h2>
          <p style={{ color: 'var(--text-light)', maxWidth: '600px', margin: '0 auto 40px' }}>
            Meet the dedicated student leaders who help shape our school community.
          </p>
          
          <div className="board-grid" style={{ justifyContent: 'center', marginBottom: '50px', display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
            <div className="board-member" style={{ minWidth: '240px', maxWidth: '300px' }}>
              <img src="/Green-field-secondary-school.jpg" alt="Head Prefect" />
              <h4>[Name]</h4>
              <p>Head Prefect 2026</p>
            </div>
            <div className="board-member" style={{ minWidth: '240px', maxWidth: '300px' }}>
              <img src="/Green-field-secondary-school.jpg" alt="Head Girl" />
              <h4>[Name]</h4>
              <p>Head Girl 2026</p>
            </div>
          </div>

          <h3 style={{ color: 'var(--primary-green)', textAlign: 'center', marginBottom: '25px', fontSize: '1.5rem', fontWeight: 600 }}>
            Prefects Body
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '35px', maxWidth: '1000px', margin: '0 auto' }}>
            <div className="gallery-item" style={{ height: '400px', width: '100%' }}>
              <img src="/photos/o_level_prefects.jpg" alt="O-Level Prefects Group Photo" style={{ objectPosition: 'center', objectFit: 'cover' }} />
              <div className="gallery-label" style={{ fontSize: '1.2rem', padding: '15px' }}>O-Level Prefects</div>
            </div>
            <div className="gallery-item" style={{ height: '400px', width: '100%' }}>
              <img src="/photos/a_level_prefects.jpg" alt="A-Level Prefects Group Photo" style={{ objectPosition: 'center', objectFit: 'cover' }} />
              <div className="gallery-label" style={{ fontSize: '1.2rem', padding: '15px' }}>A-Level Prefects</div>
            </div>
          </div>
        </section>

        {/* Alumni */}
        <section className="alumni-section" style={{ borderTop: '1px solid #ddd', paddingTop: '60px', marginTop: '60px' }}>
          <h2 className="section-title">Our Alumni</h2>
          <p style={{ color: 'var(--text-light)', maxWidth: '600px', margin: '0 auto 40px' }}>
            Proud graduates who have gone on to achieve great things in various fields.
          </p>
          <div className="alumni-grid">
            <div className="alumni-card">
              <div className="alumni-image">
                <img src="/Green-field-secondary-school.jpg" alt="Alumni Dr. Sarah Nakato" />
              </div>
              <div className="alumni-info">
                <h4>Dr. Sarah Nakato</h4>
                <p className="alumni-class">Class of 2018</p>
                <p className="alumni-achievement">Medical Doctor at Mulago Hospital, Kampala</p>
                <p className="alumni-quote">"Green Field S.S gave me the foundation for excellence in medicine."</p>
              </div>
            </div>
            
            <div className="alumni-card">
              <div className="alumni-image">
                <img src="/Green-field-secondary-school.jpg" alt="Alumni Eng. David Okello" />
              </div>
              <div className="alumni-info">
                <h4>Eng. David Okello</h4>
                <p className="alumni-class">Class of 2016</p>
                <p className="alumni-achievement">Civil Engineer at China Civil Engineering Construction</p>
                <p className="alumni-quote">"The discipline and knowledge I gained here shaped my engineering career."</p>
              </div>
            </div>

            <div className="alumni-card">
              <div className="alumni-image">
                <img src="/Green-field-secondary-school.jpg" alt="Alumni Maria Atim" />
              </div>
              <div className="alumni-info">
                <h4>Maria Atim</h4>
                <p className="alumni-class">Class of 2020</p>
                <p className="alumni-achievement">Law Student at Makerere University</p>
                <p className="alumni-quote">"The values instilled in me continue to guide my pursuit of justice."</p>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Preview */}
        <section className="board-section" style={{ borderTop: '1px solid #ddd', paddingTop: '60px' }}>
          <h2 className="section-title">School Gallery</h2>
          <div className="gallery-grid">
            <div className="gallery-item">
              <img src="/photos/school-campus-hero.jpg" alt="Main Campus View" />
              <div className="gallery-label">Main Campus View</div>
            </div>
            <div className="gallery-item">
              <img src="/photos/school-hall.jpg" alt="School Hall" />
              <div className="gallery-label">School Hall</div>
            </div>
            <div className="gallery-item">
              <img src="/photos/dormitory-view.jpg" alt="Dormitories" />
              <div className="gallery-label">Dormitories</div>
            </div>
            <div className="gallery-item">
              <img src="/photos/school-entrance.jpg" alt="Main Gate" />
              <div className="gallery-label">Main Gate</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
