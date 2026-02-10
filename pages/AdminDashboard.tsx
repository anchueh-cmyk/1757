
import React, { useMemo } from 'react';
import { mockDatabase } from '../services/mockDatabase';
import { STATUS_MAP } from '../constants';

const AdminDashboard: React.FC = () => {
  const users = mockDatabase.getAllUsers();

  const stats = useMemo(() => {
    const now = Date.now();
    const twentyFourHoursAgo = now - 24 * 60 * 60 * 1000;
    const today = new Date().toDateString();

    const checkedInToday = users.filter(u => 
      u.lastCheckIn && new Date(u.lastCheckIn).toDateString() === today
    ).length;

    const needsAttention = users.filter(u => 
      !u.isAdmin && (!u.lastCheckIn || (u.lastCheckIn && u.lastCheckIn < twentyFourHoursAgo))
    ).length;

    return {
      total: users.filter(u => !u.isAdmin).length,
      checkedInToday,
      needsAttention
    };
  }, [users]);

  return (
    <div className="w-full max-w-6xl px-4 py-8 animate-in fade-in slide-in-from-bottom-5 duration-700 mx-auto">
      <div className="mb-10 text-center sm:text-left">
        <h2 className="text-4xl font-light text-slate-800 tracking-tight">系統管理中心</h2>
        <p className="text-slate-400 mt-2 font-light">即時監控所有用戶的存活狀態與簽到記錄</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="glass-card rounded-[32px] p-8 border-b-4 border-b-blue-400 transition-all duration-300 hover:shadow-lg">
          <p className="text-sm font-medium text-slate-400 mb-1">總用戶數</p>
          <p className="text-4xl font-light text-slate-800">{stats.total}</p>
        </div>
        <div className="glass-card rounded-[32px] p-8 border-b-4 border-b-green-400 transition-all duration-300 hover:shadow-lg">
          <p className="text-sm font-medium text-slate-400 mb-1">今日已簽到</p>
          <p className="text-4xl font-light text-slate-800">{stats.checkedInToday}</p>
        </div>
        <div className="glass-card rounded-[32px] p-8 border-b-4 border-b-red-400 transition-all duration-300 hover:shadow-lg">
          <p className="text-sm font-medium text-slate-400 mb-1">需要關注</p>
          <div className="flex items-baseline space-x-2">
            <p className="text-4xl font-light text-red-500">{stats.needsAttention}</p>
            <span className="text-xs text-red-300 font-medium">逾 24H 未更新</span>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-[32px] overflow-hidden shadow-2xl shadow-slate-200/50 border border-white/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">用戶</th>
                <th className="px-8 py-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">最後同步時間</th>
                <th className="px-8 py-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">狀態</th>
                <th className="px-8 py-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">連續天數</th>
                <th className="px-8 py-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">備註</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {users.map((u) => {
                if (u.isAdmin) return null;
                const latestRecord = u.records[0];
                const isLate = !u.lastCheckIn || (Date.now() - (u.lastCheckIn || 0) > 24 * 60 * 60 * 1000);
                
                return (
                  <tr key={u.id} className="hover:bg-white/40 transition-colors group">
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-sm font-bold text-orange-400 group-hover:bg-orange-100 transition-colors">
                          {u.username.substring(0, 1)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700">{u.username}</p>
                          <p className="text-[10px] text-slate-400">ID: {u.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-sm text-slate-500">
                        {u.lastCheckIn ? new Date(u.lastCheckIn).toLocaleString('zh-TW', { hour12: false }) : '無記錄'}
                      </div>
                      {isLate && (
                        <span className="text-[10px] text-red-500 font-bold bg-red-50 px-1.5 py-0.5 rounded mt-1 inline-block animate-pulse">
                          ⚠️ 需要關注
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      {latestRecord ? (
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${STATUS_MAP[latestRecord.status].color}`}>
                          {latestRecord.status}
                        </span>
                      ) : (
                        <span className="text-slate-300 text-xs italic">尚未簽到</span>
                      )}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-light text-slate-800">{u.streak}</span>
                        <span className="text-[10px] text-slate-400 tracking-tighter">DAYS</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm text-slate-500 max-w-xs truncate font-light">
                      {latestRecord?.message || <span className="text-slate-200 italic">無留言</span>}
                    </td>
                  </tr>
                );
              })}
              {users.filter(u => !u.isAdmin).length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-300">
                      <svg className="w-12 h-12 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <p className="italic">目前尚無用戶資料</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
