import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { updateSEO } from '../utils/seo';

export const Home: React.FC = () => {
  useEffect(() => {
    updateSEO(
      'GREENFIELD SECONDARY SCHOOL Masindi | O & A Level School | Since 1995',
      'GREENFIELD SECONDARY SCHOOL Masindi - O & A Level Mixed Day & Boarding School. Offering Arts, Sciences & Vocational Studies. Registered Ministry of Education PSS/G/17. UNEB Centre U1385. DIT Centre UVQF/1215'
    );
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero" id="home">
        <video 
          className="hero-video" 
          autoPlay 
          muted 
          loop 
          playsInline 
          aria-label="Background video showing GREENFIELD SECONDARY SCHOOL campus"
        >
          <source src="/bkg.mp4" type="video/mp4" />
          {/* Fallback image */}
          <img 
            src="/photos/school-campus-hero.jpg" 
            alt="GREENFIELD SECONDARY SCHOOL Campus in Masindi - Aerial View" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </video>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>GREENFIELD SECONDARY SCHOOL MASINDI</h1>
          <p>'O' & 'A' Level Mixed Day & Boarding School | Ministry of Education PSS/G/17 | UNEB Centre U1385 | DIT Centre UVQF/1215</p>
          <div>
            <Link to="/admissions" className="btn">2026 Admission Open</Link>
            <a href="#fees" className="btn btn-secondary">View Fees Structure</a>
          </div>
        </div>
      </section>

      {/* Statistics Banner */}
      <div className="stats-banner">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">30+</div>
            <div className="stat-label">Years of Excellence</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">U1385</div>
            <div className="stat-label">UNEB Centre No.</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">UVQF/1215</div>
            <div className="stat-label">DIT Centre No.</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">PSS/G/17</div>
            <div className="stat-label">Ministry Registration</div>
          </div>
        </div>
      </div>

      {/* Subjects Offered Section */}
      <section className="container section-padding">
        <h2 className="section-title">Subjects Offered at 'O' Level</h2>
        <div className="subjects-grid">
          <div className="subject-item">English</div>
          <div className="subject-item">Physics</div>
          <div className="subject-item">Biology</div>
          <div className="subject-item">Chemistry</div>
          <div className="subject-item">Mathematics</div>
          <div className="subject-item">History & Political Education</div>
          <div className="subject-item">Geography</div>
          <div className="subject-item">Religious Education</div>
          <div className="subject-item">Agriculture</div>
          <div className="subject-item">Literature</div>
          <div className="subject-item">Computer Studies</div>
          <div className="subject-item">Entrepreneurship</div>
          <div className="subject-item">Art & Design</div>
          <div className="subject-item">Kiswahili</div>
          <div className="subject-item">Physical Education</div>
        </div>
        
        <h3 style={{ marginTop: '40px', color: 'var(--primary-green)', textAlign: 'center', fontSize: '1.5rem', fontWeight: 600 }}>
          Subjects Offered at 'A' Level
        </h3>
        <div className="subjects-grid">
          <div className="subject-item">G.P</div>
          <div className="subject-item">Sub. Math</div>
          <div className="subject-item">Sub. ICT</div>
          <div className="subject-item">Chemistry</div>
          <div className="subject-item">Physics</div>
          <div className="subject-item">Math</div>
          <div className="subject-item">Biology</div>
          <div className="subject-item">Agriculture</div>
          <div className="subject-item">History</div>
          <div className="subject-item">Divinity</div>
          <div className="subject-item">Geography</div>
          <div className="subject-item">Art and Design</div>
          <div className="subject-item">Entrepreneurship</div>
          <div className="subject-item">Economics</div>
          <div className="subject-item">Literature</div>
        </div>

        <h3 style={{ marginTop: '40px', color: 'var(--primary-green)', textAlign: 'center', fontSize: '1.5rem', fontWeight: 600 }}>
          Vocational Subjects
        </h3>
        <div className="subjects-grid">
          <div className="subject-item">Tailoring</div>
          <div className="subject-item">Domestic Electrical Engineering</div>
          <div className="subject-item">Hair Dressing</div>
          <div className="subject-item">Catering</div>
          <div className="subject-item">Building and Construction</div>
          <div className="subject-item">Electronic Engineering</div>
          <div className="subject-item">Weaving and Beading</div>
        </div>
      </section>

      {/* Fees Structure Section */}
      <section id="fees" className="container fees-section" style={{ borderTop: '5px solid var(--accent-green)' }}>
        <h2 className="section-title">2026 Fees Structure & Requirements</h2>
        
        <div className="bank-info">
          <h4><i className="fas fa-university" style={{ marginRight: '10px' }}></i> Bank Payment Information</h4>
          <p style={{ marginBottom: '8px' }}><strong>PEARL BANK:</strong> A/C 1630017000193</p>
          <p style={{ marginBottom: '8px' }}><strong>Mobile Payment:</strong> Use student's pay code: *165*4# (MTN) or *185*6# (AIRTEL)</p>
          <p style={{ fontWeight: '500', color: 'var(--dark-green)' }}>
            <strong>Note:</strong> A student of S.1 and S.2 is required to pay a fee of 80,000 UGX for vocational studies per term.
          </p>
        </div>

        <h3 style={{ marginTop: '40px', color: 'var(--primary-green)', fontSize: '1.4rem', fontWeight: 600 }}>
          School Fees
        </h3>
        <div className="table-responsive">
          <table className="fees-table">
            <thead>
              <tr>
                <th>Class</th>
                <th>Day (UGX)</th>
                <th>Boarding (UGX)</th>
                <th>Bank Charge</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>S.1 - S.2</td>
                <td>185,000</td>
                <td>415,000</td>
                <td>2,300</td>
              </tr>
              <tr>
                <td>S.3 - S.4</td>
                <td>215,000</td>
                <td>435,000</td>
                <td>2,300</td>
              </tr>
              <tr>
                <td>S.5 - S.6</td>
                <td>295,000</td>
                <td>525,000</td>
                <td>2,300</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 style={{ marginTop: '40px', color: 'var(--primary-green)', fontSize: '1.4rem', fontWeight: 600 }}>
          Admission Charges (Paid Once)
        </h3>
        <div className="table-responsive">
          <table className="fees-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Amount (UGX)</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Admission fee</td><td>10,000</td></tr>
              <tr><td>Identity card</td><td>5,000</td></tr>
              <tr><td>Passport photo</td><td>5,000</td></tr>
              <tr><td>Student file</td><td>1,000</td></tr>
              <tr><td>Development fee</td><td>25,000</td></tr>
              <tr className="highlight"><td><strong>Total</strong></td><td><strong>46,000</strong></td></tr>
            </tbody>
          </table>
        </div>

        <h3 style={{ marginTop: '40px', color: 'var(--primary-green)', fontSize: '1.4rem', fontWeight: 600 }}>
          School Uniform
        </h3>
        <div className="table-responsive">
          <table className="fees-table">
            <thead>
              <tr>
                <th>Items</th>
                <th>Day (UGX)</th>
                <th>Boarding (Boys)</th>
                <th>Boarding (Girls)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Skirt/trouser, shirt and tie.</td>
                <td>60,000</td>
                <td>60,000</td>
                <td>60,000</td>
              </tr>
              <tr>
                <td>School t-shirt.</td>
                <td>30,000</td>
                <td>30,000</td>
                <td>30,000</td>
              </tr>
              <tr>
                <td>School sweater.</td>
                <td>35,000</td>
                <td>35,000</td>
                <td>35,000</td>
              </tr>
              <tr>
                <td>Domestic t-shirt</td>
                <td>-</td>
                <td>30,000</td>
                <td>15,000</td>
              </tr>
              <tr>
                <td>Domestic dress</td>
                <td>-</td>
                <td>-</td>
                <td>30,000</td>
              </tr>
              <tr className="highlight">
                <td><strong>Total</strong></td>
                <td><strong>125,000</strong></td>
                <td><strong>155,000</strong></td>
                <td><strong>170,000</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 style={{ marginTop: '40px', color: 'var(--primary-green)', fontSize: '1.4rem', fontWeight: 600 }}>
          School Functional / Other Requirements
        </h3>
        <div className="table-responsive">
          <table className="fees-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>O Level (Day)</th>
                <th>A Level (Day)</th>
                <th>O Level (Boarding)</th>
                <th>A Level (Boarding)</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>UNSA/SESSMAT/ASSHU paid per year.</td><td>6,500</td><td>6,500</td><td>6,500</td><td>6,500</td></tr>
              <tr><td>Pregnancy test (girls)</td><td>2,000</td><td>2,000</td><td>2,000</td><td>2,000</td></tr>
              <tr><td>Assessment fee</td><td>5,000</td><td>5,000</td><td>5,000</td><td>5,000</td></tr>
              <tr><td>First aid / medical</td><td>-</td><td>-</td><td>15,000</td><td>15,000</td></tr>
              <tr><td>Project fee</td><td>10,000</td><td>10,000</td><td>10,000</td><td>10,000</td></tr>
              <tr><td>Science / computer lab fee.</td><td>-</td><td>10,000</td><td>-</td><td>10,000</td></tr>
              <tr><td>Hair shaving</td><td>-</td><td>-</td><td>3,000</td><td>3,000</td></tr>
              <tr className="highlight"><td><strong>TOTAL Girls</strong></td><td><strong>23,500</strong></td><td><strong>33,500</strong></td><td><strong>41,500</strong></td><td><strong>51,500</strong></td></tr>
              <tr className="highlight"><td><strong>TOTAL Boys</strong></td><td><strong>21,500</strong></td><td><strong>31,500</strong></td><td><strong>39,500</strong></td><td><strong>49,500</strong></td></tr>
            </tbody>
          </table>
        </div>

        <h3 style={{ marginTop: '40px', color: 'var(--primary-green)', fontSize: '1.4rem', fontWeight: 600 }}>
          Physical Requirements
        </h3>
        <div className="table-responsive">
          <table className="fees-table">
            <thead>
              <tr>
                <th>Items</th>
                <th>Quantity (Day)</th>
                <th>Quantity (Boarding)</th>
                <th>Class</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Ruled papers per term</td><td>1 ream</td><td>1 ream</td><td>S.1 and S.2</td></tr>
              <tr><td>Photocopying papers per term</td><td>1 ream</td><td>1 ream</td><td>S.3, S.4, S.5 and S.6</td></tr>
              <tr><td>Toilet papers per term</td><td>2 rolls</td><td>4 rolls</td><td>All</td></tr>
              <tr><td>Soft broom per term</td><td>1 piece</td><td>1 piece</td><td>S.4, S.5 and S.6</td></tr>
              <tr><td>Hard broom per term</td><td>1 piece</td><td>1 piece</td><td>S.1, S.2 and S.3</td></tr>
              <tr><td>Scrubbers on admission</td><td>1 piece</td><td>1 piece</td><td>S.1, S.2 and S.3</td></tr>
              <tr><td>A rag</td><td>1 piece</td><td>1 piece</td><td>S.4, S.5 and S.6</td></tr>
            </tbody>
          </table>
        </div>

        <div style={{ background: '#f0f7f0', padding: '30px', borderRadius: '8px', marginTop: '40px', boxShadow: 'var(--shadow-subtle)' }}>
          <h4 style={{ color: 'var(--primary-green)', marginBottom: '15px' }}><i className="fas fa-info-circle"></i> Optional Payments</h4>
          <ul style={{ listStyle: 'none', paddingLeft: '10px', marginBottom: '25px' }}>
            <li style={{ marginBottom: '8px' }}>• A jumper: 40,000 UGX</li>
            <li>• Lunch for day scholars: 70,000 UGX</li>
          </ul>
          
          <h4 style={{ color: 'var(--primary-green)', marginBottom: '15px' }}><i className="fas fa-suitcase"></i> Personal Requirements for Boarding Students</h4>
          <ul style={{ listStyle: 'none', paddingLeft: '10px', lineHeight: '1.8' }}>
            <li>• Enough stationery (books, pens, a mathematical set, graph papers etc.)</li>
            <li>• A pair of black shoes, shoe polish, and at least 3 pairs of white stockings for girls.</li>
            <li>• A black skirt (Caribbean) for girls and 2 black trousers for boys.</li>
            <li>• A mattress, 1 pair of bed sheets, a blanket, mosquito net, and a nightdress for girls.</li>
            <li>• 4 packets of sanitary pads and enough knickers for girls.</li>
            <li>• A lockable metallic box with a strong padlock.</li>
            <li>• A plate, a fork, a spoon, and a water bottle.</li>
            <li>• Pocket money of at least 20,000 UGX, 3 bars of soap, and at least 4 kg of sugar.</li>
          </ul>

          <p style={{ marginTop: '30px', color: 'var(--dark-green)', fontWeight: '500', lineHeight: '1.7', borderLeft: '4px solid var(--gold)', paddingLeft: '15px' }}>
            You will report to school with this admission and if you don't turn up two weeks after the official opening of the term, you will lose your vacancy to the waiting student.
            <br /><br />
            We congratulate you on this achievement and look forward to welcoming you into our school community.
          </p>
          <div style={{ marginTop: '30px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
            <p style={{ margin: 0 }}>Yours faithfully,</p>
            <p style={{ fontWeight: 'bold', margin: '5px 0 0 0' }}>CHARLES EKYAGONZA</p>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-light)' }}>HEADTEACHER</p>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="container section-padding">
        <h2 className="section-title">Our Core Values</h2>
        <div className="grid-container">
          <div className="card">
            <div className="card-icon"><i className="fas fa-graduation-cap" aria-hidden="true"></i></div>
            <h3>Academic Excellence</h3>
            <p>Comprehensive 'O' & 'A' Level curriculum with vocational training for holistic development.</p>
          </div>
          <div className="card">
            <div className="card-icon"><i className="fas fa-user-shield" aria-hidden="true"></i></div>
            <h3>Discipline & Integrity</h3>
            <p>Strict adherence to school rules and code of conduct for character building.</p>
          </div>
          <div className="card">
            <div className="card-icon"><i className="fas fa-briefcase" aria-hidden="true"></i></div>
            <h3>Vocational Skills</h3>
            <p>Practical skills in electrical, tailoring, construction, hair dressing and more for self-reliance.</p>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section-padding" style={{ backgroundColor: '#f0f7f0' }}>
        <h2 className="section-title">Why Choose GREENFIELD?</h2>
        <div className="grid-container">
          <div className="card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}><i className="fas fa-certificate" style={{ color: 'var(--accent-green)', marginRight: '10px' }}></i> Registered Institution</h3>
            <p>Fully registered with Ministry of Education & Sports (PSS/G/17), UNEB Centre U1385, DIT Centre UVQF/1215.</p>
          </div>
          <div className="card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}><i className="fas fa-hands-helping" style={{ color: 'var(--accent-green)', marginRight: '10px' }}></i> Mixed Day & Boarding</h3>
            <p>Flexible options for both day and boarding students from Masindi and neighboring districts.</p>
          </div>
          <div className="card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}><i className="fas fa-tools" style={{ color: 'var(--accent-green)', marginRight: '10px' }}></i> Vocational Training</h3>
            <p>Comprehensive vocational skills development alongside academic education.</p>
          </div>
          <div className="card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}><i className="fas fa-map-marker-alt" style={{ color: 'var(--accent-green)', marginRight: '10px' }}></i> Strategic Location</h3>
            <p>Located in Kihande 1 Cell along Masindi - Hoima road 3 km from Masindi Town.</p>
          </div>
        </div>
      </section>

      {/* Contact Information Quick Cards */}
      <section className="container section-padding">
        <h2 className="section-title">Contact Information</h2>
        <div className="grid-container">
          <div className="card">
            <h3><i className="fas fa-phone" style={{ color: 'var(--primary-green)', marginBottom: '15px', display: 'block', fontSize: '2rem' }}></i> Telephone</h3>
            <p>0777221087 (Headteacher)<br />0772904964 / 0779336404 (Directors)</p>
          </div>
          <div className="card">
            <h3><i className="fas fa-envelope" style={{ color: 'var(--primary-green)', marginBottom: '15px', display: 'block', fontSize: '2rem' }}></i> Email</h3>
            <p>greenfieldsecondaryschool@gmail.com</p>
          </div>
          <div className="card">
            <h3><i className="fas fa-map-marker-alt" style={{ color: 'var(--primary-green)', marginBottom: '15px', display: 'block', fontSize: '2rem' }}></i> Address</h3>
            <p>P.O. Box 191, Masindi<br />Kihande 1 Cell along Masindi - Hoima road</p>
          </div>
          <div className="card">
            <h3><i className="fas fa-user-tie" style={{ color: 'var(--primary-green)', marginBottom: '15px', display: 'block', fontSize: '2rem' }}></i> Headteacher</h3>
            <p>CHARLES EKYAGONZA<br />Headteacher</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding" style={{ background: 'linear-gradient(to right, var(--primary-green), var(--dark-green))', color: 'white', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.2rem', marginBottom: '20px', fontWeight: 700 }}>2026 Admission Now Open!</h2>
        <p style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto 30px', opacity: 0.9 }}>
          Report early to avoid losing your vacancy to a needy applicant. Provisional admission available for 'O' Level Day section.
        </p>
        <div>
          <Link to="/admissions" className="btn" style={{ background: 'white', color: 'var(--primary-green)', marginRight: '15px' }}>Apply Now</Link>
          <Link to="/contact" className="btn btn-secondary">Contact Admissions</Link>
        </div>
      </section>
    </div>
  );
};
