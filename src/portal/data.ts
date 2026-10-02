// ---------------------------------------------------------------------------
// Portal data layer: talks to the live GFSS API (PostgreSQL).
// Everything the screens need comes through the `api` object below.
// ---------------------------------------------------------------------------

export type Role = 'parent' | 'staff';

export interface User {
  id: string;
  name: string;
  role: Role;
  title: string;          // "Administrator", "Parent / Student"
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
  stream: string;         // "C"
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
  phone: '+256 772 904964',
  email: 'greenfieldsecondary@gmail.com',
};

const API = import.meta.env.VITE_API_URL || 'https://api.laptertech.store/api';
const TOKEN_KEY = 'gfss-portal-token';
const SESSION_KEY = 'gfss-portal-session';

const getToken = () => { try { return localStorage.getItem(TOKEN_KEY); } catch { return null; } };

async function call<T>(path: string, init: RequestInit = {}, auth = true): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${API}/portal${path}`, { ...init, headers: { ...headers, ...(init.headers as object) } });
  } catch {
    throw new Error('Can’t reach the school server. Check your internet connection and try again.');
  }

  if (res.status === 401 && auth) {
    // Session ended: clear it and send the user to sign in
    try { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
    if (!location.pathname.endsWith('/sign-in')) location.href = '/app/sign-in';
  }
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || 'Something went wrong. Please try again.');
  return body as T;
}

export const api = {
  async signIn(login: string, password: string, role: Role): Promise<User> {
    const r = await call<{ token: string; user: User }>('/login', {
      method: 'POST', body: JSON.stringify({ login, password, role }),
    }, false);
    try { localStorage.setItem(TOKEN_KEY, r.token); } catch { /* ignore */ }
    return r.user;
  },

  students: () => call<Student[]>('/students'),

  async student(id: string): Promise<Student | undefined> {
    try { return await call<Student>(`/students/${id}`); } catch { return undefined; }
  },

  marks: (studentId: string) => call<SubjectMark[]>(`/students/${studentId}/marks`),
  fees: (studentId: string) => call<FeeItem[]>(`/students/${studentId}/fees`),
  balances: () => call<Record<string, number>>('/balances'),
  attendance: (studentId: string) => call<AttendanceDay[]>(`/students/${studentId}/attendance`),

  overview: () => call<{
    students: number; boys: number; girls: number; classes: number; streams: number;
    teachers: number; parents: number; reportsUploaded: number; smsToday: number;
    feesCollected: number; feesExpected: number;
  }>('/overview'),

  async saveMarks(entries: { studentId: string; subject: string; bot?: number; mot?: number; eot?: number }[]): Promise<number> {
    const r = await call<{ saved: number }>('/marks', { method: 'POST', body: JSON.stringify({ term: SCHOOL.term, entries }) });
    return r.saved;
  },

  changePin: (newPin: string, currentPin?: string) =>
    call<{ ok: boolean; message: string }>('/change-pin', {
      method: 'POST',
      body: JSON.stringify({ newPin, currentPin }),
    }),

  resetPin: (studentId: string, newPin?: string) =>
    call<{ ok: boolean; message: string }>('/reset-pin', {
      method: 'POST',
      body: JSON.stringify({ studentId, newPin }),
    }),

  announcements: async () => {
    try {
      const res = await fetch(`${API}/announcements`);
      return (await res.json()) as { id: number; title: string; content: string; date?: string; priority?: string }[];
    } catch {
      return [];
    }
  },
};

export const ugx = (n: number) => 'UGX ' + Math.abs(n).toLocaleString('en-UG');

export function grade(score: number) {
  if (score >= 80) return 'D1'; if (score >= 75) return 'D2'; if (score >= 70) return 'C3';
  if (score >= 65) return 'C4'; if (score >= 60) return 'C5'; if (score >= 55) return 'C6';
  if (score >= 50) return 'P7'; if (score >= 45) return 'P8'; return 'F9';
}
