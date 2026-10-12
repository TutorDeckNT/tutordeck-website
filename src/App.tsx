import { Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect, useLayoutEffect } from 'react';
import HomePage from './pages/HomePage';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { useVisibleMotion } from './hooks/useVisibleMotion';
import { DropboxProvider } from './contexts/DropboxContext';

const AboutPage = lazy(() => import('./pages/AboutPage'));
const LeadershipRegistrarPage = lazy(() => import('./pages/LeadershipRegistrarPage'));
const ChaptersPage = lazy(() => import('./pages/ChaptersPage'));
const PartnershipsPage = lazy(() => import('./pages/PartnershipsPage'));
const GetInvolvedPage = lazy(() => import('./pages/GetInvolvedPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const VerificationPage = lazy(() => import('./pages/VerificationPage'));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// --- NEW: Referral Capture Component ---
const ReferralCapture = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get('ref');
    
    if (refCode) {
      // Store the referral code for later use in Dashboard
      localStorage.setItem('pending_referral', refCode);
      
      // Clean the URL visually without reloading the page
      const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + window.location.hash;
      window.history.replaceState({ path: newUrl }, '', newUrl);
    }
  }, []);
  return null;
};

function App() {
  useVisibleMotion();
  // Remove the crawlable homepage only when the app actually commits content. Keep it available if initialization fails.
  useLayoutEffect(() => {
    const fallback = document.getElementById('public-fallback');
    fallback?.remove();
  }, []);
  return (
    <DropboxProvider>
      <ReferralCapture />
      <ScrollToTop />
      <Header />
      <Suspense fallback={<main className="min-h-screen flex items-center justify-center" role="status">Loading page…</main>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/leadership-registrar" element={<LeadershipRegistrarPage />} />
        <Route path="/chapters" element={<ChaptersPage />} />
        <Route path="/partnerships" element={<PartnershipsPage />} />
        <Route path="/get-involved" element={<GetInvolvedPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify/:transcriptId" element={<VerificationPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
      </Routes>
      </Suspense>
      <Footer />
    </DropboxProvider>
  );
}

export default App;
