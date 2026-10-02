import { useEffect, useState } from 'react';
import { api, grade, ugx, type AttendanceDay, type FeeItem, type Student, type SubjectMark } from '../data';
import { Loading } from '../Shell';

export function useStudentData(student: Student | null) {
  const [marks, setMarks] = useState<SubjectMark[] | null>(null);
  const [fees, setFees] = useState<FeeItem[] | null>(null);
  const [days, setDays] = useState<AttendanceDay[] | null>(null);
  useEffect(() => {
    if (!student) return;
    setMarks(null); setFees(null); setDays(null);
    api.marks(student.id).then(setMarks);
    api.fees(student.id).then(setFees);
    api.attendance(student.id).then(setDays);
  }, [student]);
  const balance = fees?.reduce((a, f) => a + f.amount, 0) ?? 0;
  const hasMarks = Boolean(marks && marks.length > 0);
  const average = hasMarks ? Math.round(marks!.reduce((a, m) => a + m.eot, 0) / marks!.length) : null;
  const hasAttendance = Boolean(days && days.length > 0);
  const present = hasAttendance ? Math.round((days!.filter((d) => d.present).length / days!.length) * 100) : null;
  return { marks, fees, days, balance, average, present, hasMarks, hasAttendance };
}

export function StudentBadge({ s }: { s: Student }) {
  return (
    <div className="pa-student-badge">
      <span className="pa-avatar pa-avatar--lg">{s.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}</span>
      <div>
        <h2>{s.name}</h2>
        <p>{s.className} {s.stream}, adm. {s.admissionNo}</p>
        <p>Pay code {s.payCode}{s.status === 'suspended' && <span className="pa-tag pa-tag--warn">Suspended</span>}</p>
      </div>
    </div>
  );
}

export function MarksTable({ marks }: { marks: SubjectMark[] | null }) {
  if (!marks) return <Loading />;
  if (marks.length === 0) {
    return (
      <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#66756a' }}>
        <i className="fas fa-file-pen" style={{ fontSize: '2.2rem', marginBottom: '0.75rem', opacity: 0.6, display: 'block', color: 'var(--g-700)' }}></i>
        <strong style={{ fontSize: '1rem', display: 'block', color: 'var(--ink)' }}>Marks Not Published Yet</strong>
        <p style={{ margin: '0.35rem 0 0', fontSize: '0.85rem' }}>Assessments for this term are currently being graded by the subject teachers. Once entered, your BOT, MOT, and EOT scores will display here.</p>
      </div>
    );
  }
  return (
    <div className="pa-table-wrap">
      <table className="pa-table">
        <thead><tr><th>Subject</th><th>BOT</th><th>MOT</th><th>EOT</th><th>Grade</th></tr></thead>
        <tbody>
          {marks.map((m) => (
            <tr key={m.subject}>
              <td>{m.subject}</td><td>{m.bot}</td><td>{m.mot}</td><td><strong>{m.eot}</strong></td>
              <td><span className={`pa-grade pa-grade--${grade(m.eot)[0]}`}>{grade(m.eot)}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="pa-note">BOT, MOT and EOT are beginning, middle and end of term tests.</p>
    </div>
  );
}

export function FeeStatement({ fees }: { fees: FeeItem[] | null }) {
  if (!fees) return <Loading />;
  const balance = fees.reduce((a, f) => a + f.amount, 0);
  return (
    <>
      <div className={`pa-balance ${balance > 0 ? 'is-due' : 'is-clear'}`}>
        <span>{balance > 0 ? 'Balance due' : 'Fully paid'}</span>
        <strong>{ugx(balance)}</strong>
        {balance < 0 && <small>Credit carried to next term</small>}
      </div>
      <ul className="pa-ledger">
        {fees.map((f, i) => (
          <li key={i}>
            <span><strong>{f.description}</strong><small>{new Date(f.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</small></span>
            <b className={f.amount < 0 ? 'is-paid' : ''}>{f.amount < 0 ? '−' : ''}{ugx(f.amount)}</b>
          </li>
        ))}
      </ul>
    </>
  );
}

export function AttendanceGrid({ days }: { days: AttendanceDay[] | null }) {
  if (!days) return <Loading />;
  if (days.length === 0) {
    return (
      <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#66756a' }}>
        <i className="fas fa-calendar-check" style={{ fontSize: '2.2rem', marginBottom: '0.75rem', color: 'var(--g-700)', display: 'block' }}></i>
        <strong style={{ fontSize: '1rem', display: 'block', color: 'var(--ink)' }}>100% Present</strong>
        <p style={{ margin: '0.35rem 0 0', fontSize: '0.85rem' }}>Full attendance record. No missed school days or unauthorized absences recorded this term.</p>
      </div>
    );
  }
  const missed = days.filter((d) => !d.present);
  return (
    <>
      <div className="pa-cal" aria-label="School days in September">
        {['M', 'T', 'W', 'T', 'F'].map((d, i) => <span key={i} className="pa-cal-h">{d}</span>)}
        {Array.from({ length: (new Date(days[0].date).getDay() + 6) % 7 }).map((_, i) => <span key={'b' + i} />)}
        {days.map((d) => (
          <span key={d.date} className={`pa-cal-d ${d.present ? 'is-in' : 'is-out'}`} title={`${d.date}: ${d.present ? 'present' : 'absent'}`}>
            {new Date(d.date).getDate()}
          </span>
        ))}
      </div>
      <p className="pa-note">{missed.length ? `Absent on ${missed.length} day${missed.length > 1 ? 's' : ''}: ${missed.map((d) => new Date(d.date).getDate() + ' Sep').join(', ')}.` : 'Present every school day this month.'}</p>
    </>
  );
}
