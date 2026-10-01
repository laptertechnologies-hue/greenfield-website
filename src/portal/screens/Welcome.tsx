import { Link } from 'react-router-dom';
import { SCHOOL } from '../data';

export function Welcome() {
  return (
    <div className="pa-welcome">
      <div className="pa-welcome-photo" style={{ backgroundImage: "url('/photos/students-classroom.jpg')" }}>
        <img src={SCHOOL.logo} alt={`${SCHOOL.name} crest`} className="pa-welcome-crest" />
      </div>
      <section className="pa-welcome-card">
        <h1>Welcome to the {SCHOOL.short} portal</h1>
        <p>Parents and students can follow <strong>results</strong>, <strong>school fees</strong> and <strong>attendance</strong> any time, right from the phone.</p>
        <div className="pa-welcome-actions">
          <Link to="/app/sign-in" className="pa-btn">Get started</Link>
          <p className="pa-fineprint"><i className="fas fa-lock" /> Encrypted connection. Sessions end when you sign out.</p>
          <Link to="/" className="pa-link-muted">Back to the school website</Link>
        </div>
      </section>
    </div>
  );
}
