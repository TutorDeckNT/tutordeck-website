import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { HashRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.tsx'

// Use HashRouter for GitHub Pages compatibility
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>,
)```

**Step 6: Create a "Guard" for the Dashboard**

*   **File:** `src/components/ProtectedRoute.tsx`
*   **Action:** Create this new file. This component will block access to the dashboard unless a user is signed in.

```typescript
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center text-primary">Loading...</div>;
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
