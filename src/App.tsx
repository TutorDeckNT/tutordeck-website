import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ChaptersPage from './pages/ChaptersPage';
import GetInvolvedPage from './pages/GetInvolvedPage';
import AIHelperPage from './pages/AIHelperPage'; // Import the new page
import Header from './components/Header';
import Footer from './components/Footer';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/chapters" element={<ChaptersPage />} />
        <Route path="/get-involved" element={<GetInvolvedPage />} />
        <Route path="/ai-helper" element={<AIHelperPage />} /> {/* Add the new route */}
      </Routes>
      <Footer />
    </>
  );
}

export default App;
