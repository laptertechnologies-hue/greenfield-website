import { Link } from 'react-router-dom';
import { Shell, Loading } from '../Shell';
import { useChild } from '../PortalApp';
import { SCHOOL, grade, ugx } from '../data';
import { StudentBadge, useStudentData } from './parts';

export function ChildPicker() {
  const { children, child, setChildId } = useChild();
  if (children.length < 2) return null;
  return (
    <div className="pa-chips" role="tablist" aria-label="Choose child">
      {children.map((c) => (
        <button key={c.id} role="tab" aria-selected={child?.id === c.id} className={child?.id === c.id ? 'is-on' : ''} onClick={() => setChildId(c.id)}>
          {c.name.split(' ')[1] ?? c.name}
        </button>
      ))}
    </div>
  );
}

export function ParentHome() {
  const { child } = useChild();
  const d = useStudentData(child);
  return (
    <Shell title="Home" greeting>
      <ChildPicker />
      {!child ? <Loading /> : (
        <>
          <section className="pa-panel"><StudentBadge s={child} /></section>
          <div className="pa-grid">
            <Link to="/app/results" className="pa-stat">
              <div className="pa-stat-top"><span>Term average</span><i className="fas fa-chart-column" /></div>
              <strong>{d.marks ? `${d.average}%` : '…'}</strong>
              <small>{d.marks ? `Grade ${grade(d.average)}, ${SCHOOL.term}` : ''}</small>
            </Link>
            <Link to="/app/attendance" className="pa-stat">
              <div className="pa-stat-top"><span>Attendance</span><i className="fas fa-calendar-check" /></div>
              <strong>{d.days ? `${d.present}%` : '…'}</strong>
              <small>September</small>
            </Link>
          </div>
          <Link to="/app/fees" className={`pa-balance pa-balance--link ${d.balance > 0 ? 'is-due' : 'is-clear'}`}>
            <span>{d.balance > 0 ? 'Fees balance due' : 'Fees fully paid'}</span>
            <strong>{d.fees ? ugx(d.balance) : '…'}</strong>
            <small>See statement and how to pay</small>
          </Link>
          <section className="pa-panel">
            <div className="pa-panel-head"><h3>From the school</h3></div>
            <ul className="pa-notices">
              <li><strong>Visiting day</strong><span>Sunday 11 October, 9am to 4pm. Bring the visitor’s card.</span></li>
              <li><strong>End of term exams</strong><span>Begin Monday 16 November for all classes.</span></li>
            </ul>
          </section>
        </>
      )}
    </Shell>
  );
}
