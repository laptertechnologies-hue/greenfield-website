import { createContext, useContext, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth';
import { api, type Student } from './data';
import { Welcome } from './screens/Welcome';
import { SignIn } from './screens/SignIn';
import { StaffHome } from './screens/StaffHome';
import { Students } from './screens/Students';
import { StudentDetail } from './screens/StudentDetail';
import { MarksSheet } from './screens/MarksSheet';
import { Fees } from './screens/Fees';
import { ParentHome } from './screens/ParentHome';
import { Results } from './screens/Results';
import { Attendance } from './screens/Attendance';
import { More } from './screens/More';
import './portal.css';
import { AppInstallBanner } from '../components/AppInstallBanner';

// Which child a parent is currently looking at
interface ChildCtx { children: Student[]; child: Student | null; setChildId: (id: string) => void; }
const ChildContext = createContext<ChildCtx>({ children: [], child: null, setChildId: () => {} });
// eslint-disable-next-line react-refresh/only-export-components
export const useChild = () => useContext(ChildContext);

function ChildProvider({ children: kids }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [list, setList] = useState<Student[]>([]);
  const [childId, setChildId] = useState<string | null>(null);
  useEffect(() => {
    if (user?.role !== 'parent' || !user.childIds) return;
    Promise.all(user.childIds.map((id) => api.student(id))).then((r) => {
      const found = r.filter(Boolean) as Student[];
      setList(found);
      setChildId((cur) => cur ?? found[0]?.id ?? null);
    });
  }, [user]);
  const child = list.find((c) => c.id === childId) ?? null;
  return <ChildContext.Provider value={{ children: list, child, setChildId }}>{kids}</ChildContext.Provider>;
}

function Guard({ staff, parent }: { staff?: React.ReactNode; parent?: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/app/sign-in" replace />;
  const el = user.role === 'staff' ? staff : parent;
  return el ? <>{el}</> : <Navigate to="/app/home" replace />;
}

function Routed() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route index element={user ? <Navigate to="home" replace /> : <Welcome />} />
      <Route path="sign-in" element={user ? <Navigate to="/app/home" replace /> : <SignIn />} />
      <Route path="home" element={<Guard staff={<StaffHome />} parent={<ParentHome />} />} />
      <Route path="students" element={<Guard staff={<Students />} />} />
      <Route path="students/:id" element={<Guard staff={<StudentDetail />} />} />
      <Route path="marks" element={<Guard staff={<MarksSheet />} />} />
      <Route path="fees" element={<Guard staff={<Fees />} parent={<Fees />} />} />
      <Route path="results" element={<Guard parent={<Results />} />} />
      <Route path="attendance" element={<Guard parent={<Attendance />} />} />
      <Route path="more" element={<Guard staff={<More />} parent={<More />} />} />
      <Route path="*" element={<Navigate to="/app" replace />} />
    </Routes>
  );
}

export default function PortalApp() {
  return (
    <AuthProvider>
      <ChildProvider>
        <div className="pa-root">
          <AppInstallBanner />
          <Routed />
        </div>
      </ChildProvider>
    </AuthProvider>
  );
}
