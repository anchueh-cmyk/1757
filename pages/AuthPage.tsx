
import React, { useState } from 'react';
import { User } from '../types';
import { mockDatabase } from '../services/mockDatabase';

interface AuthPageProps {
  onLogin: (user: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    identifier: '',
    password: '', 
    username: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      // 管理員固定登入
      if (formData.identifier === 'adminalan' && formData.password === 'acc!@1757') {
        const adminUser: User = {
          id: 'admin_001',
          username: '管理員 Alan',
          lastCheckIn: null,
          streak: 0,
          contacts: [],
          records: [],
          isAdmin: true
        };
        onLogin(adminUser);
        setLoading(false);
        return;
      }

      if (isRegister) {
        const user = mockDatabase.register(formData.username || formData.identifier);
        if (user) {
          onLogin(user);
        } else {
          setError('該帳號名稱已被使用');
        }
      } else {
        const user = mockDatabase.findUserByIdentifier(formData.identifier);
        if (user) {
          onLogin(user);
        } else {
          setError('帳號不存在，請先註冊');
        }
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="w-full max-w-md p-8 glass-card rounded-[40px] shadow-2xl animate-in fade-in zoom-in duration-700 mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-light text-slate-800 tracking-tight transition-all duration-500">
          {isRegister ? '加入安安' : '歡迎回來'}
        </h2>
        <p className="mt-2 text-slate-400 font-light text-sm">
          {isRegister ? '讓愛的人隨時知道你安好' : '報個平安，讓大家放心'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-500 text-xs p-3 rounded-xl text-center border border-red-100 animate-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {isRegister && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500">
              <label className="block text-xs font-medium text-slate-500 mb-1.5 ml-1 uppercase tracking-wider">您的稱呼</label>
              <input
                type="text"
                required
                placeholder="親友怎麼稱呼您？"
                className="w-full px-5 py-4 bg-white/50 border border-slate-100 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all placeholder:text-slate-300"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5 ml-1 uppercase tracking-wider">帳號 / 郵箱</label>
            <input
              type="text"
              required
              placeholder="請輸入帳號"
              className="w-full px-5 py-4 bg-white/50 border border-slate-100 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all placeholder:text-slate-300"
              value={formData.identifier}
              onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5 ml-1 uppercase tracking-wider">安全密碼</label>
            <input
              type="password"
              required
              placeholder="••••••"
              className="w-full px-5 py-4 bg-white/50 border border-slate-100 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all placeholder:text-slate-300"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-interact w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-[20px] shadow-lg shadow-orange-100 transition-all active:scale-95 disabled:opacity-50 overflow-hidden relative"
        >
          {loading ? (
             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
          ) : (
            isRegister ? '立即開啟守護' : '進入系統'
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <button
          onClick={() => {
            setIsRegister(!isRegister);
            setError('');
          }}
          className="btn-interact text-sm text-slate-400 hover:text-orange-600 font-medium px-4 py-2"
        >
          {isRegister ? '已有帳號？點此登入' : '第一次使用？建立新帳號'}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
