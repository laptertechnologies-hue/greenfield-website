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
        {user?.role === 'staff' && (
          <Link to="/admin" style={{ color: 'var(--g-700)', fontWeight: 600 }}>
            <i className="fas fa-sliders" />Full Administration Panel
          </Link>
        )}
        <Link to="/app/holiday-work"><i className="fas fa-book-reader" />Holiday Work Packages</Link>
        <Link to="/app/e-learning"><i className="fas fa-graduation-cap" />E-Learning & UNEB Papers</Link>
        <Link to="/app/e-voting"><i className="fas fa-vote-yea" />Prefect & Guild E-Voting</Link>
        <Link to="/app/home"><i className="fas fa-key" />Change Account PIN</Link>
        <button
          onClick={async () => {
            const evt = (window as any).__gfssInstallPrompt;
            if (evt) {
              evt.prompt();
            } else {
              alert('To install Greenfield App on your phone:\n1. Tap the three dots (⋮) at the top-right of your browser.\n2. Tap "Install app" or "Add to Home screen".\n3. Tap "Install".');
            }
          }}
          style={{ color: 'var(--g-700)', fontWeight: 600 }}
        >
          <i className="fas fa-download" />Install App on Phone
        </button>
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
