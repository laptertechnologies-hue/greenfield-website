import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import type { AdminStats, Student, Announcement, Teacher } from '../utils/api';

export const Admin: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('gfss_token'));
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'announcements' | 'admissions' | 'students' | 'teachers' | 'messages' | 'slides'>('overview');

  // Login form state
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard data states
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [newAnn, setNewAnn] = useState({ title: '', content: '', priority: 'normal' as 'normal' | 'urgent' | 'info' });
  const [newStudent, setNewStudent] = useState({ admission_no: '', name: '', class_name: 'S.1', stream: 'North', gender: 'M', parent_name: '', parent_phone: '', status: 'active' });
  const [newTeacher, setNewTeacher] = useState({
    employee_no: '',
    name: '',
    gender: 'M',
    subject: '',
    qualification: 'Bachelor of Education',
    role: 'teacher',
    department: 'Sciences',
    phone: '',
    email: '',
    create_login: false,
    login_username: '',
    login_password: 'Password@2026'
  });
  const [newSlide, setNewSlide] = useState({ image_url: '', title: '', caption: '', slide_order: 1 });
  const [actionMessage, setActionMessage] = useState('');

  // Check auth
  useEffect(() => {
    if (token) {
      api.getMe()
        .then(u => setUser(u))
        .catch(() => {
          setToken(null);
          localStorage.removeItem('gfss_token');
        });
    }
  }, [token]);

  // Load data based on active tab
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setActionMessage('');

    if (activeTab === 'overview') {
      api.getAdminStats()
        .then(res => setStats(res))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else if (activeTab === 'announcements') {
      api.getAnnouncements()
        .then(res => setAnnouncements(res))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else if (activeTab === 'admissions') {
      api.getAdmissions('pending')
        .then(res => setAdmissions(res.admissions || []))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else if (activeTab === 'students') {
      api.getStudents()
        .then(res => setStudents(res.students || []))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else if (activeTab === 'teachers') {
      api.getTeachers()
        .then(res => setTeachers(res || []))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else if (activeTab === 'messages') {
      api.getMessages('unread')
        .then(res => setMessages(res || []))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else if (activeTab === 'slides') {
      api.getHeroSlides()
        .then(res => setSlides(res || []))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [token, activeTab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const res = await api.login(username, password);
      localStorage.setItem('gfss_token', res.token);
      setToken(res.token);
      setUser(res.user);
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('gfss_token');
    setToken(null);
    setUser(null);
  };

  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnn.title) return;
    try {
      await api.postAnnouncement(newAnn);
      setActionMessage('Announcement published successfully to PostgreSQL database.');
      setNewAnn({ title: '', content: '', priority: 'normal' });
      const updated = await api.getAnnouncements();
      setAnnouncements(updated);
    } catch (err: any) {
      setActionMessage('Failed to post announcement: ' + err.message);
    }
  };

  const handleDeleteAnnouncement = async (id: number) => {
    try {
      await api.deleteAnnouncement(id);
      setAnnouncements(prev => prev.filter(a => a.id !== id));
      setActionMessage('Announcement removed.');
    } catch (err: any) {
      setActionMessage('Failed to remove: ' + err.message);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.admission_no) return;
    try {
      await api.createStudent(newStudent);
      setActionMessage('Student registered into database.');
      setNewStudent({ admission_no: '', name: '', class_name: 'S.1', stream: 'North', gender: 'M', parent_name: '', parent_phone: '', status: 'active' });
      const updated = await api.getStudents();
      setStudents(updated.students);
    } catch (err: any) {
      setActionMessage('Failed to create student: ' + err.message);
    }
  };

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacher.name || !newTeacher.subject) {
      setActionMessage('Please enter teacher name and subject.');
      return;
    }
    try {
      const empNo = newTeacher.employee_no.trim() || `TCH-${Math.floor(1000 + Math.random() * 9000)}`;
      await api.createTeacher({
        name: newTeacher.name,
        employee_no: empNo,
        gender: newTeacher.gender,
        subject: newTeacher.subject,
        qualification: newTeacher.qualification,
        role: newTeacher.role,
        department: newTeacher.department,
        phone: newTeacher.phone,
        email: newTeacher.email,
      });

      // Optionally provision portal login account
      if (newTeacher.create_login) {
        const uName = (newTeacher.login_username.trim() || empNo).toLowerCase();
        try {
          await api.createAdminUser({
            username: uName,
            password: newTeacher.login_password || 'Password@2026',
            name: newTeacher.name,
            role: newTeacher.role === 'headteacher' || newTeacher.role === 'admin' ? 'admin' : 'teacher',
            email: newTeacher.email,
            phone: newTeacher.phone,
          });
        } catch {
          // Continue even if login user exists
        }
      }

      setActionMessage(`Teacher ${newTeacher.name} successfully registered with role: ${newTeacher.role}!`);
      setNewTeacher({
        employee_no: '',
        name: '',
        gender: 'M',
        subject: '',
        qualification: 'Bachelor of Education',
        role: 'teacher',
        department: 'Sciences',
        phone: '',
        email: '',
        create_login: false,
        login_username: '',
        login_password: 'Password@2026'
      });
      const updated = await api.getTeachers();
      setTeachers(updated || []);
    } catch (err: any) {
      setActionMessage('Failed to register teacher: ' + err.message);
    }
  };

  const handleUpdateTeacherRole = async (id: number, role: string) => {
    try {
      await api.updateTeacher(id, { role });
      setTeachers(prev => prev.map(t => t.id === id ? { ...t, role } : t));
      setActionMessage(`Teacher role updated to ${role}.`);
    } catch (err: any) {
      setActionMessage('Failed to update role: ' + err.message);
    }
  };

  const handleToggleTeacherStatus = async (t: Teacher) => {
    try {
      const nextActive = t.active === false ? true : false;
      await api.updateTeacher(t.id, { active: nextActive });
      setTeachers(prev => prev.map(x => x.id === t.id ? { ...x, active: nextActive } : x));
      setActionMessage(`Teacher status changed to ${nextActive ? 'Active' : 'Inactive'}.`);
    } catch (err: any) {
      setActionMessage('Failed to update status: ' + err.message);
    }
  };

  const handleAdmissionStatus = async (id: number, status: string) => {
    try {
      await api.updateAdmissionStatus(id, status);
      setAdmissions(prev => prev.filter(a => a.id !== id));
      setActionMessage(`Application #${id} marked as ${status}.`);
    } catch (err: any) {
      setActionMessage('Failed to update status: ' + err.message);
    }
  };

  const handleAddSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlide.image_url) return;
    try {
      await api.createHeroSlide(newSlide);
      setActionMessage('Hero slide added to slideshow.');
      setNewSlide({ image_url: '', title: '', caption: '', slide_order: 1 });
      const updated = await api.getHeroSlides();
      setSlides(updated);
    } catch (err: any) {
      setActionMessage('Failed to add slide: ' + err.message);
    }
  };

  const handleDeleteSlide = async (id: number) => {
    try {
      await api.deleteHeroSlide(id);
      setSlides(prev => prev.filter(s => s.id !== id));
      setActionMessage('Slide removed.');
    } catch (err: any) {
      setActionMessage('Failed to delete slide: ' + err.message);
    }
  };

  // ----------------------------------------------------
  // Unauthenticated View
  // ----------------------------------------------------
  if (!token) {
    return (
      <div className="admin-login-wrapper" style={{ padding: '80px 20px', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f7f6' }}>
        <div style={{ maxWidth: '440px', width: '100%', background: 'white', padding: '35px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', borderTop: '6px solid var(--primary-green)' }}>
          <div style={{ textAlign: 'center', marginBottom: '25px' }}>
            <img src="/Green-field-secondary-school.jpg" alt="GFSS Logo" style={{ width: '70px', height: '70px', borderRadius: '50%', marginBottom: '10px' }} />
            <h2 style={{ color: 'var(--primary-green)', margin: 0, fontSize: '1.6rem' }}>GFSS Administration</h2>
            <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '5px' }}>PostgreSQL Cloud Management Portal</p>
          </div>

          {loginError && (
            <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.88rem' }}>
              <i className="fas fa-exclamation-circle" style={{ marginRight: '6px' }}></i> {loginError}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', marginBottom: '6px', color: '#333' }}>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '8px', fontSize: '0.95rem' }}
              />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', marginBottom: '6px', color: '#333' }}>Password</label>
              <input
                type="password"
                value={password}
                placeholder="Admin password"
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '8px', fontSize: '0.95rem' }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              style={{
                width: '100%',
                background: 'linear-gradient(to right, var(--accent-green), var(--primary-green))',
                color: 'white',
                border: 'none',
                padding: '14px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              {isLoggingIn ? <><i className="fas fa-spinner fa-spin"></i> Authenticating...</> : <><i className="fas fa-lock"></i> Secure Admin Sign In</>}
            </button>
          </form>

          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.8rem', color: '#888' }}>
            Greenfield Secondary School Masindi &bull; Cloud PostgreSQL 18.x
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // Authenticated Admin Dashboard View
  // ----------------------------------------------------
  return (
    <div className="admin-dashboard-container" style={{ background: '#f8fafc', minHeight: '90vh', padding: '30px 5%' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '25px', background: 'white', padding: '18px 24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/Green-field-secondary-school.jpg" alt="GFSS Logo" style={{ width: '45px', height: '45px', borderRadius: '50%' }} />
          <div>
            <h2 style={{ margin: 0, color: 'var(--primary-green)', fontSize: '1.35rem' }}>Greenfield Administration</h2>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Logged in as <strong>{user?.name || user?.username || 'Admin'}</strong> ({user?.role || 'Administrator'})
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', padding: '8px 18px', borderRadius: '8px', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <i className="fas fa-sign-out-alt"></i> Sign Out
        </button>
      </div>

      {actionMessage && (
        <div style={{ background: '#dcfce7', color: '#15803d', padding: '12px 18px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #86efac', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span><i className="fas fa-check-circle" style={{ marginRight: '8px' }}></i> {actionMessage}</span>
          <button onClick={() => setActionMessage('')} style={{ background: 'transparent', border: 'none', color: '#15803d', cursor: 'pointer', fontWeight: 'bold' }}>&times;</button>
        </div>
      )}

      {/* Tabs Nav */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '25px', paddingBottom: '5px' }}>
        {[
          { id: 'overview', label: 'Overview', icon: 'fa-chart-pie' },
          { id: 'announcements', label: 'Announcements', icon: 'fa-bullhorn' },
          { id: 'admissions', label: 'Admissions', icon: 'fa-file-signature' },
          { id: 'students', label: 'Students', icon: 'fa-user-graduate' },
          { id: 'teachers', label: 'Teachers & Roles', icon: 'fa-chalkboard-user' },
          { id: 'messages', label: 'Inquiries', icon: 'fa-envelope' },
          { id: 'slides', label: 'Hero Slides', icon: 'fa-images' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === tab.id ? 'var(--primary-green)' : 'white',
              color: activeTab === tab.id ? 'white' : '#475569',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
              whiteSpace: 'nowrap'
            }}
          >
            <i className={`fas ${tab.icon}`}></i> {tab.label}
          </button>
        ))}
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
          <i className="fas fa-spinner fa-spin fa-2x"></i>
          <p style={{ marginTop: '10px' }}>Loading data from PostgreSQL database...</p>
        </div>
      )}

      {/* ----------------- TAB: OVERVIEW ----------------- */}
      {!loading && activeTab === 'overview' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '30px' }}>
            <div style={{ background: 'white', padding: '22px', borderRadius: '12px', borderLeft: '4px solid #16a34a', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Active Students</span>
              <h3 style={{ fontSize: '2rem', margin: '8px 0', color: '#0f172a' }}>{stats?.students ?? 0}</h3>
              <span style={{ fontSize: '0.78rem', color: '#16a34a' }}><i className="fas fa-check"></i> Enrolled in GFSS</span>
            </div>

            <div style={{ background: 'white', padding: '22px', borderRadius: '12px', borderLeft: '4px solid #0284c7', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Teachers &amp; Staff</span>
              <h3 style={{ fontSize: '2rem', margin: '8px 0', color: '#0f172a' }}>{stats?.teachers ?? 0}</h3>
              <span style={{ fontSize: '0.78rem', color: '#0284c7' }}><i className="fas fa-chalkboard-teacher"></i> Faculty</span>
            </div>

            <div style={{ background: 'white', padding: '22px', borderRadius: '12px', borderLeft: '4px solid #eab308', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Pending Admissions</span>
              <h3 style={{ fontSize: '2rem', margin: '8px 0', color: '#0f172a' }}>{stats?.pendingAdmissions ?? 0}</h3>
              <span style={{ fontSize: '0.78rem', color: '#eab308' }}><i className="fas fa-clock"></i> Awaiting Review</span>
            </div>

            <div style={{ background: 'white', padding: '22px', borderRadius: '12px', borderLeft: '4px solid #dc2626', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Unread Messages</span>
              <h3 style={{ fontSize: '2rem', margin: '8px 0', color: '#0f172a' }}>{stats?.unreadMessages ?? 0}</h3>
              <span style={{ fontSize: '0.78rem', color: '#dc2626' }}><i className="fas fa-inbox"></i> Website Contact</span>
            </div>
          </div>

          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ color: 'var(--primary-green)', marginTop: 0 }}>Enrolment by Class Level</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px', marginTop: '15px' }}>
              {(stats?.studentsByClass || [
                { class_name: 'S.1', count: '45' },
                { class_name: 'S.2', count: '40' },
                { class_name: 'S.3', count: '38' },
                { class_name: 'S.4', count: '35' },
                { class_name: 'S.5', count: '28' },
                { class_name: 'S.6', count: '22' }
              ]).map((c: any) => (
                <div key={c.class_name} style={{ background: '#f1f5f9', padding: '14px', borderRadius: '8px', textAlign: 'center' }}>
                  <strong style={{ display: 'block', fontSize: '1.1rem', color: 'var(--primary-green)' }}>{c.class_name}</strong>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{c.count} students</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ----------------- TAB: ANNOUNCEMENTS ----------------- */}
      {!loading && activeTab === 'announcements' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', flexWrap: 'wrap' }}>
          {/* Create Form */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ color: 'var(--primary-green)', marginTop: 0 }}><i className="fas fa-plus-circle"></i> New Notice</h3>
            <form onSubmit={handleAddAnnouncement}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Title</label>
                <input
                  type="text"
                  placeholder="e.g. End of Term Circular"
                  value={newAnn.title}
                  onChange={(e) => setNewAnn({ ...newAnn, title: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Priority</label>
                <select
                  value={newAnn.priority}
                  onChange={(e) => setNewAnn({ ...newAnn, priority: e.target.value as any })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                >
                  <option value="normal">📢 Normal Notice</option>
                  <option value="urgent">🔴 Urgent Notice</option>
                  <option value="info">ℹ️ Information</option>
                </select>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Content</label>
                <textarea
                  rows={4}
                  placeholder="Full text of announcement..."
                  value={newAnn.content}
                  onChange={(e) => setNewAnn({ ...newAnn, content: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                />
              </div>

              <button
                type="submit"
                style={{ background: 'var(--primary-green)', color: 'white', border: 'none', padding: '12px 22px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
              >
                Publish Notice
              </button>
            </form>
          </div>

          {/* List */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ color: 'var(--primary-green)', marginTop: 0 }}><i className="fas fa-list"></i> Active Announcements ({announcements.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '500px', overflowY: 'auto' }}>
              {announcements.map((ann) => (
                <div key={ann.id} style={{ borderLeft: `4px solid ${ann.priority === 'urgent' ? '#dc2626' : '#16a34a'}`, padding: '12px 14px', background: '#f8fafc', borderRadius: '0 8px 8px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.95rem' }}>{ann.title}</strong>
                    <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#475569' }}>{ann.content}</p>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{new Date(ann.published_at).toLocaleDateString()}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteAnnouncement(ann.id)}
                    style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '4px' }}
                    title="Delete announcement"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ----------------- TAB: ADMISSIONS ----------------- */}
      {!loading && activeTab === 'admissions' && (
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ color: 'var(--primary-green)', marginTop: 0 }}>Pending Admission Applications ({admissions.length})</h3>
          {admissions.length === 0 ? (
            <p style={{ color: '#64748b' }}>No pending applications at the moment.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                    <th style={{ padding: '10px 14px' }}>Applicant Name</th>
                    <th style={{ padding: '10px 14px' }}>Class Applied</th>
                    <th style={{ padding: '10px 14px' }}>Parent / Guardian</th>
                    <th style={{ padding: '10px 14px' }}>Phone</th>
                    <th style={{ padding: '10px 14px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admissions.map(adm => (
                    <tr key={adm.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 600 }}>{adm.applicant_name}</td>
                      <td style={{ padding: '12px 14px' }}>{adm.class_applied}</td>
                      <td style={{ padding: '12px 14px' }}>{adm.parent_name || 'N/A'}</td>
                      <td style={{ padding: '12px 14px' }}>{adm.parent_phone}</td>
                      <td style={{ padding: '12px 14px', display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleAdmissionStatus(adm.id, 'approved')}
                          style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #86efac', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAdmissionStatus(adm.id, 'rejected')}
                          style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ----------------- TAB: STUDENTS ----------------- */}
      {!loading && activeTab === 'students' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '25px' }}>
          {/* Add Student Form */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ color: 'var(--primary-green)', marginTop: 0 }}><i className="fas fa-user-plus"></i> Register Student</h3>
            <form onSubmit={handleAddStudent}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Admission No.</label>
                <input
                  type="text"
                  placeholder="e.g. GF2026/001"
                  value={newStudent.admission_no}
                  onChange={(e) => setNewStudent({ ...newStudent, admission_no: e.target.value })}
                  required
                  style={{ width: '100%', padding: '9px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Kato Moses"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  required
                  style={{ width: '100%', padding: '9px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Class</label>
                  <select
                    value={newStudent.class_name}
                    onChange={(e) => setNewStudent({ ...newStudent, class_name: e.target.value })}
                    style={{ width: '100%', padding: '9px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                  >
                    <option value="S.1">S.1</option>
                    <option value="S.2">S.2</option>
                    <option value="S.3">S.3</option>
                    <option value="S.4">S.4</option>
                    <option value="S.5">S.5</option>
                    <option value="S.6">S.6</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Stream</label>
                  <input
                    type="text"
                    value={newStudent.stream}
                    onChange={(e) => setNewStudent({ ...newStudent, stream: e.target.value })}
                    style={{ width: '100%', padding: '9px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Parent Phone</label>
                <input
                  type="tel"
                  placeholder="+256 772 000 000"
                  value={newStudent.parent_phone}
                  onChange={(e) => setNewStudent({ ...newStudent, parent_phone: e.target.value })}
                  style={{ width: '100%', padding: '9px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                />
              </div>

              <button
                type="submit"
                style={{ background: 'var(--primary-green)', color: 'white', border: 'none', padding: '11px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', width: '100%' }}
              >
                Save Student Record
              </button>
            </form>
          </div>

          {/* List */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ color: 'var(--primary-green)', marginTop: 0 }}><i className="fas fa-users"></i> Students Database ({students.length})</h3>
            <div style={{ overflowX: 'auto', maxHeight: '500px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                    <th style={{ padding: '8px 12px' }}>Adm No.</th>
                    <th style={{ padding: '8px 12px' }}>Name</th>
                    <th style={{ padding: '8px 12px' }}>Class</th>
                    <th style={{ padding: '8px 12px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((st) => (
                    <tr key={st.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 600 }}>{st.admission_no}</td>
                      <td style={{ padding: '10px 12px' }}>{st.name}</td>
                      <td style={{ padding: '10px 12px' }}>{st.class_name} {st.stream}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{ background: '#dcfce7', color: '#166534', padding: '3px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                          {st.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- TAB: TEACHERS & ROLES ----------------- */}
      {!loading && activeTab === 'teachers' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 380px) 1fr', gap: '25px', alignItems: 'start' }}>
          {/* Register Teacher Form */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ color: 'var(--primary-green)', marginTop: 0, marginBottom: '6px' }}>
              <i className="fas fa-user-plus"></i> Register Teacher & Assign Role
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: 0, marginBottom: '18px' }}>
              Add teaching staff to the school database and assign administrative responsibilities.
            </p>

            <form onSubmit={handleAddTeacher}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Mr. Okello Peter"
                  value={newTeacher.name}
                  onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                  required
                  style={{ width: '100%', padding: '9px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Staff / Employee ID</label>
                  <input
                    type="text"
                    placeholder="e.g. TCH-104"
                    value={newTeacher.employee_no}
                    onChange={(e) => setNewTeacher({ ...newTeacher, employee_no: e.target.value })}
                    style={{ width: '100%', padding: '9px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Gender</label>
                  <select
                    value={newTeacher.gender}
                    onChange={(e) => setNewTeacher({ ...newTeacher, gender: e.target.value })}
                    style={{ width: '100%', padding: '9px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Teaching Subject(s) *</label>
                <input
                  type="text"
                  placeholder="e.g. Mathematics, Physics"
                  value={newTeacher.subject}
                  onChange={(e) => setNewTeacher({ ...newTeacher, subject: e.target.value })}
                  required
                  style={{ width: '100%', padding: '9px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Department</label>
                  <select
                    value={newTeacher.department}
                    onChange={(e) => setNewTeacher({ ...newTeacher, department: e.target.value })}
                    style={{ width: '100%', padding: '9px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                  >
                    <option value="Sciences">Sciences</option>
                    <option value="Humanities">Humanities</option>
                    <option value="Languages">Languages</option>
                    <option value="Vocational">Vocational</option>
                    <option value="Administration">Administration</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px', color: 'var(--primary-green)' }}>
                    Assigned Role *
                  </label>
                  <select
                    value={newTeacher.role}
                    onChange={(e) => setNewTeacher({ ...newTeacher, role: e.target.value })}
                    style={{ width: '100%', padding: '9px', border: '1.5px solid var(--primary-green)', borderRadius: '6px', fontWeight: 600 }}
                  >
                    <option value="teacher">Subject Teacher</option>
                    <option value="class_teacher">Class Teacher</option>
                    <option value="head_of_dept">Head of Dept (HOD)</option>
                    <option value="dos">Director of Studies (DOS)</option>
                    <option value="deputy_head">Deputy Headteacher</option>
                    <option value="headteacher">Headteacher</option>
                    <option value="admin">System Admin</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Qualification</label>
                <input
                  type="text"
                  placeholder="e.g. B.Ed (Hons) Makerere"
                  value={newTeacher.qualification}
                  onChange={(e) => setNewTeacher({ ...newTeacher, qualification: e.target.value })}
                  style={{ width: '100%', padding: '9px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+256 772..."
                    value={newTeacher.phone}
                    onChange={(e) => setNewTeacher({ ...newTeacher, phone: e.target.value })}
                    style={{ width: '100%', padding: '9px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Email</label>
                  <input
                    type="email"
                    placeholder="teacher@greenfield.sc.ug"
                    value={newTeacher.email}
                    onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                    style={{ width: '100%', padding: '9px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                  />
                </div>
              </div>

              {/* Login Account Provisioning */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={newTeacher.create_login}
                    onChange={(e) => setNewTeacher({ ...newTeacher, create_login: e.target.checked })}
                  />
                  <span>Create Staff Portal Login Credentials</span>
                </label>
                {newTeacher.create_login && (
                  <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: '#64748b' }}>Username</label>
                      <input
                        type="text"
                        placeholder="e.g. okello.p"
                        value={newTeacher.login_username}
                        onChange={(e) => setNewTeacher({ ...newTeacher, login_username: e.target.value })}
                        style={{ width: '100%', padding: '7px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.85rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: '#64748b' }}>Initial Password</label>
                      <input
                        type="text"
                        value={newTeacher.login_password}
                        onChange={(e) => setNewTeacher({ ...newTeacher, login_password: e.target.value })}
                        style={{ width: '100%', padding: '7px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                style={{ background: 'var(--primary-green)', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', width: '100%', fontSize: '0.92rem' }}
              >
                <i className="fas fa-check-circle" style={{ marginRight: '6px' }}></i> Register Staff Member
              </button>
            </form>
          </div>

          {/* Teachers List & Role Manager */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ color: 'var(--primary-green)', margin: 0 }}>
                  <i className="fas fa-chalkboard-user"></i> Teaching Staff Directory ({teachers.length})
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>View all staff and adjust roles on the fly</span>
              </div>
            </div>

            <div style={{ overflowX: 'auto', maxHeight: '550px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                    <th style={{ padding: '10px 12px' }}>Staff Member</th>
                    <th style={{ padding: '10px 12px' }}>Subject & Dept</th>
                    <th style={{ padding: '10px 12px' }}>Current Role</th>
                    <th style={{ padding: '10px 12px' }}>Reassign Role</th>
                    <th style={{ padding: '10px 12px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                        No teachers found. Use the form on the left to register teaching staff.
                      </td>
                    </tr>
                  ) : (
                    teachers.map((tch) => {
                      const roleMeta: Record<string, { label: string; bg: string; color: string }> = {
                        headteacher: { label: 'Headteacher', bg: '#f3e8ff', color: '#6b21a8' },
                        deputy_head: { label: 'Deputy Head', bg: '#e0e7ff', color: '#3730a3' },
                        dos: { label: 'DOS', bg: '#fef3c7', color: '#92400e' },
                        head_of_dept: { label: 'HOD', bg: '#dbeafe', color: '#1e40af' },
                        class_teacher: { label: 'Class Teacher', bg: '#d1fae5', color: '#065f46' },
                        admin: { label: 'Administrator', bg: '#fee2e2', color: '#991b1b' },
                        teacher: { label: 'Subject Teacher', bg: '#f1f5f9', color: '#334155' },
                      };
                      const current = roleMeta[tch.role] || { label: tch.role || 'Teacher', bg: '#f1f5f9', color: '#334155' };
                      return (
                        <tr key={tch.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '10px 12px' }}>
                            <strong style={{ display: 'block', color: 'var(--g-900)' }}>{tch.name}</strong>
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{tch.employee_no || `ID #${tch.id}`}</span>
                            {tch.phone && <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>📞 {tch.phone}</span>}
                          </td>
                          <td style={{ padding: '10px 12px' }}>
                            <span style={{ fontWeight: 500 }}>{tch.subject}</span>
                            <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>{tch.department || 'General'}</span>
                          </td>
                          <td style={{ padding: '10px 12px' }}>
                            <span style={{ background: current.bg, color: current.color, padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                              {current.label}
                            </span>
                          </td>
                          <td style={{ padding: '10px 12px' }}>
                            <select
                              value={tch.role}
                              onChange={(e) => handleUpdateTeacherRole(tch.id, e.target.value)}
                              style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', background: '#fff' }}
                            >
                              <option value="teacher">Subject Teacher</option>
                              <option value="class_teacher">Class Teacher</option>
                              <option value="head_of_dept">Head of Dept (HOD)</option>
                              <option value="dos">DOS</option>
                              <option value="deputy_head">Deputy Head</option>
                              <option value="headteacher">Headteacher</option>
                              <option value="admin">System Admin</option>
                            </select>
                          </td>
                          <td style={{ padding: '10px 12px' }}>
                            <button
                              onClick={() => handleToggleTeacherStatus(tch)}
                              style={{
                                border: 'none',
                                background: tch.active !== false ? '#dcfce7' : '#fee2e2',
                                color: tch.active !== false ? '#15803d' : '#b91c1c',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              {tch.active !== false ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- TAB: MESSAGES / INQUIRIES ----------------- */}
      {!loading && activeTab === 'messages' && (
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ color: 'var(--primary-green)', marginTop: 0 }}><i className="fas fa-envelope-open-text"></i> Contact Messages ({messages.length})</h3>
          {messages.length === 0 ? (
            <p style={{ color: '#64748b' }}>No unread contact inquiries.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {messages.map((msg) => (
                <div key={msg.id} style={{ border: '1px solid #e2e8f0', padding: '16px', borderRadius: '8px', background: '#fafafa' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <strong>{msg.name} ({msg.subject || 'Inquiry'})</strong>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{new Date(msg.submitted_at).toLocaleString()}</span>
                  </div>
                  <p style={{ margin: '0 0 8px', color: '#334155', fontSize: '0.92rem' }}>{msg.message}</p>
                  <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    {msg.email && <span style={{ marginRight: '15px' }}><i className="fas fa-envelope"></i> {msg.email}</span>}
                    {msg.phone && <span><i className="fas fa-phone"></i> {msg.phone}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ----------------- TAB: HERO SLIDES ----------------- */}
      {!loading && activeTab === 'slides' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ color: 'var(--primary-green)', marginTop: 0 }}><i className="fas fa-plus"></i> Add Hero Slide</h3>
            <form onSubmit={handleAddSlide}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Image Path / URL</label>
                <input
                  type="text"
                  placeholder="e.g. /photos/sports (1).jpg or https://..."
                  value={newSlide.image_url}
                  onChange={(e) => setNewSlide({ ...newSlide, image_url: e.target.value })}
                  required
                  style={{ width: '100%', padding: '9px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Slide Title</label>
                <input
                  type="text"
                  placeholder="e.g. Greenfield Sports Gala"
                  value={newSlide.title}
                  onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
                  style={{ width: '100%', padding: '9px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Caption</label>
                <textarea
                  rows={2}
                  placeholder="Short caption..."
                  value={newSlide.caption}
                  onChange={(e) => setNewSlide({ ...newSlide, caption: e.target.value })}
                  style={{ width: '100%', padding: '9px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Order (1, 2, 3...)</label>
                <input
                  type="number"
                  value={newSlide.slide_order}
                  onChange={(e) => setNewSlide({ ...newSlide, slide_order: parseInt(e.target.value) || 1 })}
                  style={{ width: '100%', padding: '9px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                />
              </div>

              <button
                type="submit"
                style={{ background: 'var(--primary-green)', color: 'white', border: 'none', padding: '11px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', width: '100%' }}
              >
                Add Slide
              </button>
            </form>
          </div>

          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ color: 'var(--primary-green)', marginTop: 0 }}>Active Slides ({slides.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '500px', overflowY: 'auto' }}>
              {slides.map(s => (
                <div key={s.id} style={{ display: 'flex', gap: '12px', alignItems: 'center', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '8px' }}>
                  <img src={s.image_url} alt={s.title} style={{ width: '70px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} />
                  <div style={{ flex: 1 }}>
                    <strong style={{ fontSize: '0.9rem' }}>{s.title || 'Untitled'}</strong>
                    <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b' }}>{s.caption}</p>
                  </div>
                  <button onClick={() => handleDeleteSlide(s.id)} style={{ color: '#dc2626', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
