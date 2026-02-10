
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '首頁' },
    { path: '/friends', label: '親友' },
    { path: '/profile', label: '我的' },
  ];

  return (
    <nav className="w-full max-w-2xl mx-auto px-6 py-4 flex justify-between items-center z-10">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-200">
          <span className="text-white font-bold text-xs">安</span>
        </div>
        <h1 className="text-lg font-medium text-slate-700 hidden sm:block">安安簽到</h1>
      </div>
      
      <div className="flex items-center space-x-6">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`text-sm transition-colors ${
              location.pathname === item.path
                ? 'text-orange-600 font-medium underline underline-offset-8'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {item.label}
          </Link>
        ))}
        <button
          onClick={onLogout}
          className="text-xs text-slate-400 hover:text-red-500 transition-colors"
        >
          登出
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
