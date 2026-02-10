
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import FriendsPage from './pages/FriendsPage';
import Navbar from './components/Navbar';
import { User, AuthState } from './types';
import { mockDatabase } from './services/mockDatabase';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  // Load user from mock "persistence" on mount
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
        {auth.isAuthenticated && <Navbar onLogout={handleLogout} />}
        <main className="flex-grow flex flex-col items-center justify-center p-4">
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
          </Routes>
        </main>
        
        {/* Heartbeat Simulation Footer */}
        {auth.isAuthenticated && (
          <footer className="w-full text-center py-4 text-xs text-slate-400 opacity-60">
            安安系統運行中 · 守護您的平安
          </footer>
        )}
      </div>
    </HashRouter>
  );
};

export default App;
