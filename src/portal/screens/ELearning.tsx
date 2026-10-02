import { useState } from 'react';
import { Shell } from '../Shell';
import { useAuth } from '../auth';

export interface LearningMaterial {
  id: string;
  title: string;
  className: string;
  subject: string;
  type: 'notes' | 'past_paper' | 'video';
  fileSize?: string;
  downloadUrl: string;
  description: string;
  author: string;
  views: number;
}

const DEFAULT_MATERIALS: LearningMaterial[] = [
  {
    id: 'mat-1',
    title: 'UNEB UCE Mathematics Paper 1 & 2 Marking Guide',
    className: 'S.4',
    subject: 'Mathematics',
    type: 'past_paper',
    fileSize: '2.4 MB PDF',
    downloadUrl: '/downloads/UCE_Math_2024_Guide.pdf',
    description: 'Complete UNEB examination past papers with official step-by-step marking schemes from national examiners.',
    author: 'Academic Department',
    views: 340,
  },
  {
    id: 'mat-2',
    title: 'S.1 Biology Comprehensive Cell Biology & Nutrition Notes',
    className: 'S.1',
    subject: 'Biology',
    type: 'notes',
    fileSize: '1.8 MB PDF',
    downloadUrl: '/downloads/S1_Biology_Cell_Structure.pdf',
    description: 'New lower secondary curriculum notes with high-resolution microscopy diagrams, experiments, and revision questions.',
    author: 'Mr. Okello David',
    views: 285,
  },
  {
    id: 'mat-3',
    title: 'Organic Chemistry: Hydrocarbons & Alkanes Video Tutorial',
    className: 'S.4',
    subject: 'Chemistry',
    type: 'video',
    fileSize: '18 mins Video',
    downloadUrl: 'https://youtube.com',
    description: 'Step-by-step video lecture covering nomenclature, structural isomerism, and chemical tests for alkanes & alkenes.',
    author: 'Mr. Byaruhanga Patrick',
    views: 520,
  },
  {
    id: 'mat-4',
    title: 'East African History: Colonial Administration & Resistance',
    className: 'S.3',
    subject: 'History',
    type: 'notes',
    fileSize: '3.1 MB PDF',
    downloadUrl: '/downloads/S3_East_Africa_History.pdf',
    description: 'Detailed analysis of British indirect rule, the Buganda Agreement of 1900, and armed anti-colonial resistance movements.',
    author: 'Mrs. Asiimwe Grace',
    views: 195,
  },
  {
    id: 'mat-5',
    title: 'UCE Physics: Current Electricity & Ohm’s Law Seminar Paper',
    className: 'S.4',
    subject: 'Physics',
    type: 'past_paper',
    fileSize: '1.5 MB PDF',
    downloadUrl: '/downloads/S4_Physics_Seminar_Masindi.pdf',
    description: 'Bunyoro regional mock examinations and inter-school academic seminar problem sets with worked solutions.',
    author: 'Mr. Tumusiime Ronald',
    views: 410,
  },
  {
    id: 'mat-6',
    title: 'Computer Studies: Computer Hardware, Motherboards & CPU Architecture',
    className: 'S.2',
    subject: 'ICT / Computer',
    type: 'notes',
    fileSize: '2.0 MB PDF',
    downloadUrl: '/downloads/S2_ICT_Hardware_Architecture.pdf',
    description: 'Illustrated guide to internal computer architecture, system bus, registers, and BIOS configuration.',
    author: 'ICT Department',
    views: 160,
  },
];

