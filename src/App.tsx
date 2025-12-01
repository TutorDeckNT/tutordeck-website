import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ChaptersPage from './pages/ChaptersPage';
import GetInvolvedPage from './pages/GetInvolvedPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import VerificationPage from './pages/VerificationPage';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { DropboxProvider } from './contexts/DropboxContext';

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
  return (
    <DropboxProvider>
      <ReferralCapture />
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/chapters" element={<ChaptersPage />} />
        <Route path="/get-involved" element={<GetInvolvedPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify/:transcriptId" element={<VerificationPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
      </Routes>
      <Footer />
    </DropboxProvider>
  );
}

export default App;
