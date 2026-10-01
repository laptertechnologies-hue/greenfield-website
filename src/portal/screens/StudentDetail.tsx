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
    </Shell>
  );
}
