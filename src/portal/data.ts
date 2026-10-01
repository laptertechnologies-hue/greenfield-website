// ---------------------------------------------------------------------------
// Portal data layer.
// Everything the screens need comes through the `api` object below.
// Right now it returns DEMO data stored in the browser. To go live, replace the
// body of each function with a fetch() to your backend (see README-PORTAL.md).
// ---------------------------------------------------------------------------

export type Role = 'parent' | 'staff';

export interface User {
  id: string;
  name: string;
  role: Role;
  title: string;          // "Head teacher", "Parent", "Class teacher"
  initials: string;
  childIds?: string[];    // for parents
}

export interface Student {
  id: string;
  name: string;
  admissionNo: string;
  payCode: string;
  gender: 'M' | 'F';
  className: string;      // "S.2"
  stream: string;         // "North"
  status: 'active' | 'suspended';
  photo?: string;
}

export interface SubjectMark { subject: string; bot: number; mot: number; eot: number; }
export interface FeeItem { date: string; description: string; amount: number; }  // +charge, -payment
export interface AttendanceDay { date: string; present: boolean; }

export const SCHOOL = {
  name: 'Greenfield Secondary School',
  short: 'GFSS',
  motto: 'Hard work pays',
  town: 'Masindi',
  term: '2026 Term 3',
  logo: '/photos/school-logo.jpg',
  phone: '+256 700 000 000',
  email: 'greenfieldsecondary@gmail.com',
};

const STUDENTS: Student[] = [
  { id: 's1', name: 'Amanya Grace', admissionNo: 'GF2101', payCode: 'PC2101', gender: 'F', className: 'S.2', stream: 'North', status: 'active' },
  { id: 's2', name: 'Byaruhanga Joel', admissionNo: 'GF2102', payCode: 'PC2102', gender: 'M', className: 'S.2', stream: 'North', status: 'active' },
  { id: 's3', name: 'Kusiima Ruth', admissionNo: 'GF2215', payCode: 'PC2215', gender: 'F', className: 'S.2', stream: 'East', status: 'active' },
  { id: 's4', name: 'Mugisa Daniel', admissionNo: 'GF2033', payCode: 'PC2033', gender: 'M', className: 'S.4', stream: 'West', status: 'active' },
  { id: 's5', name: 'Nyakato Brenda', admissionNo: 'GF1987', payCode: 'PC1987', gender: 'F', className: 'S.5', stream: 'Arts', status: 'active' },
  { id: 's6', name: 'Tumusiime Ivan', admissionNo: 'GF1990', payCode: 'PC1990', gender: 'M', className: 'S.5', stream: 'Sciences', status: 'suspended' },
  { id: 's7', name: 'Atugonza Sharon', admissionNo: 'GF2301', payCode: 'PC2301', gender: 'F', className: 'S.1', stream: 'East', status: 'active' },
  { id: 's8', name: 'Kato Emmanuel', admissionNo: 'GF2302', payCode: 'PC2302', gender: 'M', className: 'S.1', stream: 'West', status: 'active' },
];

const SUBJECTS = ['English', 'Mathematics', 'Biology', 'Chemistry', 'Physics', 'Geography', 'History', 'CRE', 'Agriculture', 'Entrepreneurship'];

function seededMarks(seed: number): SubjectMark[] {
  return SUBJECTS.map((subject, i) => {
    const base = 45 + ((seed * 17 + i * 23) % 45);
    return { subject, bot: Math.min(100, base - 4), mot: Math.min(100, base + 2), eot: Math.min(100, base + 5) };
  });
}

const FEES: Record<string, FeeItem[]> = {
  s1: [
    { date: '2026-09-01', description: 'Term 3 tuition', amount: 650000 },
    { date: '2026-09-01', description: 'Boarding', amount: 350000 },
    { date: '2026-09-04', description: 'Payment via SchoolPay', amount: -500000 },
    { date: '2026-09-22', description: 'Payment via Mobile Money', amount: -300000 },
  ],
  s3: [
    { date: '2026-09-01', description: 'Term 3 tuition', amount: 650000 },
    { date: '2026-09-02', description: 'Payment via bank', amount: -650000 },
  ],
};

const USERS: { login: string; password: string; user: User }[] = [
  { login: 'headteacher', password: 'admin123', user: { id: 'u1', name: 'Head', role: 'staff', title: 'Head teacher', initials: 'HT' } },
  { login: '0772000000', password: '1234', user: { id: 'u2', name: 'Mrs Amanya', role: 'parent', title: 'Parent', initials: 'MA', childIds: ['s1', 's3'] } },
  { login: 'PC2101', password: '1234', user: { id: 'u3', name: 'Amanya Grace', role: 'parent', title: 'Student', initials: 'AG', childIds: ['s1'] } },
];

const wait = (ms = 350) => new Promise((r) => setTimeout(r, ms));

export const api = {
  async signIn(login: string, password: string, role: Role): Promise<User> {
    await wait();
    const hit = USERS.find((u) => u.login.toLowerCase() === login.trim().toLowerCase() && u.password === password && u.user.role === role);
    if (!hit) throw new Error(role === 'staff'
      ? 'That username and password don’t match. Check both and try again.'
      : 'That phone number or pay code and password don’t match. Check both and try again.');
    return hit.user;
  },

  async students(): Promise<Student[]> { await wait(200); return STUDENTS; },

  async student(id: string): Promise<Student | undefined> { await wait(150); return STUDENTS.find((s) => s.id === id); },

  async marks(studentId: string): Promise<SubjectMark[]> {
    await wait(200);
    return seededMarks(Number(studentId.replace(/\D/g, '')) || 1);
  },

  async fees(studentId: string): Promise<FeeItem[]> { await wait(200); return FEES[studentId] ?? [{ date: '2026-09-01', description: 'Term 3 tuition', amount: 650000 }]; },

  async attendance(studentId: string): Promise<AttendanceDay[]> {
    await wait(200);
    const days: AttendanceDay[] = [];
    const seed = Number(studentId.replace(/\D/g, '')) || 1;
    const d = new Date('2026-09-01');
    while (d <= new Date('2026-09-30')) {
      const dow = d.getDay();
      if (dow !== 0 && dow !== 6) days.push({ date: d.toISOString().slice(0, 10), present: (d.getDate() * seed) % 11 !== 0 });
      d.setDate(d.getDate() + 1);
    }
    return days;
  },

  async overview() {
    await wait(250);
    const s = STUDENTS;
    return {
      students: s.filter((x) => x.status === 'active').length,
      boys: s.filter((x) => x.gender === 'M').length,
      girls: s.filter((x) => x.gender === 'F').length,
      classes: new Set(s.map((x) => x.className)).size,
      streams: new Set(s.map((x) => x.className + x.stream)).size,
      teachers: 34,
      parents: 2,
      reportsUploaded: 0,
      smsToday: 0,
      feesCollected: 1450000,
      feesExpected: 4950000,
    };
  },
};

export const ugx = (n: number) => 'UGX ' + Math.abs(n).toLocaleString('en-UG');

export function grade(score: number) {
  if (score >= 80) return 'D1'; if (score >= 75) return 'D2'; if (score >= 70) return 'C3';
  if (score >= 65) return 'C4'; if (score >= 60) return 'C5'; if (score >= 55) return 'C6';
  if (score >= 50) return 'P7'; if (score >= 45) return 'P8'; return 'F9';
}
