import { useState } from 'react';
import { Shell } from '../Shell';
import { useAuth } from '../auth';
import { useChild } from '../PortalApp';

export interface HolidayTask {
  id: string;
  title: string;
  className: string;
  subject: string;
  teacher: string;
  dueDate: string;
  description: string;
  attachmentName?: string;
  submissionsCount?: number;
}

export interface StudentSubmission {
  taskId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  notes: string;
  fileLink?: string;
  status: 'submitted' | 'graded';
  grade?: string;
  feedback?: string;
}

const DEFAULT_TASKS: HolidayTask[] = [
  {
    id: 'hw-1',
    title: 'New Lower Secondary Curriculum Project',
    className: 'S.1',
    subject: 'Biology',
    teacher: 'Mr. Okello David',
    dueDate: '2026-10-18',
    description: 'Investigate plant adaptations in your local home environment. Document 5 indigenous plant species, their leaf structures, and write a 2-page report on how they conserve water.',
    attachmentName: 'S1_Biology_Holiday_Guide_2026.pdf',
    submissionsCount: 142,
  },
  {
    id: 'hw-2',
    title: 'Algebraic Expressions & Geometry Practice Set',
    className: 'S.2',
    subject: 'Mathematics',
    teacher: 'Mr. Byaruhanga Patrick',
    dueDate: '2026-10-20',
    description: 'Complete questions 1 to 25 from the revision booklet covering quadratic equations, Pythagoras theorem, and coordinate geometry.',
    attachmentName: 'S2_Math_Holiday_Problem_Set.pdf',
    submissionsCount: 98,
  },
  {
    id: 'hw-3',
    title: 'Literature Novel Critique & Contextual Analysis',
    className: 'S.3',
    subject: 'Literature in English',
    teacher: 'Mrs. Asiimwe Grace',
    dueDate: '2026-10-22',
    description: 'Read Act III & IV of "The Alien Woman" and write a character sketch of the protagonist. Discuss the theme of cultural conflict in 400 words.',
    attachmentName: 'S3_Literature_Setbook_Questions.pdf',
    submissionsCount: 76,
  },
  {
    id: 'hw-4',
    title: 'UCE UNEB Revision Package: Mechanics & Waves',
    className: 'S.4',
    subject: 'Physics',
    teacher: 'Mr. Tumusiime Ronald',
    dueDate: '2026-10-25',
    description: 'Complete UNEB past exam questions Paper 1 & Paper 2 (2020-2024) section on Linear Motion, Newton’s Laws, and Wave Motion. Show all working steps.',
    attachmentName: 'S4_Physics_UNEB_Drill_2026.pdf',
    submissionsCount: 110,
  },
];

