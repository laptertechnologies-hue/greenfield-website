import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import type { HeroSlide } from '../utils/api';

// Fallback local slides if DB is unreachable
const FALLBACK_SLIDES: HeroSlide[] = [
  { id: 1, image_url: '/photos/DSC_1181.JPG',        title: 'Welcome to Greenfield Secondary School', caption: "O & A Level Mixed Day & Boarding School — Kihande Hill, Masindi", slide_order: 1, active: true },
  { id: 2, image_url: '/photos/DSC_1192.JPG',        title: 'Excellence in Education Since 1995',     caption: 'Ministry of Education PSS/G/17 | UNEB Centre U1385 | DIT Centre UVQF/1215', slide_order: 2, active: true },
  { id: 3, image_url: '/photos/DSC_1210.JPG',        title: 'Academic Excellence',                    caption: 'Quality Education in Arts, Sciences & Vocational Studies', slide_order: 3, active: true },
  { id: 4, image_url: '/photos/graduants-celebration.jpg', title: 'Celebrating Our Graduates',        caption: 'Congratulations to all our students on their outstanding achievements', slide_order: 4, active: true },
  { id: 5, image_url: '/photos/sports (1).jpg',      title: 'Thriving Sports Culture',               caption: 'Nurturing Champions — Body, Mind and Spirit', slide_order: 5, active: true },
  { id: 6, image_url: '/photos/DSC_1227.JPG',        title: 'Modern Facilities',                     caption: 'State-of-the-art classrooms, computer labs, library and dormitories', slide_order: 6, active: true },
];

const SLIDE_INTERVAL = 5000; // 5 seconds

export const HeroSlideshow: React.FC = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [current, setCurrent] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load slides from API with fallback
  useEffect(() => {
    api.getHeroSlides()
      .then(data => {
        setSlides(data.length > 0 ? data : FALLBACK_SLIDES);
        setIsLoaded(true);
      })
      .catch(() => {
        setSlides(FALLBACK_SLIDES);
        setIsLoaded(true);
      });
  }, []);

  const next = useCallback(() => {
    setCurrent(prev => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent(prev => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goTo = (index: number) => {
    setCurrent(index);
    resetTimer();
  };

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, SLIDE_INTERVAL);
  };

  // Auto-advance
  useEffect(() => {
    if (!isLoaded || slides.length === 0) return;
    timerRef.current = setInterval(next, SLIDE_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isLoaded, slides.length, next]);

  if (!isLoaded || slides.length === 0) {
    return (
      <section className="hero hero-loading" id="home">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>GREENFIELD SECONDARY SCHOOL MASINDI</h1>
          <p>'O' &amp; 'A' Level Mixed Day &amp; Boarding School | Kihande Hill, Masindi</p>
          <div>
            <Link to="/admissions" className="btn">2026 Admission Open</Link>
            <Link to="/about" className="btn btn-secondary">Learn More</Link>
          </div>
        </div>
      </section>
    );
  }

  const slide = slides[current];

  return (
    <section className="hero hero-slideshow" id="home" aria-label="School photo slideshow">
      {/* Slide Images */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`hero-slide ${i === current ? 'active' : ''}`}
          aria-hidden={i !== current}
        >
          <img
            src={s.image_url}
            alt={s.title || `School photo ${i + 1}`}
            className="hero-slide-img"
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        </div>
      ))}

      <div className="hero-overlay" />

      {/* Content */}
      <div className="hero-content">
        <div className="hero-slide-badge">
          <i className="fas fa-school" /> Greenfield Secondary School
        </div>
        <h1 key={slide.id + '-title'}>{slide.title}</h1>
        <p key={slide.id + '-caption'}>{slide.caption}</p>
        <div className="hero-cta-buttons">
          <Link to="/admissions" className="btn">
            <i className="fas fa-user-plus" /> 2026 Admission Open
          </Link>
          <Link to="/portal" className="btn btn-secondary">
            <i className="fas fa-user-shield" /> Student Portal
          </Link>
        </div>
      </div>

      {/* Arrow Controls */}
      <button
        className="hero-arrow hero-arrow-prev"
        onClick={() => { prev(); resetTimer(); }}
        aria-label="Previous slide"
      >
        <i className="fas fa-chevron-left" />
      </button>
      <button
        className="hero-arrow hero-arrow-next"
        onClick={() => { next(); resetTimer(); }}
        aria-label="Next slide"
      >
        <i className="fas fa-chevron-right" />
      </button>

      {/* Dot Indicators */}
      <div className="hero-dots" role="tablist" aria-label="Slide navigation">
        {slides.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === current}
            aria-label={`Go to slide ${i + 1}`}
            className={`hero-dot ${i === current ? 'active' : ''}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="hero-counter">
        <span>{current + 1}</span> / <span>{slides.length}</span>
      </div>
    </section>
  );
};
