import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shell, Loading } from '../Shell';
import { api, SCHOOL, ugx, type Student } from '../data';

type Overview = Awaited<ReturnType<typeof api.overview>>;

export function StaffHome() {
  const [o, setO] = useState<Overview | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [q, setQ] = useState('');
  const nav = useNavigate();
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [bTitle, setBTitle] = useState('');
  const [bContent, setBContent] = useState('');
  const [bPriority, setBPriority] = useState<'normal' | 'urgent'>('normal');
  const [bStatus, setBStatus] = useState('');

  useEffect(() => { api.overview().then(setO); api.students().then(setStudents); }, []);

  async function handleSendBroadcast(e: React.FormEvent) {
    e.preventDefault();
    if (!bTitle || !bContent) return;
    try {
      setBStatus('Publishing circular...');
      const token = localStorage.getItem('gfss-portal-token');
      const res = await fetch('https://api.laptertech.store/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: bTitle, content: bContent, priority: bPriority }),
      });
      if (!res.ok) throw new Error('Failed to publish');
      setBStatus('Circular published successfully!');
      setTimeout(() => {
        setShowBroadcast(false);
        setBTitle('');
        setBContent('');
        setBStatus('');
      }, 1500);
    } catch {
      setBStatus('Error publishing. Please try again.');
    }
  }

  const hits = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [];
    return students.filter((s) => [s.name, s.admissionNo, s.payCode].some((v) => v.toLowerCase().includes(t))).slice(0, 5);
  }, [q, students]);

  const search = (
    <div className="pa-search-wrap">
      <div className="pa-search">
        <i className="fas fa-magnifying-glass" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search students or menu" aria-label="Search students" />
        {q && <button onClick={() => setQ('')} aria-label="Clear search"><i className="fas fa-xmark" /></button>}
      </div>
      {q && (
        <div className="pa-dropdown">
          {hits.map((s) => (
            <button key={s.id} onClick={() => nav(`/app/students/${s.id}`)}>
              <i className="fas fa-user" /><span><strong>{s.name}</strong><small>{s.admissionNo}, {s.className} {s.stream}</small></span>
            </button>
          ))}
          {!hits.length && <p className="pa-dropdown-empty">No student matches “{q}”.</p>}
          <button onClick={() => nav('/app/students')}><i className="fas fa-user-graduate" /><span><strong>All students</strong></span></button>
        </div>
      )}
    </div>
  );

  return (
    <Shell title="Overview" greeting headerExtra={search}>
      {!o ? <Loading /> : (
        <>
          <section className="pa-hero">
            <small>Head teacher's dashboard</small>
            <h2>Welcome back</h2>
            <p>{SCHOOL.term}, {o.students} active students</p>
          </section>
          <div className="pa-grid">
            <Stat label="Students" value={o.students} note={`${o.boys} boys, ${o.girls} girls`} icon="fa-user-graduate" to="/app/students" />
            <Stat label="Classes / streams" value={`${o.classes} / ${o.streams}`} icon="fa-layer-group" />
            <Stat label="Teachers" value={o.teachers} icon="fa-chalkboard-user" />
            <Stat label="Parents" value={o.parents} icon="fa-users" />
            <Stat label="Reports uploaded" value={o.reportsUploaded} note="None released yet" icon="fa-file-lines" to="/app/marks" tone="gold" />
            <Stat label="SMS today" value={o.smsToday} icon="fa-comment-sms" />
          </div>
          <section className="pa-panel">
            <div className="pa-panel-head"><h3>Fees this term</h3><Link to="/app/fees">Open</Link></div>
            <div className="pa-meter"><span style={{ width: `${(o.feesCollected / o.feesExpected) * 100}%` }} /></div>
            <p className="pa-meter-text"><strong>{ugx(o.feesCollected)}</strong> of {ugx(o.feesExpected)} collected</p>
          </section>

          <section className="pa-panel">
            <div className="pa-panel-head"><h3>School Administration</h3></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <i className="fas fa-sliders" style={{ color: 'var(--g-700)', fontSize: '1.2rem' }}></i>
                <div>
                  <strong style={{ fontSize: '0.85rem', display: 'block' }}>Admin Console</strong>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Admissions & circulars</span>
                </div>
              </Link>
              <Link to="/app/marks" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <i className="fas fa-file-excel" style={{ color: '#166534', fontSize: '1.2rem' }}></i>
                <div>
                  <strong style={{ fontSize: '0.85rem', display: 'block' }}>Excel Marks Sheet</strong>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Batch paste & save</span>
                </div>
              </Link>
              <Link to="/app/fees" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <i className="fas fa-receipt" style={{ color: '#d97706', fontSize: '1.2rem' }}></i>
                <div>
                  <strong style={{ fontSize: '0.85rem', display: 'block' }}>Fee Collection</strong>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Record payments</span>
                </div>
              </Link>
              <Link to="/app/students" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <i className="fas fa-key" style={{ color: '#2563eb', fontSize: '1.2rem' }}></i>
                <div>
                  <strong style={{ fontSize: '0.85rem', display: 'block' }}>PIN Resets</strong>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Student directory</span>
                </div>
              </Link>
            </div>

            <div style={{ marginTop: '12px' }}>
              <button
                onClick={() => setShowBroadcast(true)}
                style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'var(--g-900)', color: '#fff', border: 0, fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <i className="fas fa-bullhorn" style={{ color: 'var(--gold)' }}></i>
                Send Circular / Announcement to Parents
              </button>
            </div>
          </section>

          <section className="pa-panel">
            <div className="pa-panel-head"><h3>Digital Learning & Elections</h3></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
              <Link to="/app/holiday-work" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <i className="fas fa-book-reader" style={{ color: '#059669', fontSize: '1.2rem' }}></i>
                <div>
                  <strong style={{ fontSize: '0.85rem', display: 'block' }}>Holiday Work Packages</strong>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Post packages & grade student work</span>
                </div>
              </Link>
              <Link to="/app/e-learning" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <i className="fas fa-graduation-cap" style={{ color: '#2563eb', fontSize: '1.2rem' }}></i>
                <div>
                  <strong style={{ fontSize: '0.85rem', display: 'block' }}>E-Learning & UNEB Notes</strong>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Upload syllabus material & papers</span>
                </div>
              </Link>
              <Link to="/app/e-voting" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <i className="fas fa-vote-yea" style={{ color: '#d97706', fontSize: '1.2rem' }}></i>
                <div>
                  <strong style={{ fontSize: '0.85rem', display: 'block' }}>Prefect E-Voting</strong>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Live elections tally & results</span>
                </div>
              </Link>
            </div>
          </section>

          {/* Broadcast Circular Modal */}
          {showBroadcast && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
              <div style={{ background: '#fff', borderRadius: '20px', maxWidth: '440px', width: '100%', padding: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f2e17' }}>Broadcast to Parents</h3>
                  <button onClick={() => setShowBroadcast(false)} style={{ background: 'none', border: 0, fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' }}>&times;</button>
                </div>
                <p style={{ margin: '0 0 16px', fontSize: '0.82rem', color: '#64748b' }}>This announcement will appear instantly on the portal and mobile phones of all 682 parents.</p>
                <form onSubmit={handleSendBroadcast}>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>Title</label>
                    <input
                      value={bTitle}
                      onChange={(e) => setBTitle(e.target.value)}
                      placeholder="e.g. End of Term Visitation Day"
                      required
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>Priority</label>
                    <select
                      value={bPriority}
                      onChange={(e) => setBPriority(e.target.value as any)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', boxSizing: 'border-box' }}
                    >
                      <option value="normal">Normal Announcement (Circular feed)</option>
                      <option value="urgent">Urgent Alert (Pops up immediately on phone)</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>Message Details</label>
                    <textarea
                      value={bContent}
                      onChange={(e) => setBContent(e.target.value)}
                      placeholder="Write message details for parents and students..."
                      rows={4}
                      required
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', boxSizing: 'border-box' }}
                    />
                  </div>
                  {bStatus && <p style={{ fontSize: '0.82rem', color: bStatus.includes('success') ? '#166534' : '#b91c1c', margin: '0 0 12px' }}>{bStatus}</p>}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="button" onClick={() => setShowBroadcast(false)} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                    <button type="submit" style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 0, background: 'var(--g-900)', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Publish Circular</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </Shell>
  );
}

function Stat({ label, value, note, icon, to, tone }: { label: string; value: string | number; note?: string; icon: string; to?: string; tone?: 'gold' }) {
  const body = (
    <>
      <div className="pa-stat-top"><span>{label}</span><i className={`fas ${icon} ${tone === 'gold' ? 'is-gold' : ''}`} /></div>
      <strong>{value}</strong>
      {note && <small>{note}</small>}
    </>
  );
  return to ? <Link to={to} className="pa-stat">{body}</Link> : <div className="pa-stat">{body}</div>;
}
