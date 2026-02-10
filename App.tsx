
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import FriendsPage from './pages/FriendsPage';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';
import { User, AuthState } from './types';
import { mockDatabase } from './services/mockDatabase';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    const savedUser = mockDatabase.getCurrentUser();
    if (savedUser) {
      setAuth({ user: savedUser, isAuthenticated: true });
    }
  }, []);

  const handleLogin = (user: User) => {
    mockDatabase.setCurrentUser(user);
    setAuth({ user, isAuthenticated: true });
  };

  const handleLogout = () => {
    mockDatabase.clearCurrentUser();
    setAuth({ user: null, isAuthenticated: false });
  };

  const refreshUser = () => {
    const updated = mockDatabase.getCurrentUser();
    if (updated) setAuth(prev => ({ ...prev, user: updated }));
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        {auth.isAuthenticated && <Navbar onLogout={handleLogout} user={auth.user} />}
        <main className="flex-grow flex flex-col items-center justify-center py-4">
          <Routes>
            <Route 
              path="/login" 
              element={!auth.isAuthenticated ? <AuthPage onLogin={handleLogin} /> : <Navigate to="/" />} 
            />
            <Route 
              path="/" 
              element={auth.isAuthenticated ? <Dashboard user={auth.user!} onUpdate={refreshUser} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/friends" 
              element={auth.isAuthenticated ? <FriendsPage user={auth.user!} onUpdate={refreshUser} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/profile" 
              element={auth.isAuthenticated ? <ProfilePage user={auth.user!} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/admin" 
              element={auth.isAuthenticated && auth.user?.isAdmin ? <AdminDashboard /> : <Navigate to="/login" />} 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        
        {auth.isAuthenticated && (
          <footer className="w-full text-center py-6 text-[10px] text-slate-400 opacity-60 tracking-widest font-light">
            AN-AN SYSTEM · 安全守護中 · 平安每一天
          </footer>
        )}
      </div>
    </HashRouter>
  );
};

export default App;