export function ELearning() {
  const { user } = useAuth();
  const isStaff = user?.role === 'staff';

  const [materials, setMaterials] = useState<LearningMaterial[]>(() => {
    try {
      const saved = localStorage.getItem('gfss_learning_materials');
      return saved ? JSON.parse(saved) : DEFAULT_MATERIALS;
    } catch {
      return DEFAULT_MATERIALS;
    }
  });

  const [classFilter, setClassFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState<'all' | 'notes' | 'past_paper' | 'video'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // New material form
  const [newTitle, setNewTitle] = useState('');
  const [newClass, setNewClass] = useState('S.1');
  const [newSubject, setNewSubject] = useState('Mathematics');
  const [newType, setNewType] = useState<'notes' | 'past_paper' | 'video'>('notes');
  const [newDescription, setNewDescription] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const filtered = materials.filter((m) => {
    if (classFilter !== 'All' && m.className !== classFilter) return false;
    if (typeFilter !== 'all' && m.type !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle || !newDescription) return;

    const added: LearningMaterial = {
      id: `mat-${Date.now()}`,
      title: newTitle,
      className: newClass,
      subject: newSubject,
      type: newType,
      fileSize: newType === 'video' ? 'Video Lecture' : 'PDF Document',
      downloadUrl: newUrl || '#',
      description: newDescription,
      author: user?.name || 'School Faculty',
      views: 1,
    };

    const updated = [added, ...materials];
    setMaterials(updated);
    localStorage.setItem('gfss_learning_materials', JSON.stringify(updated));

    setShowUploadModal(false);
    setNewTitle('');
    setNewDescription('');
    setNewUrl('');
  }

  return (
    <Shell title="E-Learning" back>
      {/* Hero Header */}
      <section className="pa-hero">
        <small>Digital Academic Resource Centre</small>
        <h2>E-Learning & Revision Library</h2>
        <p>Lesson notes, UNEB past exam papers with marking guides, and teacher video lectures for S.1 to S.6.</p>
      </section>

      {/* Search Bar */}
      <div className="pa-search" style={{ border: '1px solid #dfe5dc', borderRadius: '14px', background: '#fff' }}>
        <i className="fas fa-search" style={{ color: '#64748b' }} />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search topics, past papers, subjects..."
          style={{ width: '100%', border: 0, outline: 0, padding: '8px 10px', fontSize: '0.88rem' }}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 0, cursor: 'pointer', color: '#64748b' }}>
            <i className="fas fa-times" />
          </button>
        )}
      </div>

      {/* Filter Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
        <div className="pa-chips" style={{ margin: 0 }}>
          {['All', 'S.1', 'S.2', 'S.3', 'S.4', 'S.5', 'S.6'].map((cls) => (
            <button
              key={cls}
              className={classFilter === cls ? 'is-on' : ''}
              onClick={() => setClassFilter(cls)}
            >
              {cls}
            </button>
          ))}
        </div>

        {isStaff && (
          <button
            onClick={() => setShowUploadModal(true)}
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
            <i className="fas fa-cloud-arrow-up" /> Upload Material
          </button>
        )}
      </div>

      {/* Type pill selectors */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        <button
          onClick={() => setTypeFilter('all')}
          style={{
            padding: '6px 12px',
            borderRadius: '20px',
            border: typeFilter === 'all' ? '1.5px solid var(--g-700)' : '1px solid #cbd5e1',
            background: typeFilter === 'all' ? 'var(--g-100)' : '#fff',
            color: typeFilter === 'all' ? 'var(--g-900)' : '#475569',
            fontWeight: 600,
            fontSize: '0.78rem',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          All Resources ({materials.length})
        </button>
        <button
          onClick={() => setTypeFilter('notes')}
          style={{
            padding: '6px 12px',
            borderRadius: '20px',
            border: typeFilter === 'notes' ? '1.5px solid var(--g-700)' : '1px solid #cbd5e1',
            background: typeFilter === 'notes' ? 'var(--g-100)' : '#fff',
            color: typeFilter === 'notes' ? 'var(--g-900)' : '#475569',
            fontWeight: 600,
            fontSize: '0.78rem',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          <i className="fas fa-book-open" style={{ marginRight: '5px', color: '#166534' }} />
          Lesson Notes
        </button>
        <button
          onClick={() => setTypeFilter('past_paper')}
          style={{
            padding: '6px 12px',
            borderRadius: '20px',
            border: typeFilter === 'past_paper' ? '1.5px solid var(--g-700)' : '1px solid #cbd5e1',
            background: typeFilter === 'past_paper' ? 'var(--g-100)' : '#fff',
            color: typeFilter === 'past_paper' ? 'var(--g-900)' : '#475569',
            fontWeight: 600,
            fontSize: '0.78rem',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          <i className="fas fa-file-signature" style={{ marginRight: '5px', color: '#d97706' }} />
          UNEB Past Papers
        </button>
        <button
          onClick={() => setTypeFilter('video')}
          style={{
            padding: '6px 12px',
            borderRadius: '20px',
            border: typeFilter === 'video' ? '1.5px solid var(--g-700)' : '1px solid #cbd5e1',
            background: typeFilter === 'video' ? 'var(--g-100)' : '#fff',
            color: typeFilter === 'video' ? 'var(--g-900)' : '#475569',
            fontWeight: 600,
            fontSize: '0.78rem',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          <i className="fas fa-video" style={{ marginRight: '5px', color: '#dc2626' }} />
          Video Lessons
        </button>
      </div>

      {/* Materials List */}
      <div style={{ display: 'grid', gap: '12px' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#64748b' }}>
            <i className="fas fa-folder-open" style={{ fontSize: '2.5rem', opacity: 0.4, marginBottom: '8px', display: 'block' }} />
            <strong>No materials match your filter</strong>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem' }}>Try clearing the search query or selecting another class.</p>
          </div>
        ) : (
          filtered.map((mat) => (
            <div key={mat.id} className="pa-panel" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                <div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ background: 'var(--g-100)', color: 'var(--g-800)', fontWeight: 600, fontSize: '0.72rem', padding: '3px 8px', borderRadius: '6px' }}>
                      {mat.className}
                    </span>
                    <span style={{ background: '#f1f5f9', color: '#334155', fontWeight: 600, fontSize: '0.72rem', padding: '3px 8px', borderRadius: '6px' }}>
                      {mat.subject}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      {mat.type === 'notes' ? '📄 Study Notes' : mat.type === 'past_paper' ? '📑 Past Paper' : '🎥 Video Class'}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '0.98rem', margin: '4px 0 6px', color: '#0f2e17' }}>{mat.title}</h3>
                  <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.5, margin: '0 0 10px' }}>{mat.description}</p>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    By {mat.author} • {mat.fileSize}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  <i className="fas fa-eye" style={{ marginRight: '4px' }} />
                  {mat.views} students accessed
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => {
                      alert(`Opening "${mat.title}"\n\nAccessing digital copy directly from the school library cloud.`);
                    }}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '8px',
                      border: 0,
                      background: 'var(--g-700)',
                      color: '#fff',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <i className="fas fa-download" />
                    {mat.type === 'video' ? 'Watch Lecture' : 'Download PDF'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Teacher Upload Modal */}
      {showUploadModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: '#fff', borderRadius: '20px', maxWidth: '440px', width: '100%', padding: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f2e17' }}>Upload Learning Material</h3>
              <button onClick={() => setShowUploadModal(false)} style={{ background: 'none', border: 0, fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' }}>&times;</button>
            </div>

            <form onSubmit={handleUpload}>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Document / Lecture Title</label>
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. S.4 Vectors & Matrices Revision Guide"
                  required
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Class</label>
                  <select
                    value={newClass}
                    onChange={(e) => setNewClass(e.target.value)}
                    style={{ width: '100%', padding: '9px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  >
                    {['S.1', 'S.2', 'S.3', 'S.4', 'S.5', 'S.6'].map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Resource Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    style={{ width: '100%', padding: '9px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  >
                    <option value="notes">Study Notes</option>
                    <option value="past_paper">UNEB Past Paper</option>
                    <option value="video">Video Lecture</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '10px' }}>
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

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Brief Description / Summary</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Outline topics covered and objectives..."
                  rows={3}
                  required
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>File URL or Google Drive Link</label>
                <input
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://..."
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setShowUploadModal(false)} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 0, background: 'var(--g-700)', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Save Resource</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Shell>
  );
}
