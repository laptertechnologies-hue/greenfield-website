import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Academics } from './pages/Academics';
import { Admissions } from './pages/Admissions';
import { Gallery } from './pages/Gallery';
import { Contact } from './pages/Contact';

// The parents' portal app lives under /app and has its own look (no website header/footer).
const PortalApp = lazy(() => import('./portal/PortalApp'));

// Inside the Play Store app, open straight into the portal.
const isNativeApp = Capacitor.isNativePlatform();

function Website() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={isNativeApp ? <Navigate to="/app" replace /> : <Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/academics" element={<Academics />} />
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        {/* Old portal links now go to the new app */}
        <Route path="/portal" element={<Navigate to="/app" replace />} />
        <Route path="/login" element={<Navigate to="/app/sign-in" replace />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/app/*" element={<Suspense fallback={null}><PortalApp /></Suspense>} />
        <Route path="/*" element={<Website />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
