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

function App() {
  return (
    <DropboxProvider>
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
