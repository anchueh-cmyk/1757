
import React, { useState, useEffect } from 'react';
import { User, UserStatus } from '../types';
import { mockDatabase } from '../services/mockDatabase';
import { notificationService } from '../services/notificationService';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { STATUS_MAP } from '../constants';

interface DashboardProps {
  user: User;
  onUpdate: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onUpdate }) => {
  const [status, setStatus] = useState<UserStatus>(UserStatus.GREAT);
  const [message, setMessage] = useState('');
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [alreadyCheckedIn, setAlreadyCheckedIn] = useState(false);
  const [showSuccessAnim, setShowSuccessAnim] = useState(false);
  const [notifStatus, setNotifStatus] = useState<{ label: string, type: 'info' | 'error' | 'success' | '' }>({ label: '', type: '' });

  useEffect(() => {
    if (user.lastCheckIn) {
      const today = new Date().toDateString();
      const last = new Date(user.lastCheckIn).toDateString();
      setAlreadyCheckedIn(today === last);
    }
  }, [user.lastCheckIn]);

  const handleCheckIn = async () => {
    setIsCheckingIn(true);
    
    // 觸發簽到邏輯
    const updatedUser = mockDatabase.checkIn(user.id, status, message);
    
    if (updatedUser && updatedUser.contacts.length > 0) {
      setNotifStatus({ label: '正在通知親友...', type: 'info' });
      const results = await notificationService.sendCheckInNotification(updatedUser, status, message);
      
      const realSuccess = results.some(r => !r.isMock && r.success);
      if (realSuccess) {
        setNotifStatus({ label: '真實郵件已發送！', type: 'success' });
      } else {
        const mockNotice = results.some(r => r.isMock);
        setNotifStatus({ 
          label: mockNotice ? '演示模式：已在控制台輸出內容' : '發送失敗', 
          type: mockNotice ? 'info' : 'error' 
        });
      }
    }

    // 模擬網路延遲並觸發完成動畫
    setTimeout(() => {
      onUpdate();
      setIsCheckingIn(false);
      setShowSuccessAnim(true);
      setMessage('');
      setTimeout(() => setNotifStatus({ label: '', type: '' }), 3000);
    }, 1200);
  };

  const chartData = [...user.records]
    .reverse()
    .slice(-7)
    .map(r => ({
      name: new Date(r.timestamp).toLocaleDateString(undefined, { weekday: 'short' }),
      score: STATUS_MAP[r.status].score
    }));

  return (
    <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-10 duration-700 mx-auto px-4">
      <div className="md:col-span-2 space-y-6">
        <div className={`glass-card rounded-[32px] p-8 relative overflow-hidden transition-all duration-700 ${showSuccessAnim ? 'animate-success-pop' : ''}`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full blur-3xl opacity-50 -mr-10 -mt-10"></div>
          
          <div className="flex justify-between items-start mb-12">
            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-1">連續簽到</h3>
              <div className="flex items-baseline">
                <span className="text-6xl font-light text-slate-800">{user.streak}</span>
                <span className="ml-2 text-slate-400">天</span>
              </div>
            </div>
            <div className="text-right">
              <h3 className="text-sm font-medium text-slate-400 mb-1">今日狀態</h3>
              <span className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-500 ${alreadyCheckedIn ? 'bg-green-50 text-green-600 border-green-100' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                {alreadyCheckedIn ? '已同步' : '未同步'}
              </span>
            </div>
          </div>

          {!alreadyCheckedIn ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.values(UserStatus).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`btn-interact py-3 px-2 rounded-2xl border text-sm transition-all duration-300 ${
                      status === s 
                        ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-200' 
                        : 'bg-white/50 border-slate-100 text-slate-500 hover:border-orange-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="留一句話給親友吧..."
                  className="w-full px-6 py-4 bg-white/80 rounded-2xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleCheckIn}
                  disabled={isCheckingIn}
                  className="btn-interact w-full py-5 bg-orange-500 hover:bg-orange-600 text-white text-xl font-light tracking-wide rounded-[24px] shadow-xl shadow-orange-100 animate-pulse-soft flex flex-col items-center justify-center disabled:opacity-80"
                >
                  {isCheckingIn ? (
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mb-1"></div>
                      <span className="text-xs font-medium opacity-80">發送中</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <span>我很好，不用擔心</span>
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
                
                {notifStatus.label && (
                  <div className={`text-center py-2 px-4 rounded-xl text-xs font-medium animate-in fade-in slide-in-from-top-2 ${
                    notifStatus.type === 'success' ? 'bg-green-50 text-green-600' : 
                    notifStatus.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-500'
                  }`}>
                    {notifStatus.label}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-full mb-6 animate-in zoom-in duration-700">
                <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-light text-slate-700 mb-2">今日已報平安</h2>
              <p className="text-slate-400">系統已守護您的狀態，明天見</p>
            </div>
          )}
        </div>

        <div className="glass-card rounded-[32px] p-8 h-64">
          <h3 className="text-sm font-medium text-slate-400 mb-6">狀態穩定度</h3>
          {chartData.length > 1 ? (
            <ResponsiveContainer width="100%" height="80%">
              <LineChart data={chartData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                <YAxis hide domain={[0, 5]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#f97316" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#f97316', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  animationDuration={2000}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-300 italic text-sm">
              累積簽到後將顯示趨勢圖
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="glass-card rounded-[32px] p-6 h-full flex flex-col min-h-[400px]">
          <h3 className="text-sm font-medium text-slate-400 mb-6 px-2">歷史軌跡</h3>
          <div className="space-y-4 overflow-y-auto pr-1 flex-grow scrollbar-hide">
            {user.records.length > 0 ? user.records.map((record) => (
              <div key={record.id} className="p-4 bg-white/40 rounded-2xl border border-white/50 transition-all hover:bg-white hover:shadow-md hover:scale-[1.02] duration-300">
                <div className="flex justify-between items-start mb-2">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border ${STATUS_MAP[record.status].color}`}>
                    {record.status}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(record.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-slate-600 line-clamp-2">
                  {record.message || '我很好，不用擔心'}
                </p>
              </div>
            )) : (
              <div className="text-center py-20">
                <p className="text-slate-300 text-sm italic">尚無歷史紀錄</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
