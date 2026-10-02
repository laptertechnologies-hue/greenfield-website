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
  useEffect(() => { api.overview().then(setO); api.students().then(setStudents); }, []);

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
          </section>
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