export function HolidayWork() {
  const { user } = useAuth();
  const { child } = useChild();
  const isStaff = user?.role === 'staff';

  const [tasks, setTasks] = useState<HolidayTask[]>(() => {
    try {
      const saved = localStorage.getItem('gfss_holiday_tasks');
      return saved ? JSON.parse(saved) : DEFAULT_TASKS;
    } catch {
      return DEFAULT_TASKS;
    }
  });

  const [submissions, setSubmissions] = useState<Record<string, StudentSubmission>>(() => {
    try {
      const saved = localStorage.getItem('gfss_holiday_submissions');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [selectedClass, setSelectedClass] = useState<string>(() => {
    if (!isStaff && child?.className) return child.className;
    return 'All';
  });

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState<HolidayTask | null>(null);
  const [activeTaskView, setActiveTaskView] = useState<HolidayTask | null>(null);

  // New task form
  const [newTitle, setNewTitle] = useState('');
  const [newClass, setNewClass] = useState('S.1');
  const [newSubject, setNewSubject] = useState('Mathematics');
  const [newDueDate, setNewDueDate] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newAttachment, setNewAttachment] = useState('');

  // Submit form
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [submissionLink, setSubmissionLink] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (selectedClass === 'All') return true;
    return t.className === selectedClass;
  });

  function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle || !newDescription) return;

    const created: HolidayTask = {
      id: `hw-${Date.now()}`,
      title: newTitle,
      className: newClass,
      subject: newSubject,
      teacher: user?.name || 'School Teacher',
      dueDate: newDueDate || '2026-10-30',
      description: newDescription,
      attachmentName: newAttachment || `${newClass}_${newSubject}_Package.pdf`,
      submissionsCount: 0,
    };

    const updated = [created, ...tasks];
    setTasks(updated);
    localStorage.setItem('gfss_holiday_tasks', JSON.stringify(updated));

    setShowCreateModal(false);
    setNewTitle('');
    setNewDescription('');
    setNewAttachment('');
  }

  function handleSubmitWork(e: React.FormEvent) {
    e.preventDefault();
    if (!showSubmitModal || !child) return;

    const subKey = `${showSubmitModal.id}_${child.id}`;
    const newSub: StudentSubmission = {
      taskId: showSubmitModal.id,
      studentId: child.id,
      studentName: child.name,
      submittedAt: new Date().toISOString(),
      notes: submissionNotes,
      fileLink: submissionLink || undefined,
      status: 'submitted',
    };

    const updated = { ...submissions, [subKey]: newSub };
    setSubmissions(updated);
    localStorage.setItem('gfss_holiday_submissions', JSON.stringify(updated));

    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setShowSubmitModal(null);
      setSubmissionNotes('');
      setSubmissionLink('');
    }, 1500);
  }

  return (
    <Shell title="Holiday Work" back>
      {/* Intro Hero */}
      <section className="pa-hero">
        <small>Ministry Approved Holiday Learning Packages</small>
        <h2>Holiday Study & Assignments</h2>
        <p>
          {isStaff
            ? 'Assign revision packages and review student submissions across all classes.'
            : `Continuous learning packages for ${child?.name || 'students'}. Complete questions and submit for grading.`}
        </p>
      </section>

      {/* Class filter & Teacher action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <div className="pa-chips" style={{ margin: 0 }}>
          {['All', 'S.1', 'S.2', 'S.3', 'S.4', 'S.5', 'S.6'].map((cls) => (
            <button
              key={cls}
              className={selectedClass === cls ? 'is-on' : ''}
              onClick={() => setSelectedClass(cls)}
            >
              {cls}
            </button>
          ))}
        </div>

        {isStaff && (
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              background: 'var(--g-700)',
              color: '#fff',
              border: 0,
              padding: '8px 14px',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <i className="fas fa-plus" /> Post Holiday Work
          </button>
        )}
      </div>

      {/* Task List */}
      <div style={{ display: 'grid', gap: '12px', marginTop: '6px' }}>
        {filteredTasks.length === 0 ? (
          <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#64748b' }}>
            <i className="fas fa-book-open" style={{ fontSize: '2.5rem', opacity: 0.4, marginBottom: '8px', display: 'block' }} />
            <strong>No Holiday Work for {selectedClass}</strong>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem' }}>Teachers have not uploaded packages for this class yet.</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const subKey = child ? `${task.id}_${child.id}` : '';
            const existingSub = submissions[subKey];

            return (
              <div key={task.id} className="pa-panel" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '4px' }}>
                      <span className="pa-tag" style={{ background: 'var(--g-100)', color: 'var(--g-800)', fontWeight: 600, fontSize: '0.72rem', padding: '3px 8px', borderRadius: '6px' }}>
                        {task.className}
                      </span>
                      <span className="pa-tag" style={{ background: '#fef3c7', color: '#92400e', fontWeight: 600, fontSize: '0.72rem', padding: '3px 8px', borderRadius: '6px' }}>
                        {task.subject}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Due: {task.dueDate}</span>
                    </div>
                    <h3 style={{ fontSize: '1rem', margin: '4px 0 6px', color: '#0f2e17' }}>{task.title}</h3>
                    <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.5, margin: '0 0 10px' }}>{task.description}</p>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      <i className="fas fa-chalkboard-user" style={{ marginRight: '5px' }} />
                      Instructor: {task.teacher}
                    </div>
                  </div>
                </div>

                {/* Attachments and actions */}
                <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  {task.attachmentName ? (
                    <a
                      href={`/downloads/${task.attachmentName}`}
                      download
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`Downloading: ${task.attachmentName}\n\nHoliday assignment file loaded from school resource server.`);
                      }}
                      style={{ fontSize: '0.8rem', color: 'var(--g-700)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                    >
                      <i className="fas fa-file-pdf" style={{ color: '#dc2626' }} />
                      {task.attachmentName}
                    </a>
                  ) : <span />}

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {isStaff ? (
                      <button
                        onClick={() => setActiveTaskView(task)}
                        style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', color: '#0f2e17' }}
                      >
                        <i className="fas fa-list-check" style={{ marginRight: '5px' }} />
                        Submissions ({task.submissionsCount || 0})
                      </button>
                    ) : existingSub ? (
                      <span style={{ background: '#ecfdf5', color: '#065f46', padding: '6px 12px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <i className="fas fa-check-circle" /> Submitted
                      </span>
                    ) : (
                      <button
                        onClick={() => setShowSubmitModal(task)}
                        style={{ padding: '7px 14px', borderRadius: '8px', border: 0, background: 'var(--g-700)', color: '#fff', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
                      >
                        <i className="fas fa-paper-plane" style={{ marginRight: '5px' }} /> Submit Answers
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Submit Homework Modal */}
      {showSubmitModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: '#fff', borderRadius: '20px', maxWidth: '440px', width: '100%', padding: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f2e17' }}>Submit Holiday Work</h3>
              <button onClick={() => setShowSubmitModal(null)} style={{ background: 'none', border: 0, fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' }}>&times;</button>
            </div>
            <p style={{ margin: '0 0 14px', fontSize: '0.82rem', color: '#64748b' }}>
              Submitting for: <strong>{child?.name}</strong> ({showSubmitModal.subject})
            </p>

            <form onSubmit={handleSubmitWork}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>Answers / Working Notes</label>
                <textarea
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  placeholder="Type your answers, summaries, or working calculations here..."
                  rows={4}
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>Photo / Document Link (Optional)</label>
                <input
                  type="url"
                  value={submissionLink}
                  onChange={(e) => setSubmissionLink(e.target.value)}
                  placeholder="e.g. Google Drive link or scanned workbook URL"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                />
              </div>

              {submitSuccess && (
                <p style={{ color: '#166534', background: '#dcfce7', padding: '8px 12px', borderRadius: '8px', fontSize: '0.82rem', margin: '0 0 12px' }}>
                  <i className="fas fa-circle-check" style={{ marginRight: '6px' }} />
                  Homework successfully submitted to teacher!
                </p>
              )}

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setShowSubmitModal(null)} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 0, background: 'var(--g-700)', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Confirm & Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teacher Create Modal */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: '#fff', borderRadius: '20px', maxWidth: '440px', width: '100%', padding: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f2e17' }}>Post Holiday Work Package</h3>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 0, fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' }}>&times;</button>
            </div>

            <form onSubmit={handleCreateTask}>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Assignment Title</label>
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. S.3 Chemistry Holiday Calculations"
                  required
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Target Class</label>
                  <select
                    value={newClass}
                    onChange={(e) => setNewClass(e.target.value)}
                    style={{ width: '100%', padding: '9px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  >
                    {['S.1', 'S.2', 'S.3', 'S.4', 'S.5', 'S.6'].map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Subject</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    style={{ width: '100%', padding: '9px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  >
                    {['Mathematics', 'English Language', 'Biology', 'Chemistry', 'Physics', 'Geography', 'History', 'ICT / Computer', 'Agriculture', 'CRE / IRE'].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Submission Due Date</label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Instructions & Questions</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Detail the questions or tasks students are required to do..."
                  rows={3}
                  required
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Attachment Document Name (Optional)</label>
                <input
                  value={newAttachment}
                  onChange={(e) => setNewAttachment(e.target.value)}
                  placeholder="e.g. S3_Chemistry_Holiday_Exam.pdf"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 0, background: 'var(--g-700)', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Publish Package</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submissions viewer for teachers */}
      {activeTaskView && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: '#fff', borderRadius: '20px', maxWidth: '500px', width: '100%', padding: '24px', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f2e17' }}>Submissions: {activeTaskView.title}</h3>
              <button onClick={() => setActiveTaskView(null)} style={{ background: 'none', border: 0, fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' }}>&times;</button>
            </div>
            <p style={{ margin: '0 0 14px', fontSize: '0.82rem', color: '#64748b' }}>
              Class: {activeTaskView.className} • Subject: {activeTaskView.subject} • Due: {activeTaskView.dueDate}
            </p>

            <div style={{ display: 'grid', gap: '10px' }}>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>AHUMUZA CHARITY</strong>
                  <span style={{ fontSize: '0.75rem', color: '#166534', background: '#dcfce7', padding: '2px 8px', borderRadius: '6px' }}>Turned In</span>
                </div>
                <p style={{ margin: '6px 0', fontSize: '0.82rem', color: '#475569' }}>
                  "Completed questions 1 to 25 as assigned. Focused on coordinate geometry and leaf specimens."
                </p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  <button onClick={() => alert('Grade awarded: 88/100 (Recorded for Continuous Assessment)')} style={{ padding: '4px 8px', borderRadius: '6px', background: 'var(--g-700)', color: '#fff', border: 0, fontSize: '0.75rem', cursor: 'pointer' }}>
                    Award Mark (88/100)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Shell>
  );
}
