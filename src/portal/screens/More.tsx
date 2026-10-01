import { Link, useNavigate } from 'react-router-dom';
import { Shell } from '../Shell';
import { useAuth } from '../auth';
import { SCHOOL } from '../data';

export function More() {
  const { user, signOut } = useAuth();
  const nav = useNavigate();
  return (
    <Shell title="More">
      <section className="pa-panel pa-me">
        <span className="pa-avatar pa-avatar--lg">{user?.initials}</span>
        <div><h2>{user?.name}</h2><p>{user?.title}</p></div>
      </section>
      <nav className="pa-menu">
        <a href={`tel:${SCHOOL.phone.replace(/\s/g, '')}`}><i className="fas fa-phone" />Call the school</a>
        <a href={`mailto:${SCHOOL.email}`}><i className="fas fa-envelope" />Email the school</a>
        <Link to="/"><i className="fas fa-globe" />School website</Link>
        <Link to="/gallery"><i className="fas fa-images" />Photo gallery</Link>
        <a href="/privacy-policy.html"><i className="fas fa-shield-halved" />Privacy policy</a>
        <button onClick={() => { signOut(); nav('/app', { replace: true }); }} className="pa-menu-danger"><i className="fas fa-right-from-bracket" />Sign out</button>
      </nav>
      <p className="pa-note pa-center">{SCHOOL.name}, {SCHOOL.town}. {SCHOOL.motto}.</p>
    </Shell>
  );
}
