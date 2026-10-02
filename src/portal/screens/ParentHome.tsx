import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shell, Loading } from '../Shell';
import { useChild } from '../PortalApp';
import { SCHOOL, grade, ugx, api } from '../data';
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
  const [notices, setNotices] = useState<{ id?: number; title: string; content: string }[]>([]);
  const [showPinModal, setShowPinModal] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [pinStatus, setPinStatus] = useState('');
  const [pinDismissed, setPinDismissed] = useState(() => localStorage.getItem('gfss_pin_dismissed') === 'true');

  const [urgentNotice, setUrgentNotice] = useState<{ id?: number; title: string; content: string } | null>(null);
  const [canNotify, setCanNotify] = useState(() => 'Notification' in window && Notification.permission === 'default');

  useEffect(() => {
    api.announcements().then((res: any[]) => {
      if (res && res.length > 0) {
        setNotices(res.slice(0, 4));
        const urgent = res.find((n) => n.priority === 'urgent' && !localStorage.getItem(`gfss_seen_urgent_${n.id}`));
        if (urgent) setUrgentNotice(urgent);
      }
    }).catch(() => {});
  }, []);

  async function requestNotification() {
    if (!('Notification' in window)) return;
    try {
      const perm = await Notification.requestPermission();
      setCanNotify(false);
      if (perm === 'granted' && 'serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.ready;
        reg.showNotification('Greenfield Secondary School', {
          body: 'Notifications active! You will now receive school alerts and circulars.',
          icon: '/icon-192.png',
          badge: '/icon-192.png',
        });
      }
    } catch {
      setCanNotify(false);
    }
  }

  function dismissUrgent(id?: number) {
    if (id) localStorage.setItem(`gfss_seen_urgent_${id}`, 'true');
    setUrgentNotice(null);
  }

  async function handleUpdatePin(e: React.FormEvent) {
    e.preventDefault();
    if (!newPin || newPin.length < 4) {
      setPinStatus('Please enter a 4-digit PIN.');
      return;
    }
    try {
      setPinStatus('Saving PIN...');
      await api.changePin(newPin);
      setPinStatus('PIN updated successfully!');
      localStorage.setItem('gfss_pin_dismissed', 'true');
      setTimeout(() => { setShowPinModal(false); setPinDismissed(true); }, 1500);
    } catch (err: any) {
      setPinStatus(err.message || 'Failed to update PIN.');
    }
  }

  return (
    <Shell title="Home" greeting>
      <ChildPicker />
      {!child ? <Loading /> : (
        <>
          {/* Lock-screen notification permission prompt */}
          {canNotify && (
            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '14px', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fas fa-bell" style={{ color: '#059669', fontSize: '1.1rem' }}></i>
                <span style={{ fontSize: '0.78rem', color: '#065f46' }}>Get urgent school circulars & fee notices on your lock screen</span>
              </div>
              <button onClick={requestNotification} style={{ background: '#059669', color: '#fff', border: 0, padding: '5px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Turn On
              </button>
            </div>
          )}

          {/* Security Banner for default PIN */}
          {!pinDismissed && (
            <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '14px', padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fas fa-shield-alt" style={{ color: '#d97706', fontSize: '1.2rem' }}></i>
                <div>
                  <strong style={{ fontSize: '0.85rem', display: 'block', color: '#92400e' }}>Protect Your Account</strong>
                  <span style={{ fontSize: '0.75rem', color: '#b45309' }}>Currently using default PIN (1234). Set a private PIN anytime.</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => setShowPinModal(true)} style={{ background: '#d97706', color: '#fff', border: 0, padding: '5px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Change PIN</button>
                <button onClick={() => { localStorage.setItem('gfss_pin_dismissed', 'true'); setPinDismissed(true); }} style={{ background: 'none', border: 0, color: '#92400e', cursor: 'pointer', fontSize: '0.9rem', padding: '4px' }}>&times;</button>
              </div>
            </div>
          )}

          <section className="pa-panel"><StudentBadge s={child} /></section>
          
          <div className="pa-grid">
            <Link to="/app/results" className="pa-stat">
              <div className="pa-stat-top"><span>Term average</span><i className="fas fa-chart-column" /></div>
              <strong>{d.hasMarks && d.average !== null ? `${d.average}%` : (d.marks ? 'Pending' : '…')}</strong>
              <small>{d.hasMarks && d.average !== null ? `Grade ${grade(d.average)}, ${SCHOOL.term}` : `${SCHOOL.term} marks pending`}</small>
            </Link>
            <Link to="/app/attendance" className="pa-stat">
              <div className="pa-stat-top"><span>Attendance</span><i className="fas fa-calendar-check" /></div>
              <strong>{d.hasAttendance && d.present !== null ? `${d.present}%` : (d.days ? '100%' : '…')}</strong>
              <small>{d.hasAttendance ? 'Term record' : 'Full attendance recorded'}</small>
            </Link>
          </div>

          <Link to="/app/fees" className={`pa-balance pa-balance--link ${d.balance > 0 ? 'is-due' : 'is-clear'}`}>
            <span>
              {d.balance > 0 ? 'Fees balance due' : (d.balance < 0 ? 'Fees credit / Overpaid' : 'Fees fully cleared')}
            </span>
            <strong>{d.fees ? (d.balance === 0 ? 'UGX 0' : ugx(d.balance)) : '…'}</strong>
            <small>See statement and how to pay</small>
          </Link>

          {/* Digital Academy & Student Life Hub */}
          <section className="pa-panel" style={{ padding: '16px' }}>
            <div className="pa-panel-head" style={{ marginBottom: '12px' }}>
              <h3>Digital Academy & Student Life</h3>
            </div>
            <div style={{ display: 'grid', gap: '10px' }}>
              <Link
                to="/app/holiday-work"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  background: '#f8fafc',
                  borderRadius: '14px',
                  border: '1px solid #e2e8f0',
                  textDecoration: 'none',
                  color: 'inherit'
                }}
              >
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                  <i className="fas fa-book-reader" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <strong style={{ fontSize: '0.88rem', color: 'var(--g-900)' }}>Holiday Work Packages</strong>
                    <span style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: '6px', background: '#d1fae5', color: '#065f46', fontWeight: 600 }}>Active</span>
                  </div>
                  <span style={{ fontSize: '0.74rem', color: '#64748b', display: 'block' }}>Official packages & student assignments submission</span>
                </div>
                <i className="fas fa-chevron-right" style={{ color: '#cbd5e1', fontSize: '0.85rem' }} />
              </Link>

              <Link
                to="/app/e-learning"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  background: '#f8fafc',
                  borderRadius: '14px',
                  border: '1px solid #e2e8f0',
                  textDecoration: 'none',
                  color: 'inherit'
                }}
              >
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                  <i className="fas fa-graduation-cap" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <strong style={{ fontSize: '0.88rem', color: 'var(--g-900)' }}>E-Learning & UNEB Revision</strong>
                    <span style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: '6px', background: '#dbeafe', color: '#1e40af', fontWeight: 600 }}>S.1 - S.6</span>
                  </div>
                  <span style={{ fontSize: '0.74rem', color: '#64748b', display: 'block' }}>Lesson notes, past exams & recorded video classes</span>
                </div>
                <i className="fas fa-chevron-right" style={{ color: '#cbd5e1', fontSize: '0.85rem' }} />
              </Link>

              <Link
                to="/app/e-voting"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  background: '#f8fafc',
                  borderRadius: '14px',
                  border: '1px solid #e2e8f0',
                  textDecoration: 'none',
                  color: 'inherit'
                }}
              >
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                  <i className="fas fa-vote-yea" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <strong style={{ fontSize: '0.88rem', color: 'var(--g-900)' }}>Prefect & Guild E-Voting</strong>
                    <span style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: '6px', background: '#fde68a', color: '#92400e', fontWeight: 600 }}>Live Ballot</span>
                  </div>
                  <span style={{ fontSize: '0.74rem', color: '#64748b', display: 'block' }}>Vote Head Boy, Head Girl & prefects with live tallies</span>
                </div>
                <i className="fas fa-chevron-right" style={{ color: '#cbd5e1', fontSize: '0.85rem' }} />
              </Link>
            </div>
          </section>

          <section className="pa-panel">
            <div className="pa-panel-head"><h3>School Circulars & Communications</h3></div>
            <ul className="pa-notices">
              {notices.length > 0 ? notices.map((n, i) => (
                <li key={n.id || i}>
                  <strong>{n.title}</strong>
                  <span>{n.content}</span>
                </li>
              )) : (
                <>
                  <li><strong>Visiting day</strong><span>Sunday 11 October, 9am to 4pm. Bring the visitor’s card.</span></li>
                  <li><strong>End of term exams</strong><span>Begin Monday 16 November for all classes.</span></li>
                </>
              )}
            </ul>
          </section>

          {/* Change PIN Modal */}
          {showPinModal && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
              <div style={{ background: '#fff', borderRadius: '20px', maxWidth: '380px', width: '100%', padding: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
                <h3 style={{ margin: '0 0 8px', fontSize: '1.2rem', color: '#0f2e17' }}>Change Account PIN</h3>
                <p style={{ margin: '0 0 16px', fontSize: '0.85rem', color: '#66756a' }}>Choose a new 4-digit PIN that only you or your parent know.</p>
                <form onSubmit={handleUpdatePin}>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter new 4-digit PIN"
                    autoFocus
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid #dfe5dc', fontSize: '1.1rem', letterSpacing: '4px', textAlign: 'center', marginBottom: '12px', boxSizing: 'border-box' }}
                  />
                  {pinStatus && <p style={{ fontSize: '0.8rem', color: pinStatus.includes('success') ? '#166534' : '#b91c1c', margin: '0 0 12px', textAlign: 'center' }}>{pinStatus}</p>}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="button" onClick={() => setShowPinModal(false)} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #dfe5dc', background: '#f8fafc', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                    <button type="submit" style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 0, background: '#0f2e17', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Save PIN</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Urgent School Notice Popup */}
          {urgentNotice && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
              <div style={{ background: '#fff', borderRadius: '24px', maxWidth: '420px', width: '100%', padding: '24px', borderTop: '6px solid #b3261e', boxShadow: '0 25px 60px rgba(0,0,0,0.35)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <i className="fas fa-bullhorn" style={{ color: '#b3261e', fontSize: '1.4rem' }}></i>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#1d2a20' }}>Urgent School Notice</h3>
                </div>
                <h4 style={{ margin: '0 0 8px', fontSize: '1.05rem', color: '#0f2e17' }}>{urgentNotice.title}</h4>
                <p style={{ margin: '0 0 20px', fontSize: '0.88rem', color: '#475569', lineHeight: 1.55 }}>{urgentNotice.content}</p>
                <button onClick={() => dismissUrgent(urgentNotice.id)} style={{ width: '100%', padding: '12px', borderRadius: '12px', background: '#0f2e17', color: '#fff', border: 0, fontWeight: 600, cursor: 'pointer' }}>
                  Acknowledge & Continue
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </Shell>
  );
}
