import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, SCHOOL, type Role } from '../data';
import { useAuth } from '../auth';

export function SignIn() {
  const [role, setRole] = useState<Role>('parent');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const nav = useNavigate();

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!login || !password) { setError('Enter both fields to sign in.'); return; }
    setBusy(true);
    try { signIn(await api.signIn(login, password, role)); nav('/app/home', { replace: true }); }
    catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  }

  return (
    <div className="pa-signin">
      <header className="pa-signin-top">
        <button className="pa-icon-btn" onClick={() => nav('/app')} aria-label="Go back"><i className="fas fa-arrow-left" /></button>
        <div className="pa-signin-head">
          <div><h1>Welcome back</h1><p>Sign in to continue</p></div>
          <img src={SCHOOL.logo} alt="" className="pa-crest pa-crest--lg" />
        </div>
      </header>

      <div className="pa-seg" role="tablist" aria-label="Who is signing in">
        <button role="tab" aria-selected={role === 'parent'} className={role === 'parent' ? 'is-on' : ''} onClick={() => { setRole('parent'); setError(''); }}>
          <i className="fas fa-users" /> Parent / student
        </button>
        <button role="tab" aria-selected={role === 'staff'} className={role === 'staff' ? 'is-on' : ''} onClick={() => { setRole('staff'); setError(''); }}>
          <i className="fas fa-chalkboard-user" /> Staff
        </button>
      </div>

      <form className="pa-form" onSubmit={submit} noValidate>
        <label className="pa-field">
          <span>{role === 'staff' ? 'Username' : 'Phone number or school pay code'}</span>
          <div className="pa-input">
            <i className="fas fa-user" />
            <input value={login} onChange={(e) => setLogin(e.target.value)} autoComplete="username"
              inputMode={role === 'parent' ? 'text' : 'text'}
              placeholder={role === 'staff' ? 'e.g. headteacher' : 'e.g. 0772 000000 or PC2101'} />
          </div>
        </label>
        <label className="pa-field">
          <span>Password</span>
          <div className="pa-input">
            <i className="fas fa-lock" />
            <input type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password" placeholder="Enter your password" />
            <button type="button" className="pa-eye" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'}>
              <i className={`fas ${show ? 'fa-eye-slash' : 'fa-eye'}`} />
            </button>
          </div>
        </label>
        {error && <p className="pa-error" role="alert">{error}</p>}
        <button className="pa-btn" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        <p className="pa-fineprint pa-center">Forgot your password? <a href={`tel:${SCHOOL.phone.replace(/\s/g, '')}`}>Call the school office</a>.</p>
      </form>

      <aside className="pa-demo">
        <strong>Demo accounts</strong>
        <span>Parent: 0772000000 / 1234</span>
        <span>Student: PC2101 / 1234</span>
        <span>Staff: headteacher / admin123</span>
      </aside>
    </div>
  );
}
