import React, { useEffect } from 'react';
import { updateSEO } from '../utils/seo';

export const Academics: React.FC = () => {
  useEffect(() => {
    updateSEO(
      'Academics | Green Field Secondary School Masindi',
      'Discover the academic programs at Greenfield Secondary School Masindi - O & A Level curriculums, subject combinations, UNEB performance, departments, and facilities.'
    );
  }, []);

  return (
    <div>
      {/* Hero Header */}
      <section className="hero-small">
        <div className="hero-content">
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Academic Excellence</h1>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.3rem)' }}>Nurturing Minds, Building Character, and Shaping Futures in Masindi</p>
          <div className="academic-pillars">
            <div className="pillar">UNEB Curriculum</div>
            <div className="pillar">Holistic Education</div>
            <div className="pillar">Vocational Skills</div>
            <div className="pillar">Community Focus</div>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Academic Vision */}
        <div className="section-box">
          <h2><i className="fas fa-bullseye" style={{ marginRight: '10px' }}></i> Academic Vision & Philosophy</h2>
          <p style={{ marginBottom: '15px' }}>
            At GreenField Secondary School Masindi, we are committed to providing a holistic education that follows the <strong>Uganda National Examinations Board (UNEB)</strong> curriculum while integrating practical vocational skills relevant to the Bunyoro sub-region. Our approach balances academic rigor with character development to prepare students for both higher education and productive citizenship.
          </p>
          <p>
            We believe in nurturing every student's unique potential through personalized attention, modern teaching methodologies, and a supportive learning environment that reflects our values of integrity, discipline, and community service.
          </p>
        </div>

        {/* Level Details Grid */}
        <div className="grid-container" style={{ marginBottom: '40px' }}>
          <div className="dept-card">
            <h3 style={{ color: 'var(--primary-green)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.4rem' }}>
              <i className="fas fa-book-open"></i> O-Level (S.1 - S.4)
            </h3>
            <p style={{ marginBottom: '15px' }}>
              Our Lower Secondary program follows the <strong>New Lower Secondary Curriculum</strong> focused on competence-based learning, developing practical skills alongside theoretical knowledge.
            </p>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
              <li><strong>Core Subjects:</strong> Mathematics, English Language, Integrated Science</li>
              <li><strong>Humanities:</strong> Geography, History, Political Education</li>
              <li><strong>Religious Education:</strong> Christian Religious Education / Islamic Religious Education</li>
              <li><strong>Vocational Skills:</strong> Agriculture, ICT, Entrepreneurship, Art & Design</li>
              <li><strong>Languages:</strong> Kiswahili, French (optional)</li>
            </ul>
          </div>
          
          <div className="dept-card">
            <h3 style={{ color: 'var(--primary-green)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.4rem' }}>
              <i className="fas fa-university"></i> A-Level (S.5 - S.6)
            </h3>
            <p style={{ marginBottom: '15px' }}>
              Our Upper Secondary program offers specialized combinations preparing students for university education and professional careers.
            </p>
            <div className="table-responsive">
              <table className="fees-table" style={{ fontSize: '0.9rem' }}>
                <thead>
                  <tr>
                    <th>Sciences & Mathematics</th>
                    <th>Arts & Humanities</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>PCM (Physics, Chemistry, Mathematics)</td><td>HEG (History, Economics, Geography)</td></tr>
                  <tr><td>PCB (Physics, Chemistry, Biology)</td><td>MEG (Mathematics, Economics, Geography)</td></tr>
                  <tr><td>BCM (Biology, Chemistry, Mathematics)</td><td>DEG (Divinity, Economics, Geography)</td></tr>
                  <tr><td>PEM (Physics, Economics, Mathematics)</td><td>HEA (History, Economics, Art)</td></tr>
                  <tr><td>MEE (Mathematics, Ent, Economics)</td><td>HEE (History, Economics, Ent)</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Performance Statistics */}
        <div className="section-box">
          <h2><i className="fas fa-chart-line" style={{ marginRight: '10px' }}></i> Academic Performance</h2>
          <p style={{ marginBottom: '25px' }}>
            Green Field S.S Masindi takes pride in our consistent academic performance in UNEB examinations. Our dedicated teaching staff and supportive learning environment have yielded excellent results year after year.
          </p>
          
          <div className="stats-container" style={{ background: 'none', padding: 0 }}>
            <div className="stat-box" style={{ textAlign: 'center', padding: '25px', background: 'var(--light-bg)', borderRadius: '8px', boxShadow: 'var(--shadow-subtle)', flex: 1, minWidth: '200px' }}>
              <div className="stat-number" style={{ fontSize: '2.5rem', color: 'var(--primary-green)' }}>95%</div>
              <div className="stat-label">UNEB Pass Rate</div>
            </div>
            <div className="stat-box" style={{ textAlign: 'center', padding: '25px', background: 'var(--light-bg)', borderRadius: '8px', boxShadow: 'var(--shadow-subtle)', flex: 1, minWidth: '200px' }}>
              <div className="stat-number" style={{ fontSize: '2.5rem', color: 'var(--primary-green)' }}>42%</div>
              <div className="stat-label">First Grades (O-Level)</div>
            </div>
            <div className="stat-box" style={{ textAlign: 'center', padding: '25px', background: 'var(--light-bg)', borderRadius: '8px', boxShadow: 'var(--shadow-subtle)', flex: 1, minWidth: '200px' }}>
              <div className="stat-number" style={{ fontSize: '2.5rem', color: 'var(--primary-green)' }}>78%</div>
              <div className="stat-label">Division 1 & 2</div>
            </div>
            <div className="stat-box" style={{ textAlign: 'center', padding: '25px', background: 'var(--light-bg)', borderRadius: '8px', boxShadow: 'var(--shadow-subtle)', flex: 1, minWidth: '200px' }}>
              <div className="stat-number" style={{ fontSize: '2.5rem', color: 'var(--primary-green)' }}>15+</div>
              <div className="stat-label">University Scholarships</div>
            </div>
          </div>
          
          <p style={{ marginTop: '25px' }}>
            Our graduates have gained admission to prestigious universities including Makerere University, Kyambogo University, Gulu University, Mbarara University of Science and Technology, and international institutions.
          </p>
        </div>

        {/* Departments */}
        <div className="section-box">
          <h2><i className="fas fa-flask" style={{ marginRight: '10px' }}></i> Academic Departments</h2>
          <div className="grid-container" style={{ marginTop: '25px' }}>
            <div className="dept-card">
              <h4><i className="fas fa-atom"></i> Sciences Department</h4>
              <p>Led by experienced teachers with modern laboratory facilities for Physics, Chemistry, and Biology practicals.</p>
            </div>
            <div className="dept-card">
              <h4><i className="fas fa-globe-africa"></i> Humanities Department</h4>
              <p>Offering History, Geography, Economics, and Political Education with emphasis on critical thinking.</p>
            </div>
            <div className="dept-card">
              <h4><i className="fas fa-language"></i> Languages Department</h4>
              <p>Focus on English proficiency, Kiswahili communication skills, and optional French language.</p>
            </div>
            <div className="dept-card">
              <h4><i className="fas fa-calculator"></i> Mathematics Department</h4>
              <p>Developing problem-solving skills and mathematical reasoning through innovative teaching methods.</p>
            </div>
            <div className="dept-card">
              <h4><i className="fas fa-seedling"></i> Vocational Department</h4>
              <p>Practical skills in Agriculture, ICT, Entrepreneurship, and Art tailored to Masindi's economic context.</p>
            </div>
            <div className="dept-card">
              <h4><i className="fas fa-hands-praying"></i> Religious Education</h4>
              <p>Moral and spiritual development through CRE/IRE, fostering values and ethical decision-making.</p>
            </div>
          </div>
        </div>

        {/* Facilities */}
        <div className="highlight-box">
          <h3><i className="fas fa-school" style={{ marginRight: '10px' }}></i> Facilities for Academic Success</h3>
          <p>Our campus provides state-of-the-art facilities to support learning:</p>
          <ul style={{ marginTop: '15px', paddingLeft: '20px', lineHeight: '1.8' }}>
            <li><strong>Science Laboratories:</strong> Well-equipped labs for Physics, Chemistry, and Biology practicals</li>
            <li><strong>ICT Center:</strong> Modern computer lab with high-speed internet access</li>
            <li><strong>Library & Resource Center:</strong> Well-stocked with textbooks, reference materials, and digital resources</li>
            <li><strong>Classrooms:</strong> Spacious, well-ventilated learning spaces with modern teaching aids</li>
            <li><strong>Agriculture Demonstration Garden:</strong> Practical farming skills for hands-on learning</li>
          </ul>
        </div>
        
        {/* Gallery Section */}
        <div className="section-box">
          <h2><i className="fas fa-images" style={{ marginRight: '10px' }}></i> Academic Life at Green Field</h2>
          <div className="gallery-grid" style={{ marginTop: '25px', marginBottom: 0 }}>
            <div className="gallery-item">
              <img src="/photos/school-laboratory.jpg" alt="Students in Science Lab" />
              <div className="gallery-label">Science Practical Session</div>
            </div>
            <div className="gallery-item">
              <img src="/photos/school-library.jpg" alt="Library Study" />
              <div className="gallery-label">Library Research</div>
            </div>
            <div className="gallery-item">
              <img src="/photos/students-classroom.jpg" alt="Classroom Teaching" />
              <div className="gallery-label">Interactive Classroom</div>
            </div>
            <div className="gallery-item">
              <img src="/photos/school-hall.jpg" alt="ICT Lab" />
              <div className="gallery-label">Information Center</div>
            </div>
          </div>
        </div>

        {/* Career Guidance */}
        <div className="section-box">
          <h2><i className="fas fa-briefcase" style={{ marginRight: '10px' }}></i> Career Guidance & Vocational Focus</h2>
          <p>Recognizing the economic opportunities in the Albertine region, we provide comprehensive career guidance and vocational training:</p>
          <ul style={{ paddingLeft: '20px', marginTop: '15px', lineHeight: '1.8' }}>
            <li><strong>Career Counseling:</strong> Regular sessions on subject selection, career paths, and university applications</li>
            <li><strong>Industry Linkages:</strong> Partnerships with local businesses and organizations for student exposure</li>
            <li><strong>Vocational Skills:</strong> Practical training in Agriculture, ICT, and Entrepreneurship relevant to Masindi</li>
            <li><strong>University Preparation:</strong> Guidance on UCAS, local university applications, and scholarship opportunities</li>
            <li><strong>Entrepreneurship Program:</strong> Developing business skills for self-employment after school</li>
          </ul>
        </div>
        
        {/* Calendar Dates */}
        <div className="section-box">
          <h2><i className="fas fa-calendar-alt" style={{ marginRight: '10px' }}></i> Academic Calendar & Key Dates</h2>
          <p style={{ marginBottom: '20px' }}>Green Field S.S follows the standard Uganda academic calendar with three terms:</p>
          <div className="table-responsive">
            <table className="fees-table">
              <thead>
                <tr>
                  <th>Term</th>
                  <th>Duration</th>
                  <th>Key Activities</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Term I</strong></td>
                  <td>February - April</td>
                  <td>Opening, Mid-term break, Internal Examinations</td>
                </tr>
                <tr>
                  <td><strong>Term II</strong></td>
                  <td>May - August</td>
                  <td>Inter-school competitions, Parent-Teacher meetings, Holiday coaching</td>
                </tr>
                <tr>
                  <td><strong>Term III</strong></td>
                  <td>September - November</td>
                  <td>UNEB Preparations, Final Examinations, Closing Ceremony</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: '15px', fontSize: '0.9rem', color: 'var(--text-light)', fontStyle: 'italic' }}>
            *Note: Specific dates are published at the beginning of each academic year.
          </p>
        </div>
      </div>
    </div>
  );
};
