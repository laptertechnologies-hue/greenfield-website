import { type ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { SCHOOL } from './data';
import { useAuth } from './auth';

const STAFF_TABS = [
  { to: '/app/home', icon: 'fa-house', label: 'Home' },
  { to: '/app/students', icon: 'fa-user-graduate', label: 'Students' },
  { to: '/app/marks', icon: 'fa-table-list', label: 'Marks' },
  { to: '/app/fees', icon: 'fa-money-bill-wave', label: 'Fees' },
  { to: '/app/more', icon: 'fa-ellipsis', label: 'More' },
];
const PARENT_TABS = [
  { to: '/app/home', icon: 'fa-house', label: 'Home' },
  { to: '/app/results', icon: 'fa-chart-column', label: 'Results' },
  { to: '/app/fees', icon: 'fa-money-bill-wave', label: 'Fees' },
  { to: '/app/attendance', icon: 'fa-calendar-check', label: 'Attendance' },
  { to: '/app/more', icon: 'fa-ellipsis', label: 'More' },
];

interface Props { title: string; children: ReactNode; greeting?: boolean; back?: boolean; headerExtra?: ReactNode; }

export function Shell({ title, children, greeting, back, headerExtra }: Props) {
  const { user } = useAuth();
  const nav = useNavigate();
  const tabs = user?.role === 'staff' ? STAFF_TABS : PARENT_TABS;
  const hour = new Date().getHours();
  const hello = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="pa-screen">
      <header className={`pa-top ${greeting ? 'pa-top--tall' : ''}`}>
        <div className="pa-top-row">
          {back
            ? <button className="pa-icon-btn" onClick={() => nav(-1)} aria-label="Go back"><i className="fas fa-arrow-left" /></button>
            : <img src={SCHOOL.logo} alt="" className="pa-crest" />}
          <div className="pa-top-titles">
            <h1>{title}</h1>
            <span>{SCHOOL.name}, {SCHOOL.town}</span>
          </div>
          <NavLink to="/app/more" className="pa-avatar" aria-label="Your account">{user?.initials}</NavLink>
        </div>
        {greeting && <p className="pa-hello">{hello},<strong>{user?.name}</strong></p>}
        {headerExtra}
      </header>
      <main className="pa-body">{children}</main>
      <nav className="pa-tabs" aria-label="Portal sections">
        {tabs.map((t) => (
          <NavLink key={t.to} to={t.to} className={({ isActive }) => `pa-tab ${isActive ? 'is-on' : ''}`}>
            <span className="pa-tab-icon"><i className={`fas ${t.icon}`} /></span>
            <span>{t.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export function Loading() {
  return <div className="pa-loading" role="status"><span className="pa-spinner" />Loading…</div>;
}
