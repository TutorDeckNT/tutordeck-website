import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ChaptersPage from './pages/ChaptersPage';
import GetInvolvedPage from './pages/GetInvolvedPage';
import AIHelperPage from './pages/AIHelperPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

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
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/chapters" element={<ChaptersPage />} />
        <Route path="/get-involved" element={<GetInvolvedPage />} />
        <Route path="/ai-helper" element={<AIHelperPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
      </Routes>
      <Footer />
    </>
  );
}

export default App;```

**Step 8: Upgrade the Header**

*   **File:** Create a new folder `hooks` inside `src`. Inside this new `hooks` folder, create a new file named `useClickOutside.ts`.
*   **Action:** Add the following code. This is a small helper for the profile dropdown menu.

```typescript
import { useEffect, RefObject } from 'react';

type Event = MouseEvent | TouchEvent;

export const useClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: Event) => void
) => {
  useEffect(() => {
    const listener = (event: Event) => {
      const el = ref?.current;
      if (!el || el.contains((event?.target as Node) || null)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};
