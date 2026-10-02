import { useEffect, useMemo, useState } from 'react';
import { Shell, Loading } from '../Shell';
import { api, grade, type Student } from '../data';

const SUBJECTS = [
  'English Language',
  'Mathematics',
  'Biology',
  'Chemistry',
  'Physics',
  'Geography',
  'History & Political Education',
  'Christian Religious Education (CRE)',
  'Islamic Religious Education (IRE)',
  'Agriculture',
  'Computer Studies / ICT',
  'Commerce & Entrepreneurship',
  'Fine Art',
  'Literature in English',
  'Physical Education',
];

export function MarksSheet() {
  const [all, setAll] = useState<Student[] | null>(null);
  const [cls, setCls] = useState('S.2');
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [marks, setMarks] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState('');
  const [showPaste, setShowPaste] = useState(false);
  const [pasteText, setPasteText] = useState('');

  useEffect(() => { api.students().then(setAll); }, []);
  const classes = useMemo(() => [...new Set(all?.map((s) => s.className))].sort(), [all]);
  const list = (all ?? []).filter((s) => s.className === cls && s.status === 'active');
  const key = (id: string) => `${cls}|${subject}|${id}`;

  function applyExcelPaste() {
    const lines = pasteText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    const updated = { ...marks };
    list.forEach((s, idx) => {
      if (idx < lines.length) {
        const num = lines[idx].replace(/\D/g, '');
        if (num) updated[key(s.id)] = num;
      }
    });
    setMarks(updated);
    setShowPaste(false);
    setPasteText('');
    setSaved(`Filled ${Math.min(lines.length, list.length)} marks from clipboard! Click Save marks below.`);
    setTimeout(() => setSaved(''), 4000);
  }

  async function save() {
    const entries = list
      .filter((s) => marks[key(s.id)] && Number(marks[key(s.id)]) <= 100)
      .map((s) => ({ studentId: s.id, subject, eot: Number(marks[key(s.id)]) }));
    if (!entries.length) { setSaved('Enter at least one mark (0 to 100) first.'); return; }
    try {
      const n = await api.saveMarks(entries);
      setSaved(`Saved ${n} marks for ${subject}, ${cls}.`);
    } catch (e) { setSaved((e as Error).message); }
    setTimeout(() => setSaved(''), 3500);
  }

  return (
    <Shell title="Marks sheet">
      <div className="pa-filters pa-filters--row">
        <select value={cls} onChange={(e) => setCls(e.target.value)} aria-label="Class">{classes.map((c) => <option key={c}>{c}</option>)}</select>
        <select value={subject} onChange={(e) => setSubject(e.target.value)} aria-label="Subject">{SUBJECTS.map((c) => <option key={c}>{c}</option>)}</select>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
        <button
          onClick={() => setShowPaste(!showPaste)}
          style={{ background: '#fff', border: '1px solid #dfe5dc', padding: '6px 12px', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 600, color: 'var(--g-700)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <i className="fas fa-file-excel" style={{ color: '#166534' }}></i>
          {showPaste ? 'Hide Excel Paste' : 'Paste Column from Excel'}
        </button>
      </div>

      {showPaste && (
        <section className="pa-panel" style={{ background: '#f8fafc', border: '1px dashed #cbd5e1' }}>
          <h4 style={{ margin: '0 0 6px', fontSize: '0.88rem' }}>Paste Excel / Google Sheets Column</h4>
          <p style={{ margin: '0 0 10px', fontSize: '0.78rem', color: '#64748b' }}>Copy your column of marks from Excel (Ctrl+C) and paste them here (Ctrl+V). They will match the {list.length} students below in order.</p>
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder="75&#10;82&#10;68&#10;..."
            rows={5}
            style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', boxSizing: 'border-box', fontFamily: 'monospace' }}
          />
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button onClick={applyExcelPaste} style={{ background: 'var(--g-700)', color: '#fff', border: 0, padding: '8px 14px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>Apply to Students</button>
            <button onClick={() => setShowPaste(false)} style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>Cancel</button>
          </div>
        </section>
      )}

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
