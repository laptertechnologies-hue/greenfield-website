import { useEffect, useMemo, useState } from 'react';
import { Shell, Loading } from '../Shell';
import { api, grade, type Student } from '../data';

const SUBJECTS = ['English', 'Mathematics', 'Biology', 'Chemistry', 'Physics', 'Geography'];

export function MarksSheet() {
  const [all, setAll] = useState<Student[] | null>(null);
  const [cls, setCls] = useState('S.2');
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [marks, setMarks] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState('');
  useEffect(() => { api.students().then(setAll); }, []);
  const classes = useMemo(() => [...new Set(all?.map((s) => s.className))].sort(), [all]);
  const list = (all ?? []).filter((s) => s.className === cls && s.status === 'active');
  const key = (id: string) => `${cls}|${subject}|${id}`;

  function save() {
    // Demo: marks stay on this device. Connect api.saveMarks() to your server to store them.
    setSaved(`Saved ${list.filter((s) => marks[key(s.id)]).length} marks for ${subject}, ${cls}.`);
    setTimeout(() => setSaved(''), 3000);
  }

  return (
    <Shell title="Marks sheet">
      <div className="pa-filters pa-filters--row">
        <select value={cls} onChange={(e) => setCls(e.target.value)} aria-label="Class">{classes.map((c) => <option key={c}>{c}</option>)}</select>
        <select value={subject} onChange={(e) => setSubject(e.target.value)} aria-label="Subject">{SUBJECTS.map((c) => <option key={c}>{c}</option>)}</select>
      </div>
      {!all ? <Loading /> : (
        <section className="pa-panel">
          <div className="pa-panel-head"><h3>End of term, out of 100</h3></div>
          {list.map((s) => {
            const v = marks[key(s.id)] ?? '';
            const n = Number(v);
            return (
              <label key={s.id} className="pa-mark-row">
                <span><strong>{s.name}</strong><small>{s.admissionNo}, {s.stream}</small></span>
                <input inputMode="numeric" value={v} maxLength={3} aria-label={`Mark for ${s.name}`}
                  onChange={(e) => setMarks({ ...marks, [key(s.id)]: e.target.value.replace(/\D/g, '') })}
                  className={v && n > 100 ? 'is-bad' : ''} />
                <em>{v && n <= 100 ? grade(n) : ''}</em>
              </label>
            );
          })}
          {!list.length && <p className="pa-empty">No active students in {cls}.</p>}
          <button className="pa-btn" onClick={save} disabled={!list.length}>Save marks</button>
          {saved && <p className="pa-ok" role="status">{saved}</p>}
        </section>
      )}
    </Shell>
  );
}
