import React, { useEffect, useState } from 'react';
import { updateSEO } from '../utils/seo';

type CategoryType = 'all' | 'campus' | 'academics' | 'sports';

export const Gallery: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<CategoryType>('all');

  useEffect(() => {
    updateSEO(
      'Gallery | GREENFIELD SECONDARY SCHOOL Masindi',
      'Explore life at GREENFIELD SECONDARY SCHOOL Masindi through our photo and video gallery. See our campus, students, and activities.'
    );
  }, []);

  const galleryItems = [
    // Campus & Leadership
    { src: '/photos/o_level_prefects.jpg', title: 'O-Level Prefects', desc: 'Leadership in the making.', category: 'campus' },
    { src: '/photos/a_level_prefects.jpg', title: 'A-Level Prefects', desc: 'Guidance and responsibility.', category: 'campus' },
    { src: '/photos/school-campus-hero.jpg', title: 'School Campus', desc: 'Beautiful landscape view.', category: 'campus' },
    { src: '/photos/school-entrance.jpg', title: 'Main Gate', desc: 'Front entrance of the school.', category: 'campus' },
    { src: '/photos/school-hall.jpg', title: 'School Hall', desc: 'Venue for assemblies and main events.', category: 'campus' },
    { src: '/photos/dormitory-view.jpg', title: 'Student Dormitories', desc: 'Day and boarding living facilities.', category: 'campus' },

    // Academics
    { src: '/photos/science lab.jpg', title: 'Science Lab', desc: 'Innovation and exploration.', category: 'academics' },
    { src: '/photos/computer lab.jpg', title: 'ICT Center', desc: 'Empowering digital literacy.', category: 'academics' },
    { src: '/photos/library.jpg', title: 'Main Library', desc: 'A hub for knowledge and research.', category: 'academics' },
    { src: '/photos/class time.jpg', title: 'Classroom Session', desc: 'Active learning and engagement.', category: 'academics' },
    { src: '/photos/graduants-celebration.jpg', title: 'Graduation Day', desc: 'Celebrating our successful candidates.', category: 'academics' },

    // Sports (Original and 18 new photos)
    { src: '/photos/sports-ground.jpg', title: 'Sports Grounds', desc: 'Fields for extracurricular sports activities.', category: 'sports' },
    { src: '/photos/sports (1).jpg', title: 'Football Kick-off', desc: 'The school team starts the match with intense energy.', category: 'sports' },
    { src: '/photos/sports (2).jpg', title: 'Athletics Sprint', desc: 'Runners blasting off from the starting blocks during the championship.', category: 'sports' },
    { src: '/photos/sports (3).jpg', title: 'Basketball Warmups', desc: 'Students practicing layups and shooting drills on our courts.', category: 'sports' },
    { src: '/photos/sports (4).jpg', title: 'Volleyball Serve', desc: 'A powerful serve during the inter-house volleyball tournament.', category: 'sports' },
    { src: '/photos/sports (5).jpg', title: 'Goalkeeper Save', desc: 'Spectacular diving save by the school team goalkeeper.', category: 'sports' },
    { src: '/photos/sports (6).jpg', title: 'Relay Exchange', desc: 'Flawless baton pass during the 4x100m relay racing finals.', category: 'sports' },
    { src: '/photos/sports (7).jpg', title: 'Netball Inter-House', desc: 'Vibrant defense and shooting action in an intense netball clash.', category: 'sports' },
    { src: '/photos/sports (8).jpg', title: 'School Athletics Team', desc: 'Group photo of Greenfield\'s championship track and field team.', category: 'sports' },
    { src: '/photos/sports (9).jpg', title: 'High Jump Attempt', desc: 'An athlete clearing the bar with standard Fosbury Flop technique.', category: 'sports' },
    { src: '/photos/sports (10).jpg', title: 'Football Team Group', desc: 'Greenfield Secondary School\'s senior boys football team.', category: 'sports' },
    { src: '/photos/sports (11).jpg', title: 'Tug of War', desc: 'Tense and fun teamwork during the annual sports day festival.', category: 'sports' },
    { src: '/photos/sports (12).jpg', title: 'Volleyball Spiker', desc: 'An intense jump spike over the net during the volleyball finals.', category: 'sports' },
    { src: '/photos/sports (13).jpg', title: 'Midfield Battle', desc: 'Football players competing for possession in the midfield.', category: 'sports' },
    { src: '/photos/sports (14).jpg', title: 'Track Runners', desc: 'Final stretch of the 800m middle-distance running event.', category: 'sports' },
    { src: '/photos/sports (15).jpg', title: 'Trophy Presentation', desc: 'Celebrating victory and lifting the championship cup.', category: 'sports' },
    { src: '/photos/sports (16).jpg', title: 'Girls Football Match', desc: 'Competitive match showing girls sports empowerment.', category: 'sports' },
    { src: '/photos/sports (17).jpg', title: 'Long Jump Fly', desc: 'An athlete soaring through the air towards the sandpit.', category: 'sports' },
    { src: '/photos/sports (18).jpg', title: 'Supporters and Cheers', desc: 'Vibrant cheer section supporting their favorite sports house.', category: 'sports' }
  ];

  const filteredItems = activeFilter === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeFilter);

  return (
    <div>
      {/* Banner */}
      <section className="page-banner">
        <div>
          <h1>Moments & Memories</h1>
          <p>Capturing Excellence in Action</p>
        </div>
      </section>

      <div className="container">
        {/* Photo Gallery */}
        <h2 className="section-title">Photo Gallery</h2>

        {/* Category Filters */}
        <div className="gallery-filters">
          <button 
            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All Photos
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'campus' ? 'active' : ''}`}
            onClick={() => setActiveFilter('campus')}
          >
            Campus & Leadership
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'academics' ? 'active' : ''}`}
            onClick={() => setActiveFilter('academics')}
          >
            Academics & Study
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'sports' ? 'active' : ''}`}
            onClick={() => setActiveFilter('sports')}
          >
            Sports & Athletics
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="gallery-grid">
          {filteredItems.map((item, index) => (
            <div key={index} className="gallery-item">
              <img src={item.src} alt={item.title} />
              <div className="item-overlay">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Video Highlights */}
        <h2 className="section-title">Video Highlights</h2>
        <div className="video-section">
          <div className="video-container">
            <video controls poster="/photos/school-campus-hero.jpg">
              <source src="/bkg.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="video-info">
            <h3>Our School in Action</h3>
            <p>A glimpse into the daily life and beautiful campus of Greenfield Secondary School.</p>
          </div>
        </div>

        {/* School Activities & Events Timeline */}
        <div className="timeline-section">
          <h2 className="section-title">School Activities & Events Timeline</h2>
          <p style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 40px', color: '#666' }}>
            Explore our journey through the years. From academic milestones to vibrant extracurricular festivals, see how we grow and celebrate together.
          </p>
          
          {/* 2026 Activities */}
          <div className="year-block">
            <div className="year-header">
              <span className="year-label">2026</span>
              <h3>Current Year Highlights</h3>
            </div>
            <div className="year-description">
              <p>
                The academic year 2026 has kicked off with renewed energy and focus. Highlights include the induction of our new Prefects Body, the launch of our vocational skills program enhancement, and our annual "Excellence in Academics" seminar. We are committed to maintaining our tradition of hard work and excellence.
              </p>
            </div>
            <div className="gallery-grid">
              <div className="gallery-item" style={{ height: '260px' }}>
                <img src="/photos/o_level_prefects.jpg" alt="2026 O-Level Prefects" />
                <div className="item-overlay">
                  <h3>Prefects Induction</h3>
                  <p>Swearing-in ceremony for the 2026 student leaders.</p>
                </div>
              </div>
              <div className="gallery-item" style={{ height: '260px' }}>
                <img src="/photos/science lab.jpg" alt="2026 Science Fair" />
                <div className="item-overlay">
                  <h3>Science & Innovation</h3>
                  <p>Students exploring practical solutions in our lab.</p>
                </div>
              </div>
            </div>
          </div>

          {/* 2025 Activities */}
          <div className="year-block" style={{ marginTop: '60px' }}>
            <div className="year-header" style={{ borderColor: '#888' }}>
              <span className="year-label" style={{ background: '#888' }}>2025</span>
              <h3>Past Year Memories</h3>
            </div>
            <div className="year-description">
              <p>
                2025 was a year of immense achievement and community building. We celebrated outstanding UNEB results, hosted a successful regional sports gala, and expanded our library facilities to better serve our growing student body. The spirit of Greenfield was evident in every event and milestone.
              </p>
            </div>
            <div className="gallery-grid">
              <div className="gallery-item" style={{ height: '260px' }}>
                <img src="/photos/graduants-celebration.jpg" alt="2025 Graduation" />
                <div className="item-overlay">
                  <h3>2025 Graduation</h3>
                  <p>Celebrating the success of our senior candidates.</p>
                </div>
              </div>
              <div className="gallery-item" style={{ height: '260px' }}>
                <img src="/photos/sports-ground.jpg" alt="2025 Sports Day" />
                <div className="item-overlay">
                  <h3>Inter-House Sports</h3>
                  <p>A display of talent, teamwork, and athletic spirit.</p>
                </div>
              </div>
              <div className="gallery-item" style={{ height: '260px' }}>
                <img src="/photos/library.jpg" alt="2025 Library Expansion" />
                <div className="item-overlay">
                  <h3>Library Commissioning</h3>
                  <p>Expanding our resources for a brighter future.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Handlers */}
        <div className="social-section" style={{ borderTop: '1px solid #ddd', paddingTop: '40px' }}>
          <h2 className="section-title">Follow Us & Stay Connected</h2>
          <p style={{ color: 'var(--text-light)', maxWidth: '600px', margin: '0 auto 20px' }}>
            Stay updated with the latest news, events, and achievements by following our social media handles.
          </p>
          <div className="social-links" style={{ justifyContent: 'center' }}>
            <a href="#" className="social-icon facebook" title="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social-icon twitter" title="Twitter/X"><i className="fab fa-x-twitter"></i></a>
            <a href="#" className="social-icon whatsapp" title="WhatsApp"><i className="fab fa-whatsapp"></i></a>
            <a href="#" className="social-icon youtube" title="YouTube"><i className="fab fa-youtube"></i></a>
          </div>
        </div>
      </div>
    </div>
  );
};
