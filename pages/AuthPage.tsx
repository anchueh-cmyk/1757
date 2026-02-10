
import React, { useState } from 'react';
import { User } from '../types';

interface AuthPageProps {
  onLogin: (user: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    identifier: '', // Email or Phone
    password: '',
    username: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate network delay
    setTimeout(() => {
      const mockUser: User = {
        id: 'u_' + Math.random().toString(36).substr(2, 5),
        username: formData.username || formData.identifier.split('@')[0],
        lastCheckIn: null,
        streak: 0,
        contacts: [],
        records: []
      };
      onLogin(mockUser);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="w-full max-w-md p-8 glass-card rounded-3xl shadow-xl animate-in fade-in zoom-in duration-500">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-light text-slate-800 tracking-tight">
          {isRegister ? '歡迎加入' : '安安，好久不見'}
        </h2>
        <p className="mt-2 text-slate-400 font-light">
          {isRegister ? '開啟您的健康確認之旅' : '每天報個平安，讓愛不斷連'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {isRegister && (
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1 ml-1">稱呼</label>
            <input
              type="text"
              required
              placeholder="怎麼稱呼您？"
              className="w-full px-5 py-4 bg-white/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all placeholder:text-slate-300"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>
        )}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1 ml-1">手機號或郵箱</label>
          <input
            type="text"
            required
            placeholder="example@mail.com"
            className="w-full px-5 py-4 bg-white/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all placeholder:text-slate-300"
            value={formData.identifier}
            onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1 ml-1">驗證碼 / 密碼</label>
          <input
            type="password"
            required
            placeholder="••••••"
            className="w-full px-5 py-4 bg-white/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all placeholder:text-slate-300"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-2xl shadow-lg shadow-orange-200 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? '處理中...' : (isRegister ? '完成註冊' : '進入系統')}
        </button>
      </form>

      <div className="mt-8 text-center">
        <button
          onClick={() => setIsRegister(!isRegister)}
          className="text-sm text-orange-600 hover:text-orange-700 font-medium"
        >
          {isRegister ? '已有帳號？去登入' : '沒有帳號？立即開啟'}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
