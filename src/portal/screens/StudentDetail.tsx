import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Shell, Loading } from '../Shell';
import { api, type Student } from '../data';
import { AttendanceGrid, FeeStatement, MarksTable, StudentBadge, useStudentData } from './parts';

export function StudentDetail() {
  const { id } = useParams();
  const [s, setS] = useState<Student | null | undefined>(undefined);
  const [tab, setTab] = useState<'results' | 'fees' | 'attendance'>('results');
  useEffect(() => { if (id) api.student(id).then((r) => setS(r ?? null)); }, [id]);
  const d = useStudentData(s ?? null);
  if (s === undefined) return <Shell title="Student" back><Loading /></Shell>;
  if (s === null) return <Shell title="Student" back><p className="pa-empty">This student record wasn’t found. It may have been removed.</p></Shell>;
  return (
    <Shell title="Student" back>
      <section className="pa-panel"><StudentBadge s={s} /></section>
      <div className="pa-seg pa-seg--light" role="tablist">
        {(['results', 'fees', 'attendance'] as const).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? 'is-on' : ''} onClick={() => setTab(t)}>{t[0].toUpperCase() + t.slice(1)}</button>
        ))}
      </div>
      <section className="pa-panel">
        {tab === 'results' && <MarksTable marks={d.marks} />}
        {tab === 'fees' && <FeeStatement fees={d.fees} />}
        {tab === 'attendance' && <AttendanceGrid days={d.days} />}
      </section>

      {/* Staff Actions */}
      <section className="pa-panel" style={{ marginTop: '12px' }}>
        <div className="pa-panel-head"><h3>Account Administration</h3></div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
          <div>
            <strong style={{ fontSize: '0.88rem', display: 'block' }}>Portal Access PIN</strong>
            <span style={{ fontSize: '0.78rem', color: '#66756a' }}>Reset PIN if student or parent forgets it</span>
          </div>
          <button
            onClick={async () => {
              if (window.confirm(`Reset portal PIN for ${s.name} back to default (1234)?`)) {
                try {
                  const res = await api.resetPin(s.id, '1234');
                  alert(res.message || 'PIN reset to 1234.');
                } catch (e: any) {
                  alert(e.message || 'Failed to reset PIN.');
                }
              }
            }}
            style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid #dfe5dc', background: '#fff', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, color: '#0f2e17' }}
          >
            <i className="fas fa-key" style={{ marginRight: '6px' }}></i>Reset PIN (1234)
          </button>
        </div>
      </section>
    </Shell>
  );
}
