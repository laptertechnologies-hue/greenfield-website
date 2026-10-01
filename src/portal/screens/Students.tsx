import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shell, Loading } from '../Shell';
import { api, type Student } from '../data';

export function Students() {
  const [all, setAll] = useState<Student[] | null>(null);
  const [q, setQ] = useState('');
  const [cls, setCls] = useState('');
  const [stream, setStream] = useState('');
  const [status, setStatus] = useState('all');
  useEffect(() => { api.students().then(setAll); }, []);

  const classes = useMemo(() => [...new Set(all?.map((s) => s.className))].sort(), [all]);
  const streams = useMemo(() => [...new Set(all?.filter((s) => !cls || s.className === cls).map((s) => s.stream))].sort(), [all, cls]);
  const list = useMemo(() => (all ?? []).filter((s) => {
    const t = q.trim().toLowerCase();
    return (!t || [s.name, s.admissionNo, s.payCode].some((v) => v.toLowerCase().includes(t)))
      && (!cls || s.className === cls) && (!stream || s.stream === stream)
      && (status === 'all' || s.status === status);
  }), [all, q, cls, stream, status]);

  return (
    <Shell title="Students">
      <div className="pa-filters">
        <div className="pa-search pa-search--flat">
          <i className="fas fa-magnifying-glass" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, admission no. or pay code" aria-label="Search students" />
        </div>
        <select value={cls} onChange={(e) => { setCls(e.target.value); setStream(''); }} aria-label="Class">
          <option value="">All classes</option>{classes.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={stream} onChange={(e) => setStream(e.target.value)} aria-label="Stream">
          <option value="">All streams</option>{streams.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status">
          <option value="all">Active and suspended</option><option value="active">Active only</option><option value="suspended">Suspended only</option>
        </select>
      </div>
      {!all ? <Loading /> : (
        <div className="pa-list">
          <div className="pa-list-head"><span>Student</span><span>Adm. no.</span><span>Class</span></div>
          {list.map((s) => (
            <Link key={s.id} to={`/app/students/${s.id}`} className="pa-list-row">
              <span><strong>{s.name}</strong>{s.status === 'suspended' && <small className="pa-warn">Suspended</small>}</span>
              <span className="pa-mono">{s.admissionNo}<small>Pay {s.payCode}</small></span>
              <span>{s.className} {s.stream}</span>
            </Link>
          ))}
          {!list.length && <p className="pa-empty">No students match these filters. Clear the search or pick “All classes”.</p>}
        </div>
      )}
    </Shell>
  );
}
