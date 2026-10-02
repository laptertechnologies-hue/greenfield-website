// Central API utility for the GFSS website and app
const API_URL = import.meta.env.VITE_API_URL || 'https://api.laptertech.store/api';

/**
 * Generic API fetch with timeout and error handling
 */
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  timeoutMs = 8000
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    clearTimeout(timer);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    return res.json() as Promise<T>;
  } catch (err: any) {
    clearTimeout(timer);
    if (err.name === 'AbortError') throw new Error('Request timed out');
    throw err;
  }
}

/** Get auth token from localStorage */
const getToken = () => localStorage.getItem('gfss_token');

/** Authenticated fetch */
async function authFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  return apiFetch<T>(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

// ─── Public API calls ──────────────────────────────────────────────
export const api = {
  /** Hero slideshow images */
  getHeroSlides: () => apiFetch<HeroSlide[]>('/hero'),

  /** Announcements */
  getAnnouncements: () => apiFetch<Announcement[]>('/announcements'),

  /** News */
  getNews: (limit = 6) => apiFetch<NewsItem[]>(`/news?limit=${limit}`),
  getNewsById: (id: number) => apiFetch<NewsItem>(`/news/${id}`),

  /** Gallery */
  getGallery: (category?: string, limit = 60) =>
    apiFetch<GalleryItem[]>(`/gallery?${category ? `category=${category}&` : ''}limit=${limit}`),

  /** Fees */
  getFees: (year = new Date().getFullYear()) => apiFetch<FeesEntry[]>(`/fees?year=${year}`),

  /** Teachers (public) */
  getTeachers: () => apiFetch<Teacher[]>('/teachers'),

  /** School settings */
  getSettings: () => apiFetch<Record<string, string>>('/settings'),

  /** Submit admission form */
  submitAdmission: (data: AdmissionForm) =>
    apiFetch<{ message: string; application: any }>('/admissions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /** Submit contact message */
  submitContact: (data: ContactForm) =>
    apiFetch<{ message: string }>('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // ─── Admin (authenticated) ────────────────────────────────────────
  login: (username: string, password: string) =>
    apiFetch<{ token: string; user: AdminUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  getMe: () => authFetch<AdminUser>('/auth/me'),

  getAdminStats: () => authFetch<AdminStats>('/admin/stats'),

  getRecentActivity: () => authFetch<RecentActivity[]>('/admin/recent-activity'),

  getStudents: (params?: { search?: string; class_name?: string; status?: string }) =>
    authFetch<{ students: Student[]; total: number }>(
      `/students?${new URLSearchParams(params as any).toString()}`
    ),

  createStudent: (data: Partial<Student>) =>
    authFetch<Student>('/students', { method: 'POST', body: JSON.stringify(data) }),

  updateStudent: (id: number, data: Partial<Student>) =>
    authFetch<Student>(`/students/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  getAdmissions: (status = 'pending') =>
    authFetch<{ admissions: any[]; total: number }>(`/admissions?status=${status}`),

  updateAdmissionStatus: (id: number, status: string, notes?: string) =>
    authFetch<any>(`/admissions/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    }),

  getMessages: (status = 'unread') => authFetch<any[]>(`/contact?status=${status}`),

  postAnnouncement: (data: Partial<Announcement>) =>
    authFetch<Announcement>('/announcements', { method: 'POST', body: JSON.stringify(data) }),

  deleteAnnouncement: (id: number) =>
    authFetch<any>(`/announcements/${id}`, { method: 'DELETE' }),

  createHeroSlide: (data: Partial<HeroSlide>) =>
    authFetch<HeroSlide>('/hero', { method: 'POST', body: JSON.stringify(data) }),

  deleteHeroSlide: (id: number) =>
    authFetch<any>(`/hero/${id}`, { method: 'DELETE' }),

  /** Teacher and staff management */
  createTeacher: (data: Partial<Teacher>) =>
    authFetch<Teacher>('/teachers', { method: 'POST', body: JSON.stringify(data) }),

  updateTeacher: (id: number, data: Partial<Teacher>) =>
    authFetch<Teacher>(`/teachers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  getAdminUsers: () => authFetch<any[]>('/admin/users'),

  createAdminUser: (data: { username: string; password: string; name: string; role: string; email?: string; phone?: string }) =>
    authFetch<any>('/admin/users', { method: 'POST', body: JSON.stringify(data) }),
};

// ─── Types ────────────────────────────────────────────────────────
export interface HeroSlide {
  id: number;
  image_url: string;
  title: string;
  caption: string;
  slide_order: number;
  active: boolean;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  priority: 'urgent' | 'normal' | 'info';
  published_at: string;
  expires_at?: string;
}

export interface NewsItem {
  id: number;
  title: string;
  content?: string;
  excerpt: string;
  image_url?: string;
  author: string;
  published_at: string;
}

export interface GalleryItem {
  id: number;
  image_url: string;
  caption?: string;
  category: string;
}

export interface FeesEntry {
  id: number;
  class_name: string;
  term: string;
  academic_year: number;
  tuition_fees: number;
  boarding_fees: number;
  development_fees: number;
  other_fees: number;
  total: number;
}

export interface Teacher {
  id: number;
  employee_no?: string;
  name: string;
  gender?: string;
  subject: string;
  qualification?: string;
  role: string;
  department: string;
  email?: string;
  phone?: string;
  photo_url?: string;
  active?: boolean;
}

export interface Student {
  id: number;
  admission_no: string;
  name: string;
  dob?: string;
  gender?: string;
  class_name: string;
  stream?: string;
  parent_name?: string;
  parent_phone?: string;
  status: string;
}

export interface AdminUser {
  id: number;
  username: string;
  name: string;
  role: string;
  email?: string;
}

export interface AdminStats {
  students: number;
  teachers: number;
  announcements: number;
  pendingAdmissions: number;
  unreadMessages: number;
  news: number;
  studentsByClass: { class_name: string; count: string }[];
}

export interface RecentActivity {
  type: string;
  title: string;
  date: string;
  status: string;
}

export interface AdmissionForm {
  applicant_name: string;
  dob?: string;
  gender?: string;
  previous_school?: string;
  class_applied: string;
  parent_name?: string;
  parent_phone: string;
  parent_email?: string;
  message?: string;
}

export interface ContactForm {
  name: string;
  email?: string;
  phone?: string;
  subject?: string;
  message: string;
}

export default api;
